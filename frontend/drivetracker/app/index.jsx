import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";

const Home = () => {
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [username, onChangeUsername] = React.useState("");
  const [phonenumber, onChangePhoneNumber] = React.useState("");
  
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Register</Text>
      </View>
      <View style={styles.container}>
        <Text>Welcome to DriveTracker!</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          placeholder="Email"
          value={email}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          placeholder="Password"
          value={password}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeUsername}
          placeholder="Username"
          value={username}
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangePhoneNumber}
          value={phonenumber}
          placeholder="Phone Number"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 3,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#dfdfdfff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
