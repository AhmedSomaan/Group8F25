import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import THRESHOLDS from "../services/thresholds";
import COLORS from "../styles/theme";

const OverallScoreBadge = ({ score = 0, onPress, accessibilityLabel }) => {
  const s = Math.floor(Number(score || 0));
  let tierColor = COLORS.scoreBad;
  let tierIcon = require("../assets/sad-face.png");
  if (s >= THRESHOLDS.badgeGood) {
    tierColor = COLORS.scoreGood;
    tierIcon = require("../assets/happy-face.png");
  } else if (s >= THRESHOLDS.badgeOk) {
    tierColor = COLORS.scoreOk;
    tierIcon = require("../assets/neutral-face.png");
  }

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.scoreBox, { backgroundColor: tierColor }]}
      onPress={onPress}
      accessibilityRole={onPress ? "button" : "image"}
      accessibilityLabel={accessibilityLabel || `Overall score ${s}`}
    >
      <Image
        source={tierIcon}
        style={styles.icon}
        accessibilityIgnoresInvertColors
      />
      <Text style={styles.scoreText}>{s}</Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  scoreBox: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  scoreText: {
    color: COLORS.onPrimary,
    fontWeight: "900",
    fontSize: 36,
    marginLeft: 8,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
});

export default OverallScoreBadge;
