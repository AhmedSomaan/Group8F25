// Thin model layer that re-exports database access functions.
// Keeps controllers unaware of the exact database implementation. for MVC pattern.
export {
  getOrCreateDemoUser,
  getTripsForUser,
  insertTrip,
  insertScore,
} from "../database/supabase";
