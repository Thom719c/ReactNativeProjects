import React, { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import FirebaseStorageImages from '../../components/FirebaseStorageImages';
import { isEmpty } from '@firebase/util';

const MapsScreen = ({ navigation, route, amount }) => {  // route.params.xxx
  const [regionState, setRegionState] = useState({
    latitude: 55.676098,
    longitude: 12.568337,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });
  const [markerState, setMarkerState] = useState([]);
  const onRegionChange = (region) => {
    setRegionState({ region })
  };

  const noteView = "AddNote"
  const onSelectMarker = (data) => {
    console.log("marker pressd", data.nativeEvent.coordinate);
    navigation.navigate({
      name: noteView,
      params: data.nativeEvent.coordinate,
      merge: true,
    });
    // route.params.updateState(data.nativeEvent.coordinate);
  }

  const revserseGeocode = async (latitude, longitude) => {
    let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=geocodejson&lat=${latitude}&lon=${longitude}`);
    let result = await response.json();

    const newTitle = (result.features[0].properties.geocoding.name ? result.features[0].properties.geocoding.name : result.features[0].properties.geocoding.city);
    const labelSplit = result.features[0].properties.geocoding.label.split(",");
    const newDescription = `${labelSplit[1]} ${labelSplit[0]}`;

    return { title: newTitle, description: newDescription };
  }

  const onCreatePin = async (event) => {
    // persist the synthetic event
    /** Explaing/documentation of event.persist();
     * In React, synthetic events are pooled and reused to optimize performance.
     * When an event is dispatched, React reuses the same object and resets its properties to contain the new event's data.
     * This means that any properties of the event object are only available until the next tick of the event loop, after which they are reset to their default values.
     * If you need to access an event property asynchronously (i.e., after the next tick of the event loop), you can call event.persist().
     * event.persist() removes the event from the pool, preventing React from reusing it, and allows you to keep a reference to the event object beyond the current tick of the event loop.
     * However, using event.persist() can have performance implications, as it prevents React from reusing the event object.
     * Therefore, you should only use event.persist() when absolutely necessary, and try to access event properties synchronously if possible.
     */
    event.persist();

    const { latitude, longitude } = event.nativeEvent.coordinate;

    // Get title and description (the street name, number...) for the current location
    const result = await revserseGeocode(latitude, longitude);

    const timeStamp = event.timeStamp;

    markerState.push(
      <Marker coordinate={{ latitude, longitude }}
        key={timeStamp}
        pinColor={"red"}
        title={result.title}
        description={result.description}
      // onPress={onSelectMarker}
      >
        <Callout onPress={() => onSelectMarker(event)}>
          <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{result.title}</Text>
            <Text style={{ fontSize: 14 }}>{result.description}</Text>
          </View>
        </Callout>
        {route.params?.note?.images && <FirebaseStorageImages item={route.params?.note || route.params?.notes} amount={amount} />}
      </Marker>
    );

    setMarkerState(markerState);
    // hack, to force map to update
    setRegionState({
      ...regionState,
      latitude: regionState.latitude
    });
  }

  const addMarkers = async (coordinates) => {
    const newMarkers = await Promise.all(coordinates.map(async (coord, index) => {
      let result = { title: "", description: "" };
      if (coord.marker?.latitude !== undefined) {
        result = await revserseGeocode(coord.marker.latitude, coord.marker.longitude);
      }
      return (
        <View>
          {coord.images.length !== 0 ?
            <Marker
              key={index}
              title={result.title}
              description={result.description + ".\nNote: " + coord?.title}
              coordinate={coord.marker}
            >
              <FirebaseStorageImages item={coord} amount={1} />
            </Marker>
            :
            <Marker
              key={index}
              title={result.title}
              description={result.description + ".\nNote: " + coord?.title}
              coordinate={coord.marker}
            />
          }
        </View>
      )
    }));
    setMarkerState(newMarkers);
  };

  // call addMarkers with the marker coordinates
  useEffect(() => {
    if (route.params?.notes) {
      addMarkers(route.params?.notes);
    }
  }, [route.params?.notes]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={regionState}
        onRegionChange={onRegionChange}
        onLongPress={onCreatePin}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
      // region={true}
      >
        {markerState}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});


export default MapsScreen;