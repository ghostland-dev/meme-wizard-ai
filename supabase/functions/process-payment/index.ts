import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return new Response(
        JSON.stringify({ error: "Session ID requis" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get session details
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ error: "Paiement non confirmé" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Update order and add credits
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get the order
    const { data: order, error: orderError } = await supabaseService
      .from("orders")
      .select("*")
      .eq("stripe_session_id", session_id)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Commande introuvable" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    if (order.status === "completed") {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Crédits déjà ajoutés",
          credits_added: order.credits_purchased 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update order status
    await supabaseService
      .from("orders")
      .update({ status: "completed" })
      .eq("id", order.id);

    // Add credits to user profile
    const { data: profile } = await supabaseService
      .from("profiles")
      .select("credits")
      .eq("user_id", order.user_id)
      .single();

    const currentCredits = profile?.credits || 0;
    const newCredits = currentCredits + order.credits_purchased;

    await supabaseService
      .from("profiles")
      .update({ credits: newCredits })
      .eq("user_id", order.user_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        credits_added: order.credits_purchased,
        total_credits: newCredits
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in process-payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});