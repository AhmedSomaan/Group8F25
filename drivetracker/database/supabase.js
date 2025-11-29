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
  if (!ensureConfigured()) return [];
  const { data, error } = await supabase
    .from("trips")
    .select("*,driving_scores(*)")
    .eq("user_id", userId)
    .order("start_time", { ascending: false });
  if (error) {
    console.warn("Failed to fetch trips:", error.message);
    return [];
  }
  return data || [];
}

export async function insertTrip(userId) {
  if (!ensureConfigured()) return null;
  const { data, error } = await supabase
    .from("trips")
    .insert([trip])
    .select()
    .maybeSingle();
  if (error) {
    console.warn("Failed to insert trip:", error.message);
    return null;
  }
  return data || null;
}

export async function insertScore(score) {
  if (!ensureConfigured()) return null;
  const { data, error } = await supabase
    .from("driving_scores")
    .insert([score])
    .select()
    .maybeSingle();
  if (error) {
    console.warn("Failed to insert driving score:", error.message);
    return null;
  }
  const inserted = data || null;

  // If we inserted a score tied to a trip, attempt to recompute the user's
  // average on the server using a stored procedure `recompute_user_score`.
  // This is a single server-side operation for efficiency. If the RPC isn't
  // available or fails, fall back to the client-side aggregation already used.
  // Try to compute the user's new average on the server via RPC and return it
  // together with the inserted score. If the RPC is not available or fails,
  // fall back to the previous client-side aggregation and persist the value.
  let userScore = null;
  try {
    const tripId = inserted?.trip_id;
    if (tripId) {
      // get trip -> user_id
      const { data: tripRec, error: tripErr } = await supabase
        .from("trips")
        .select("user_id")
        .eq("id", tripId)
        .maybeSingle();
      if (!tripErr && tripRec && tripRec.user_id) {
        const userId = tripRec.user_id;
        try {
          const { data: rpcData, error: rpcErr } = await supabase.rpc(
            "recompute_user_score",
            { p_user_id: userId }
          );
          if (!rpcErr && rpcData != null) {
            // rpcData may be a scalar, an object, or an array depending on the DB client.
            if (typeof rpcData === "number" || typeof rpcData === "string") {
              userScore = parseFloat(rpcData);
            } else if (Array.isArray(rpcData) && rpcData.length) {
              const v = rpcData[0];
              userScore =
                v?.recompute_user_score != null
                  ? parseFloat(v.recompute_user_score)
                  : v?.user_score != null
                    ? parseFloat(v.user_score)
                    : null;
            } else if (rpcData && typeof rpcData === "object") {
              userScore =
                rpcData.recompute_user_score != null
                  ? parseFloat(rpcData.recompute_user_score)
                  : rpcData.user_score != null
                    ? parseFloat(rpcData.user_score)
                    : null;
            }
          }
          console.warn("recomputed user score via RPC:", userScore);
        } catch (rpcErr) {
          console.warn(
            "recompute_user_score RPC failed, falling back to client aggregation:",
            rpcErr?.message || rpcErr
          );

          // FALLBACK: client-side aggregation (previous implementation)
          const { data: userTrips, error: userTripsErr } = await supabase
            .from("trips")
            .select("id")
            .eq("user_id", userId);
          if (!userTripsErr && userTrips && userTrips.length) {
            const tripIds = userTrips.map((t) => t.id);
            const { data: scores, error: scoresErr } = await supabase
              .from("driving_scores")
              .select("overall_score")
              .in("trip_id", tripIds);
            if (!scoresErr && scores) {
              const nums = scores
                .map((s) =>
                  s && s.overall_score != null
                    ? parseFloat(s.overall_score)
                    : NaN
                )
                .filter((n) => !isNaN(n));
              const avg = nums.length
                ? nums.reduce((a, b) => a + b, 0) / nums.length
                : null;
              if (avg !== null) {
                userScore = avg;
                await supabase
                  .from("users")
                  .update({ user_score: avg })
                  .eq("id", userId);
              }
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn("Failed to update user average score:", e?.message || e);
  }

  return { score: inserted, user_score: userScore };
}
