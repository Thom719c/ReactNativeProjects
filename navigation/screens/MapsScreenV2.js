import React, { useState, Text } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { StyleSheet, View } from 'react-native'


const MapsScreen = ({ navigation, route }) => {  // route.params.xxx
  const [regionState, setRegionState] = useState({
    latitude: 55.12,
    longitude: 12.0,
    latitudeDelta: 2,
    longitudeDelta: 2,
  })
  const [markerState, setMarkerState] = useState([])
  const onRegionChange = (region) => {
    setRegionState({ region })
  }

  // const detailView = "AddNote"
  const onSelectMarker = (data) => {
    console.log("marker pressd", data.nativeEvent.coordinate)
    /* navigation.navigate({
      name: detailView,
      params: data.nativeEvent.coordinate,
      merge: true,
    }) */
    /* navigation.navigate({
      name: detailView,
      params: data.nativeEvent.coordinate,
      merge: true,
    }) */
  }

  const onCreatePin = async (data) => {
    const { latitude, longitude } = data.nativeEvent.coordinate
    // Get the street name and number for the current location
    let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=geocodejson&lat=${latitude}&lon=${longitude}`)
    let result = await response.json();

    /*  const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBea8_Hh-7Oo3Oa4WDg-6fYqW1VhgnWzOo`
        );
        const fetchData = await response.json();
        const address = fetchData.results[0].formatted_address;
        console.log(address) */
    // console.log(latitude, longitude)
    // let result = await response.json();

    markerState.push(
      <Marker coordinate={{ latitude, longitude }}
        key={data.timeStamp}
        pinColor={"red"}
        title={result.features[0].properties.geocoding.name ? result.features[0].properties.geocoding.name : result.features[0].properties.geocoding.city}
        description={result.features[0].properties.geocoding.label}
        // title={"title"}
        // description={"description"}
        onPress={onSelectMarker}
      >

      </Marker>)
    setMarkerState(markerState)
    // hack, to force map to update
    setRegionState({
      ...regionState,
      latitude: regionState.latitude
    })
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={regionState}
        onRegionChange={onRegionChange}
        onLongPress={onCreatePin}
        //provider="google"
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        region={true}
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