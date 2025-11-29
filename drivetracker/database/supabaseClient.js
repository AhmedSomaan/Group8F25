import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

const expoExtra = Constants.expoConfig?.extra || {};
const SUPABASE_URL = expoExtra.SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY =
  expoExtra.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "Supabase client not configured. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are provided."
  );
}

export const supabase = createClient(
  SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY ?? ""
);
