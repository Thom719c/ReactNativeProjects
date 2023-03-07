import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';


const WebMapsScreen = () => {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>App</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default WebMapsScreen