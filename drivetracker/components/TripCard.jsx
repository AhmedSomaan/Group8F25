import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import COLORS from "../styles/theme";
import { THRESHOLDS } from "../services/thresholds";

const TripCard = ({ item, onPress }) => {
  const start = new Date(item.start_time);
  const end = item.end_time ? new Date(item.end_time) : null;
  const durationMin = end ? Math.round((end - start) / 60000) : null;
  const overall =
    item.driving_scores && item.driving_scores[0]
      ? item.driving_scores[0].overall_score
      : null;

  // Determine badge color by thresholds
  // thresholds: good >= 85, ok >= 70, else bad
  const overallNum = typeof overall === "number" ? overall : Number(overall);
  let badgeColor = COLORS.accent;
  if (!isNaN(overallNum)) {
    if (overallNum >= THRESHOLDS.badgeGood) badgeColor = COLORS.scoreGood;
    else if (overallNum >= THRESHOLDS.badgeOk) badgeColor = COLORS.scoreOk;
    else badgeColor = COLORS.scoreBad;
  }

  // Accessibility: choose face image and label for color-blind users
  let statusImage = null;
  let statusLabel = "Unknown";
  if (!isNaN(overallNum)) {
    if (overallNum >= THRESHOLDS.badgeGood) {
      statusImage = require("../assets/happy-face.png");
      statusLabel = "Good";
    } else if (overallNum >= THRESHOLDS.badgeOk) {
      statusImage = require("../assets/neutral-face.png");
      statusLabel = "Neutral";
    } else {
      statusImage = require("../assets/sad-face.png");
      statusLabel = "Poor";
    }
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(item)}
      accessibilityRole="button"
      accessibilityLabel={`Trip on ${start.toLocaleString()}. Score ${Math.round(overall ?? 0)}. ${statusLabel}`}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{start.toLocaleString()}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.coordText}>
          {item.start_lat && item.start_lng
            ? `From ${item.start_lat.toFixed(4)}, ${item.start_lng.toFixed(4)}`
            : "Start: —"}
        </Text>
        <Text style={styles.coordText}>
          {item.end_lat && item.end_lng
            ? `To ${item.end_lat.toFixed(4)}, ${item.end_lng.toFixed(4)}`
            : "End: —"}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {durationMin !== null ? `${durationMin} min` : "—"}
          </Text>
        </View>
      </View>

      {overall !== null ? (
        <View
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={`Score ${Math.round(overall)}: ${statusLabel}`}
          style={[styles.scoreContainer]}
        >
          <View style={[styles.scoreBadge, { backgroundColor: badgeColor }]}>
            {statusImage ? (
              <Image
                source={statusImage}
                style={styles.iconImage}
                accessibilityIgnoresInvertColors
              />
            ) : null}
            <Text style={styles.scoreText}>{Math.round(overall)}</Text>
          </View>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default TripCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 12,
    paddingRight: 72,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  scoreBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreContainer: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -20 }],
    height: 40,
    justifyContent: "center",
  },
  iconText: {
    color: COLORS.onPrimary,
    fontSize: 16,
    marginRight: 6,
    fontWeight: "700",
  },
  iconImage: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: "contain",
  },
  scoreText: {
    color: COLORS.onPrimary,
    fontWeight: "700",
  },
  cardBody: {},
  coordText: {
    color: COLORS.text,
    fontSize: 13,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
});
