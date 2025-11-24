import { StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack />
    </View>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
