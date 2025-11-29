import React, { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";
import storage from "../services/storage";
import TrackView from "../views/TrackView";
import {
  getOrCreateDemoUser,
  insertTrip,
  insertScore,
} from "../models/supabaseModel";
import {
  computeTotalMetersFromPath,
  computeAvgKmhFromPath,
  computeBrakingScore,
  computeAccelScore,
  computeSpeedScore,
  computeOverallScore,
} from "../services/scoring";
import { THRESHOLDS } from "../services/thresholds";

// Configuration used by the controller
const CONFIG = {
  location: { timeInterval: 3000, distanceInterval: 5 },
  sensors: { updateInterval: 200 },
};

const TrackController = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  const startTimeRef = useRef(null);
  const [tracking, setTracking] = useState(false);
  const [path, setPath] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const elapsedIntervalRef = useRef(null);
  const [avgSpeedKmh, setAvgSpeedKmh] = useState(0);
  const accelPrevRef = useRef(null);
  const accelEventCountRef = useRef(0);
  const brakeEventCountRef = useRef(0);
  const locationSubRef = useRef(null);
  const accelSubRef = useRef(null);

  const mapCompsRef = useRef(null);
  useEffect(() => {
    if (Platform?.OS === "web") {
      mapCompsRef.current = null;
      return;
    }
    try {
      // eslint-disable-next-line global-require
      const MapLib = require("react-native-maps");
      mapCompsRef.current = {
        MapView: MapLib.default || MapLib.MapView || MapLib,
        Polyline: MapLib.Polyline,
        Marker: MapLib.Marker,
      };
    } catch (e) {
      console.warn("react-native-maps not available:", e.message);
      mapCompsRef.current = null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await getOrCreateDemoUser();
      if (mounted) setUser(u);
    })();
    return () => (mounted = false);
  }, []);

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      // permission denied
      return;
    }

    setPath([]);
    setStartTime(Date.now());
    setElapsedMs(0);
    accelPrevRef.current = null;
    accelEventCountRef.current = 0;
    brakeEventCountRef.current = 0;
    setAvgSpeedKmh(0);

    startTimeRef.current = Date.now();
    setStartTime(startTimeRef.current);
    elapsedIntervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 1000);

    locationSubRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: CONFIG.location.timeInterval,
        distanceInterval: CONFIG.location.distanceInterval,
      },
      (loc) => {
        const { latitude, longitude } = loc.coords;
        const timestamp = loc.timestamp || Date.now();
        setPath((p) => {
          const next = [...p, { latitude, longitude, timestamp }];
          if (next.length >= 2) {
            const avgKmh = computeAvgKmhFromPath(next);
            setAvgSpeedKmh(Number(avgKmh.toFixed(1)));
          }
          return next;
        });
      }
    );

    Accelerometer.setUpdateInterval(CONFIG.sensors.updateInterval);
    accelSubRef.current = Accelerometer.addListener((acc) => {
      const mag = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      const prev = accelPrevRef.current;
      if (prev !== null) {
        const delta = mag - prev;
        if (delta <= THRESHOLDS.hardBrake) brakeEventCountRef.current += 1;
        else if (delta >= THRESHOLDS.hardAccel) accelEventCountRef.current += 1;
      }
      accelPrevRef.current = mag;
    });

    startTimeRef.current = Date.now();
    setStartTime(startTimeRef.current);
    setTracking(true);
  };

  const stopTracking = async () => {
    if (locationSubRef.current) {
      locationSubRef.current.remove();
      locationSubRef.current = null;
    }
    if (accelSubRef.current) {
      accelSubRef.current.remove();
      accelSubRef.current = null;
    }
    if (elapsedIntervalRef.current) {
      clearInterval(elapsedIntervalRef.current);
      elapsedIntervalRef.current = null;
    }

    setTracking(false);

    if (!path || path.length === 0) {
      return;
    }
    const startPt = path[0];
    const endPt = path[path.length - 1];
    const start_time = new Date(startPt.timestamp).toISOString();
    const end_time = new Date(endPt.timestamp).toISOString();

    const totalMeters = computeTotalMetersFromPath(path);
    const avgKmh = computeAvgKmhFromPath(path);

    const hardBrakes = brakeEventCountRef.current || 0;
    const hardAccels = accelEventCountRef.current || 0;

    const braking_score = computeBrakingScore(hardBrakes);
    const accel_score = computeAccelScore(hardAccels);
    const speed_score = computeSpeedScore(avgKmh, THRESHOLDS.speedThreshold);

    const overall_score = computeOverallScore({
      speed_score,
      accel_score,
      braking_score,
    });

    const trip = {
      user_id: user?.id || null,
      start_time,
      end_time,
      start_lat: startPt.latitude,
      start_lng: startPt.longitude,
      end_lat: endPt.latitude,
      end_lng: endPt.longitude,
    };

    const scoreObj = {
      overall_score,
      braking_score,
      accel_score,
      speed_score,
    };

    try {
      const u = await getOrCreateDemoUser();
      if (!u) throw new Error("User not available");
      trip.user_id = u.id;

      const inserted = await insertTrip(trip);
      if (!inserted) throw new Error("Failed to insert trip");

      scoreObj.trip_id = inserted.id;
      const sc = await insertScore(scoreObj);
      if (!sc || !sc.score) throw new Error("Failed to insert score");

      if (sc.user_score != null) {
        setUser((prev) =>
          prev ? { ...prev, user_score: sc.user_score } : prev
        );
      }

      // Reset the navigation stack so Home is the only route (no back button)
      try {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "index" }],
          })
        );
      } catch (e) {
        // fallback to router.replace if navigation dispatch isn't available
        router.replace("/");
      }
    } catch (err) {
      console.warn("Save failed, storing locally for retry:", err.message);
      const pending = { trip, scoreObj, path };
      try {
        const ok = await storage.savePendingTrip(pending);
        if (!ok) throw new Error("storage.savePendingTrip returned false");
        try {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "index" }],
            })
          );
        } catch (e) {
          router.replace("/");
        }
      } catch (e) {
        console.warn("Failed to save pending trip:", e.message);
      }
    }
  };

  const onToggle = () => {
    if (!tracking) startTracking();
    else stopTracking();
  };

  const elapsedText = (() => {
    const s = Math.floor((elapsedMs || 0) / 1000);
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  })();

  const region =
    path && path.length
      ? {
          latitude: path[path.length - 1].latitude,
          longitude: path[path.length - 1].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : {
          latitude: 43.4723,
          longitude: -80.5449,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

  const MapViewComp = mapCompsRef.current?.MapView;
  const PolylineComp = mapCompsRef.current?.Polyline;
  const MarkerComp = mapCompsRef.current?.Marker;

  return (
    <TrackView
      MapViewComp={MapViewComp}
      PolylineComp={PolylineComp}
      MarkerComp={MarkerComp}
      path={path}
      region={region}
      startTime={startTime}
      elapsedText={elapsedText}
      avgSpeedKmh={avgSpeedKmh}
      tracking={tracking}
      onToggle={onToggle}
    />
  );
};

export default TrackController;
