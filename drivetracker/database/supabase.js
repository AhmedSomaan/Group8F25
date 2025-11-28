import { supabase } from "./supabaseClient";

function ensureConfigured() {
  if (!supabase || !supabase.auth) {
    console.warn("Supabase client not configured");
    return false;
  }
  return true;
}

export async function getOrCreateDemoUser() {
  if (!ensureConfigured()) return null;
  const demoEmail =
    (typeof process !== "undefined" &&
      process.env &&
      process.env.DEMO_USER_EMAIL) ||
    "demo@example.com";

  try {
    const { data: users, error: uErr } = await supabase
      .from("users")
      .select("*")
      .eq("email", demoEmail)
      .limit(1);
    if (uErr) {
      console.warn("Failed to query demo user:", uErr.message || uErr);
    }
    if (users && users.length) {
      // Try to recompute the user's score on the server so returned user is fresh
      const existing = users[0];
      try {
        console.warn("Recomputing demo user's score via RPC...");
        await supabase.rpc("recompute_user_score", { p_user_id: existing.id });
        const { data: refreshed, error: refErr } = await supabase
          .from("users")
          .select("*")
          .eq("id", existing.id)
          .maybeSingle();
        console.log("Demo user score recomputed: ", refreshed);
        if (!refErr && refreshed) return refreshed;
      } catch (e) {
        console.warn(
          "recompute_user_score RPC failed while fetching demo user:",
          e?.message || e
        );
      }
      return existing;
    }

    // create demo user
    const { data: created, error: cErr } = await supabase
      .from("users")
      .insert([{ email: demoEmail, full_name: "Demo User" }])
      .select()
      .maybeSingle();
    if (cErr) {
      console.warn("Failed to create demo user:", cErr.message || cErr);
      return null;
    }

    // After creating the demo user, recompute the user's score on the server
    // so callers get an up-to-date `user_score` value.
    try {
      if (created && created.id) {
        await supabase.rpc("recompute_user_score", { p_user_id: created.id });
        const { data: refreshed, error: refErr } = await supabase
          .from("users")
          .select("*")
          .eq("id", created.id)
          .maybeSingle();
        if (!refErr && refreshed) return refreshed;
      }
    } catch (e) {
      console.warn(
        "recompute_user_score RPC failed after creating demo user:",
        e?.message || e
      );
    }

    return created || null;
  } catch (e) {
    console.warn("getOrCreateDemoUser error:", e?.message || e);
    return null;
  }
}

export async function getTripsForUser(userId) {

}

export async function insertTrip(userId) {

}

export async function insertScore(score) {

}

