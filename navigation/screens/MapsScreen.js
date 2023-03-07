import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Callout } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapsScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Get the street name and number for the current location
      let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=geocodejson&lat=${location.coords.latitude}&lon=${location.coords.longitude}`)
        .then(response => response.json())
        .then(result => {
          console.log(result.features[0].properties.geocoding.label)
          setAddress({
            city: result.features[0].properties.geocoding.city,
            postcode: result.features[0].properties.geocoding.postcode,
            street: result.features[0].properties.geocoding.street,
            housenumber: result.features[0].properties.geocoding.housenumber,
            name: result.features[0].properties.geocoding.name,
            label: result.features[0].properties.geocoding.label,
          })
        }).catch(function (error) {
          console.log('There has been a problem with fetch operation: ' + error.message);
          throw error;
        });
      // .then(result => console.log(result.features[0].properties.geocoding))
    })();
  }, []);

  let text = 'Loading map...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location && address) {
    text = `${address?.street ? address?.street : address?.name} ${address?.housenumber},\n${address?.city ? address?.city : address?.label.split(",")[3]}, ${address?.postcode}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      {location && (
        <MapView style={styles.map} initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
          <Marker coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }} >
            <View style={styles.pin}>
              <Text style={styles.pinText}>{text}</Text>
            </View>
          </Marker>
        </MapView>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  pin: {
    backgroundColor: '#F54F51',
    borderRadius: 20,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default MapsScreen