// Scoring and distance utilities for trips.
// Keep these small and single-responsibility so scoring rules can be changed easily.

/** Haversine distance between two {latitude, longitude} points in meters */
export function haversineMeters(a, b) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const sinDLat = Math.sin(dLat / 2) * Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c =
    2 *
    Math.atan2(
      Math.sqrt(sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon),
      Math.sqrt(1 - (sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon))
    );
  return R * c;
}