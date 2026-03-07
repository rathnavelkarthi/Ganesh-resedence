import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const { email, password, name, phone, role, status, tenant_id } = await req.json();

    if (!email || !password || !name || !role || !tenant_id) {
      throw new Error("Missing required fields");
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Create the user in Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role }
    });

    if (authError) {
      // Check if user already exists
      if (authError.message.includes("already registered")) {
        throw new Error("A user with this email already exists.");
      }
      throw authError;
    }

    const userId = authData.user.id;

    // 2. Insert into the staff table
    const { error: staffError } = await supabaseAdmin.from('staff').insert([{
      id: userId,
      tenant_id,
      name,
      email,
      phone,
      role,
      status: status.toUpperCase()
    }]);

    if (staffError) {
      // Rollback Auth user if staff insertion fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw staffError;
    }

    return new Response(JSON.stringify({
      user: { id: userId, email, name, role, status }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
