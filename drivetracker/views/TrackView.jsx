import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import COLORS from "../styles/theme";

const TrackView = ({
  MapViewComp,
  PolylineComp,
  MarkerComp,
  path,
  region,
  startTime,
  elapsedText,
  avgSpeedKmh,
  tracking,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      {MapViewComp ? (
        <MapViewComp
          style={styles.map}
          region={region}
          showsUserLocation
          followsUserLocation
        >
          {path.length > 0 && (
            <PolylineComp
              coordinates={path.map((p) => ({
                latitude: p.latitude,
                longitude: p.longitude,
              }))}
              strokeWidth={4}
              strokeColor={COLORS.primary}
            />
          )}
          {path.length > 0 && <MarkerComp coordinate={path[0]} title="Start" />}
          {path.length > 0 && (
            <MarkerComp coordinate={path[path.length - 1]} title="Current" />
          )}
        </MapViewComp>
      ) : (
        <View style={[styles.map, styles.webFallback]}>
          <Text style={{ marginBottom: 8, textAlign: "center" }}>
            Map view is not available in the web build.
          </Text>
          <Text style={{ textAlign: "center" }}>
            Use Expo Go / a real device or the Expo devtools location simulator
            to test tracking.
          </Text>
        </View>
      )}

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Start:</Text>
        <Text style={styles.infoValue}>
          {startTime ? new Date(startTime).toLocaleTimeString() : "—"}
        </Text>
        <Text style={[styles.infoLabel, { marginLeft: 12 }]}>Elapsed:</Text>
        <Text style={styles.infoValue}>{elapsedText}</Text>
        <Text style={[styles.infoLabel, { marginLeft: 12 }]}>Avg km/h:</Text>
        <Text style={styles.infoValue}>{avgSpeedKmh}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          tracking ? styles.buttonStop : styles.buttonStart,
        ]}
        onPress={onToggle}
      >
        <Text style={styles.buttonText}>
          {tracking ? "Stop Tracking" : "Start Tracking"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TrackView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  webFallback: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  infoRow: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: { color: COLORS.text, fontWeight: "600", fontSize: 12 },
  infoValue: { color: COLORS.textDark, marginLeft: 6, fontWeight: "700" },
  button: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonStart: { backgroundColor: COLORS.primary },
  buttonStop: { backgroundColor: COLORS.scoreBad },
  buttonText: { color: COLORS.onPrimary, fontWeight: "700", fontSize: 16 },
});
