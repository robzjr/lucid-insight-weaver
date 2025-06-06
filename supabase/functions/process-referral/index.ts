
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-REFERRAL] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { referralCode, newUserId } = await req.json();
    
    if (!referralCode || !newUserId) {
      throw new Error("Missing referral code or new user ID");
    }

    logStep("Processing referral", { referralCode, newUserId });

    // Find the referrer by matching the referral code (first 8 chars of user ID)
    const { data: referrerProfiles, error: referrerError } = await supabaseClient
      .from('profiles')
      .select('id')
      .like('id', `${referralCode}%`)
      .limit(1);

    if (referrerError) throw referrerError;

    if (!referrerProfiles || referrerProfiles.length === 0) {
      logStep("No referrer found for code", { referralCode });
      return new Response(JSON.stringify({ success: false, error: "Invalid referral code" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const referrerId = referrerProfiles[0].id;
    logStep("Found referrer", { referrerId });

    // Check if this user has already been referred
    const { data: existingReferral, error: checkError } = await supabaseClient
      .from('user_usage')
      .select('*')
      .eq('user_id', newUserId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    if (existingReferral && existingReferral.paid_interpretations_remaining > 0) {
      logStep("User already has been referred", { newUserId });
      return new Response(JSON.stringify({ success: false, error: "User already referred" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Add 5 interpretations to both users
    const promises = [
      // Add to referrer
      supabaseClient
        .from('user_usage')
        .upsert({
          user_id: referrerId,
          paid_interpretations_remaining: 5,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }),
      
      // Add to new user
      supabaseClient
        .from('user_usage')
        .upsert({
          user_id: newUserId,
          paid_interpretations_remaining: 5,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
    ];

    const results = await Promise.all(promises);
    
    // Check for errors
    for (const result of results) {
      if (result.error) throw result.error;
    }

    logStep("Referral bonus applied successfully", { referrerId, newUserId });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-referral", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
