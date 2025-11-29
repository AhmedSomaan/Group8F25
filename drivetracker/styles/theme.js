// Centralized color theme for DriveTracker
// Minimal theme: single primary color + neutrals
export const COLORS = {
  primary: "#007AFF", // single main brand color used throughout
  // neutrals
  background: "#F7F8FA",
  surface: "#ffffff",
  textDark: "#0f172a",
  text: "#334155",
  textMuted: "#64748b",
  // map all accent roles to the single primary color to keep palette consistent
  accent: "#007AFF",
  success: "#007AFF",
  danger: "#007AFF",
  // score tiers (good / ok / bad) -- keep within the same visual family but distinct
  scoreGood: "#16A34A", // green
  scoreOk: "#F59E0B", // amber
  scoreBad: "#EF4444", // red
  onPrimary: "#ffffff",
  shadow: "#000000",
};

export default COLORS;
