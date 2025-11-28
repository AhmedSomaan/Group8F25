import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Track = () => {
  return (
    <View style={styles.container}>
      <Text>Track</Text>
    </View>
  )
}

export default Track

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});