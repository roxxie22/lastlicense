
import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import MapViewDirections from "react-native-maps-directions";

const MapScreen = ({ navigation }) => {

  let [latitude, setLatitude] = useState(45.760696);
  let [longitude, setLongitude] = useState(21.226788);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  let [markers, setMarkers] = useState([]);



  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location)
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }


  return (
    <MapView
      style={{ width: '100%', height: '100%' }}
      initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.07,
        longitudeDelta: 0.1
      }}

      onLongPress={(value) => setMarkers([...markers, { latitude: value.nativeEvent.coordinate.latitude, longitude: value.nativeEvent.coordinate.longitude }])}
    >

      {markers.map((marker, index) => {
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: marker['latitude'],
              longitude: marker['longitude']

            }}
            title="ceva"
            description={"cod rosu"}
            pinColor="red"
          />)

      })}



    </MapView>

    // <MapViewDirections />
  );
};


export default MapScreen;
