import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text>Home</Text>
      </View>
      <View style={styles.container}>
        <Text>Welcome to DriveTracker!</Text>
      </View>
      <Link href="/track">
        <Text>Go to Track</Text>
      </Link>
      <Link href="/history">
        <Text>Go to History</Text>
      </Link>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
