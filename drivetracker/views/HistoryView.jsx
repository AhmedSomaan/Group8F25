import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import TripCard from "../components/TripCard";
import COLORS from "../styles/theme";
import THRESHOLDS from "../services/thresholds";
import OverallScoreBadge from "../components/OverallScoreBadge";

const HistoryView = ({ trips, loading, user }) => {
  if (loading) {
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const score = Math.floor(Number(user?.user_score || 0));
  let tierLabel = "Poor";
  let tierColor = COLORS.scoreBad;
  let tierIcon = require("../assets/sad-face.png");
  if (score >= THRESHOLDS.badgeGood) {
    tierLabel = "Good";
    tierColor = COLORS.scoreGood;
    tierIcon = require("../assets/happy-face.png");
  } else if (score >= THRESHOLDS.badgeOk) {
    tierLabel = "OK";
    tierColor = COLORS.scoreOk;
    tierIcon = require("../assets/neutral-face.png");
  }

  return (
    <View style={styles.container}>
      {user && (
        <View style={styles.userHeader}>
          <Text style={styles.header}>Your overall score</Text>
          <View style={styles.userScoreWrap}>
            <View style={[styles.userScoreBox, { backgroundColor: tierColor }]}>
              <OverallScoreBadge
                score={score}
                accessibilityLabel={`Your overall score ${score}`}
              />
            </View>
          </View>
        </View>
      )}
      {trips.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No trips found.</Text>
          <Text style={styles.emptySub}>
            Start a trip to see it listed here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => String(item.id || item.start_time)}
          renderItem={({ item }) => <TripCard item={item} onPress={() => {}} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default HistoryView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 12,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.textDark,
  },
  userHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  userScoreWrap: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    marginLeft: 10,
    fontWeight: "700",
    fontSize: 14,
  },
  userScoreBox: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  userScoreText: {
    color: COLORS.onPrimary,
    fontWeight: "900",
    fontSize: 36,
    marginLeft: 8,
  },
  tierIconSmall: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  listContent: {
    paddingBottom: 24,
  },

  emptyState: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 6,
  },
  emptySub: {
    color: COLORS.textMuted,
  },
});
