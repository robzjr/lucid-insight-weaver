
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

    // Get current usage for both users to add credits properly
    const { data: referrerUsage, error: referrerUsageError } = await supabaseClient
      .from('user_usage')
      .select('*')
      .eq('user_id', referrerId)
      .single();

    if (referrerUsageError && referrerUsageError.code !== 'PGRST116') throw referrerUsageError;

    const { data: newUserUsage, error: newUserUsageError } = await supabaseClient
      .from('user_usage')
      .select('*')
      .eq('user_id', newUserId)
      .single();

    if (newUserUsageError && newUserUsageError.code !== 'PGRST116') throw newUserUsageError;

    // Calculate new credit amounts
    const referrerNewCredits = (referrerUsage?.paid_interpretations_remaining || 0) + 5;
    const newUserNewCredits = (newUserUsage?.paid_interpretations_remaining || 0) + 5;

    logStep("Adding credits", { 
      referrerId, 
      referrerCurrentCredits: referrerUsage?.paid_interpretations_remaining || 0,
      referrerNewCredits,
      newUserId,
      newUserCurrentCredits: newUserUsage?.paid_interpretations_remaining || 0,
      newUserNewCredits
    });

    // Update both users with added credits
    const promises = [
      // Update referrer
      supabaseClient
        .from('user_usage')
        .upsert({
          user_id: referrerId,
          free_interpretations_used: referrerUsage?.free_interpretations_used || 0,
          paid_interpretations_remaining: referrerNewCredits,
          referral_count: (referrerUsage?.referral_count || 0) + 1,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }),
      
      // Update new user
      supabaseClient
        .from('user_usage')
        .upsert({
          user_id: newUserId,
          free_interpretations_used: newUserUsage?.free_interpretations_used || 0,
          paid_interpretations_remaining: newUserNewCredits,
          referral_count: newUserUsage?.referral_count || 0,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
    ];

    const results = await Promise.all(promises);
    
    // Check for errors
    for (const result of results) {
      if (result.error) throw result.error;
    }

    logStep("Referral bonus applied successfully", { referrerId, newUserId, creditsAdded: 5 });

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
