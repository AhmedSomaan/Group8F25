import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import COLORS from "../styles/theme";
import OverallScoreBadge from "../components/OverallScoreBadge";

const HomeView = ({ user, loading, onTrackPress, onHistoryPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ marginBottom: 10, alignItems: "center" }}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.title}>
              Hello{user?.name ? `, ${user.name}` : ""}!
            </Text>
          )}
        </View>
        <Text style={styles.subtitle}>Welcome to DriveTracker!</Text>
      </View>
      {user?.user_score != null ? (
        <View style={styles.userHeader}>
          <Text style={styles.scoreLabel}>Your overall score</Text>
          <OverallScoreBadge
            score={Math.floor(Number(user.user_score || 0))}
            accessibilityLabel={`Your overall score ${Math.floor(Number(user.user_score || 0))}`}
          />
        </View>
      ) : null}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={onTrackPress}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Track a New Trip</Text>
          <Image
            source={require("../assets/track.png")}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onHistoryPress}
          accessibilityRole="button"
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            View Trip History
          </Text>
          <Image
            source={require("../assets/history_blue.png")}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "400",
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  userHeader: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreLabel: {
    fontSize: 23,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  buttonsContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 12,
    minWidth: "80%",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: COLORS.onPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
    resizeMode: "contain",
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
});
