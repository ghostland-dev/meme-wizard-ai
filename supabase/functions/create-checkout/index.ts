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
    const { package: packageType } = await req.json();

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user?.email) {
      return new Response(
        JSON.stringify({ error: "Non autorisé" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Define packages
    const packages = {
      "10-credits": {
        name: "Pack 10 Crédits",
        credits: 10,
        price: 299, // 2.99€
        description: "Parfait pour tester nos fonctionnalités"
      },
      "50-credits": {
        name: "Pack 50 Crédits",
        credits: 50,
        price: 999, // 9.99€ (économie de 5€)
        description: "Le plus populaire - Économisez 50%"
      },
      "100-credits": {
        name: "Pack 100 Crédits", 
        credits: 100,
        price: 1499, // 14.99€ (économie de 15€)
        description: "Maximum d'économies - Économisez 75%"
      }
    };

    const selectedPackage = packages[packageType as keyof typeof packages];
    if (!selectedPackage) {
      return new Response(
        JSON.stringify({ error: "Package invalide" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { 
              name: selectedPackage.name,
              description: selectedPackage.description
            },
            unit_amount: selectedPackage.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/`,
      metadata: {
        credits: selectedPackage.credits.toString(),
        user_id: user.id,
        package_type: packageType
      }
    });

    // Create order record
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    await supabaseService.from("orders").insert({
      user_id: user.id,
      stripe_session_id: session.id,
      amount: selectedPackage.price,
      credits_purchased: selectedPackage.credits,
      status: "pending"
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in create-checkout:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});