import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const resumeBucket = import.meta.env.VITE_SUPABASE_RESUME_BUCKET;

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);
export const supabaseResumeBucket = resumeBucket || "resumes";

export const supabase = hasSupabaseEnv
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
