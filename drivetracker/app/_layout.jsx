import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          // hide the header title but keep the back button visible
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
    </View>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
