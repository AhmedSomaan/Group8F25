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

/** Compute total meters from a path array [{latitude, longitude, timestamp}, ...] */
export function computeTotalMetersFromPath(path = []) {
  if (!path || path.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    total += haversineMeters(path[i - 1], path[i]);
  }
  return total;
}

/** Compute average km/h from path (based on first/last timestamp and distance). Returns a number (km/h). */
export function computeAvgKmhFromPath(path = []) {
  if (!path || path.length < 2) return 0;
  const totalMeters = computeTotalMetersFromPath(path);
  const durationSec =
    (path[path.length - 1].timestamp - path[0].timestamp) / 1000;
  const avgMs = durationSec > 0 ? totalMeters / durationSec : 0;
  return avgMs * 3.6;
}

import { THRESHOLDS } from "./thresholds";

/** Braking score: simple penalty per hard brake. Keep function small so rule can change. */
export function computeBrakingScore(
  hardBrakes,
  base = 100,
  perEventPenalty = THRESHOLDS.brakingPenalty
) {
  return Math.max(0, base - hardBrakes * perEventPenalty);
}

/** Acceleration score: simple penalty per hard accel. */
export function computeAccelScore(
  hardAccels,
  base = 100,
  perEventPenalty = THRESHOLDS.accelPenalty
) {
  return Math.max(0, base - hardAccels * perEventPenalty);
}

/** Speed score: penalize average speeds above a threshold. */
export function computeSpeedScore(
  avgKmh,
  threshold = THRESHOLDS.speedThreshold
) {
  if (avgKmh <= threshold) return 100;
  return Math.max(0, Math.round(100 - (avgKmh - threshold) * 1.5));
}

/** Combine component scores into an overall score using configurable weights. */
export function computeOverallScore(
  { speed_score = 100, accel_score = 100, braking_score = 100 } = {},
  weights = THRESHOLDS.weights
) {
  const overall =
    weights.speed * speed_score +
    weights.accel * accel_score +
    weights.braking * braking_score;
  return Math.round(overall);
}
