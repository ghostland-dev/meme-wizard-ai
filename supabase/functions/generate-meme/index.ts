import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, imageUrl, style = 'viral' } = await req.json();

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    // Create authenticated client with the user's token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check user credits
    console.log('Checking credits for user:', user.id);
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('credits')
      .eq('user_id', user.id)
      .maybeSingle();

    console.log('Profile data:', profile);
    console.log('Profile error:', profileError);

    if (!profile || profile.credits <= 0) {
      console.log('Credits check failed - profile:', profile, 'credits:', profile?.credits);
      return new Response(
        JSON.stringify({ error: 'Crédits insuffisants' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 402 }
      );
    }

    // Generate meme using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Configuration OpenAI manquante' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const memePrompt = `Create a viral meme image with this style: ${style}. 
    Original prompt: ${prompt}. 
    Make it funny, engaging, and shareable. The image should be in meme format with clear text if needed.
    Style should be: ${style === 'viral' ? 'trending and popular' : style === 'funny' ? 'humorous and comedic' : 'classic meme style'}`;

    const startTime = Date.now();

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: memePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'high',
        output_format: 'png'
      }),
    });

    const generationTime = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      
      // Record failed generation
      await supabaseClient.from('meme_generations').insert({
        user_id: user.id,
        prompt: memePrompt,
        model_used: 'gpt-image-1',
        generation_time_ms: generationTime,
        status: 'failed',
        error_message: 'OpenAI API error'
      });

      return new Response(
        JSON.stringify({ error: 'Erreur lors de la génération' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const imageData = await response.json();
    const generatedImageUrl = imageData.data[0].url;

    // Download and store the image in Supabase Storage
    const imageResponse = await fetch(generatedImageUrl);
    const imageBlob = await imageResponse.blob();
    const fileName = `meme-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('meme-images')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors du stockage' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const publicUrl = supabaseClient.storage
      .from('meme-images')
      .getPublicUrl(fileName).data.publicUrl;

    // Create meme record
    const { data: meme, error: memeError } = await supabaseClient
      .from('memes')
      .insert({
        user_id: user.id,
        title: prompt.substring(0, 100),
        prompt,
        image_url: imageUrl || '',
        generated_image_url: publicUrl,
        style,
        status: 'generated'
      })
      .select()
      .single();

    if (memeError) {
      console.error('Meme creation error:', memeError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la sauvegarde' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Record successful generation
    await supabaseClient.from('meme_generations').insert({
      user_id: user.id,
      meme_id: meme.id,
      prompt: memePrompt,
      model_used: 'gpt-image-1',
      generation_time_ms: generationTime,
      status: 'completed'
    });

    // Decrease user credits
    await supabaseClient
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('user_id', user.id);

    return new Response(
      JSON.stringify({ 
        meme,
        creditsRemaining: profile.credits - 1
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-meme function:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});