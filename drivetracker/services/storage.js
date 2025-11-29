import AsyncStorage from "@react-native-async-storage/async-storage";

const PENDING_KEY = "pending_trips";

export async function getPendingTrips() {
  try {
    const raw = await AsyncStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("getPendingTrips error:", e.message);
    return [];
  }
}

export async function savePendingTrip(pending) {
  try {
    const arr = await getPendingTrips();
    arr.push(pending);
    await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(arr));
    return true;
  } catch (e) {
    console.warn("savePendingTrip error:", e.message);
    return false;
  }
}

export async function clearPendingTrips() {
  try {
    await AsyncStorage.removeItem(PENDING_KEY);
    return true;
  } catch (e) {
    console.warn("clearPendingTrips error:", e.message);
    return false;
  }
}

export default { getPendingTrips, savePendingTrip, clearPendingTrips };
