import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const { data: dreams, error: dreamError } = await supabase
      .from('dreams')
      .select('id')
      .eq('user_id', userId);

    if (dreamError) throw dreamError;

    const dreamIds = dreams.map((d: { id: string }) => d.id);

    if (dreamIds.length > 0) {
      const { error: interpError } = await supabase
        .from('interpretations')
        .delete()
        .in('dream_id', dreamIds);
      if (interpError) throw interpError;
    }

    const { error: dreamsDeleteError } = await supabase
      .from('dreams')
      .delete()
      .eq('user_id', userId);
    if (dreamsDeleteError) throw dreamsDeleteError;

    const tables = [
      'profiles',
      'user_preferences',
      'user_usage',
      'user_credits',
      'payment_transactions',
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).delete().eq('user_id', userId);
      if (error && error.code !== 'PGRST116') throw error;
    }

    const { error: referralError } = await supabase
      .from('referrals')
      .delete()
      .or(`referrer_id.eq.${userId},referred_id.eq.${userId}`);
    if (referralError) throw referralError;

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
