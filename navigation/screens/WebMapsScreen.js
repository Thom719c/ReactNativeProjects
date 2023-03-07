import React from 'react';
import { View, Text } from 'react-native-web';
import { StatusBar } from 'expo-status-bar';
import MapView from 'react-native-maps';
// import MapView from '@react-native-mapbox-gl/maps';


const WebMapsScreen = () => {
  return (
    <View>
      <Text>App</Text>
      <MapView
        style={{ flex: 1 }}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomLevel={12}
        centerCoordinate={[longitude, latitude]}
      />

      <StatusBar style="auto" />
    </View>
  );
}

export default WebMapsScreen