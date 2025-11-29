// Diagnostic script — run with `node scripts/check_supabase.js`
// Loads .env, then queries users and trips for the demo email.
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const DEMO_EMAIL = process.env.DEMO_USER_EMAIL || "demo@example.com";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment.");
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log("Using demo email:", DEMO_EMAIL);
  const { data: users, error: uErr } = await supabase
    .from("users")
    .select("*")
    .eq("email", DEMO_EMAIL)
    .limit(1);
  if (uErr) {
    console.error("Error fetching user:", uErr.message, uErr);
  } else {
    console.log("User query result:", users);
  }

  if (!users || users.length === 0) {
    console.log("No demo user found.");
    process.exit(0);
  }

  const userId = users[0].id;
  console.log("Demo user id:", userId);

  const { data: trips, error: sErr } = await supabase
    .from("trips")
    .select("*,driving_scores(*)")
    .eq("user_id", userId)
    .order("start_time", { ascending: false });

  if (sErr) {
    console.error("Error fetching trips:", sErr.message, sErr);
  } else {
    console.log("Trips count:", trips ? trips.length : 0);
    console.log(JSON.stringify(trips, null, 2));
  }
}

run().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
