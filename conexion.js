import { createClient } from "@supabase/supabase-js";

const CONEXION=createClient(
    process.env.SUPA_BASE_URL,
    process.env.SUPA_ANON_KEY
)

export default CONEXION