import { supabase } from "./supabaseClient";

function ensureConfigured() {
  if (!supabase || !supabase.auth) {
    console.warn("Supabase client not configured");
    return false;
  }
  return true;
}

export async function getOrCreateDemoUser() {

}

export async function getTripsForUser(userId) {

}

export async function insertTrip(userId) {

}

export async function insertScore(score) {

}

