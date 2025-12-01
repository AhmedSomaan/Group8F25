// Centralized thresholds and scoring configuration
// Edit values here to change scoring and sensor-detection behaviour across the app.

export const THRESHOLDS = {
  // Sensor detection thresholds (magnitude delta)
  hardAccel: 1.5,
  hardBrake: -1.5,

  // Scoring parameters
  speedThreshold: 50, // km/h
  brakingPenalty: 12, // points per hard brake
  accelPenalty: 10, // points per hard accel

  // Badge thresholds for UI (e.g., history cards)
  // badgeGood: score >= badgeGood is considered good
  // badgeOk: score >= badgeOk is considered okay
  badgeGood: 85,
  badgeOk: 70,

  // Overall score weights
  weights: {
    speed: 0.4,
    accel: 0.3,
    braking: 0.3,
  },
};

export default THRESHOLDS;
