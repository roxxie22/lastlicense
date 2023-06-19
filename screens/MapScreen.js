import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Modal, Image, TextInput } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from 'expo-location';
import MapViewDirections from "react-native-maps-directions";
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';



const MapScreen = ({ navigation }) => {

  let [latitude, setLatitude] = useState(45.760696);
  let [longitude, setLongitude] = useState(21.226788);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [currentLocation, setCurrentLocation] = useState(null);


  const [showNotification, setShowNotification] = useState(false);
  const [longPressMode, setLongPressMode] = useState(false);


  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');



  const handlePostMarker = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };






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

  const handleDeleteMarker = (index) => {
    Alert.alert(
      'Delete Marker',
      'Are you sure you want to delete this marker?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteMarker(index) }
      ]
    );
  };

  const deleteMarker = (index) => {
    const updatedMarkers = [...markers];
    updatedMarkers.splice(index, 1);
    setMarkers(updatedMarkers);
  };

  const handleAddMarker = () => {
    setShowModal(true);
  };


  const handleLongPress = async (value) => {
    if (longPressMode) {
      const { latitude, longitude } = value.nativeEvent.coordinate;

      // Perform reverse geocoding
      let geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      let street = "";
      let streetNumber = "";
      if (geocode.length > 0) {
        street = ` ${geocode[0].city}, ${geocode[0].region}, ${geocode[0].country}`;
        streetNumber = geocode[0].name; // This is often the street number
      }

      setMarkers([
        ...markers,
        {
          latitude,
          longitude,
          street: street,
          streetNumber: streetNumber,
        },
      ]);
      setLongPressMode(false);
    }
  };


  const handleChoice = async (choice) => {
    setShowModal(false);

    switch (choice) {
      case 'Option 1':
        setLongPressMode(true);
        break;

      case 'Option 2':
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }

          let location = await Location.getCurrentPositionAsync({});
          setCurrentLocation(location);

          let geocode = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          let street = "";
          let streetNumber = "";
          if (geocode.length > 0) {
            street = `${geocode[0].city}, ${geocode[0].region}, ${geocode[0].country}`;
            streetNumber = geocode[0].name; // This is often the street number
          }

          setMarkers([...markers, {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            street: street,
            streetNumber: streetNumber,
          }]);
        } catch (error) {
          console.log('Error getting current location:', error);
        }
        break;

      case 'Option 3':
        setShowSearchBar(true);
        break;
        
      default:
        break;

    }
  };

  const handleSearch = async () => {
    // Use the searchQuery state variable to perform the search.
    // Depending on how you implement the search, you might set the markers here.
    const result = await Location.geocodeAsync(searchQuery);
    if (result.length > 0) {
      setMarkers([
        ...markers,
        {
          latitude: result[0].latitude,
          longitude: result[0].longitude,
          street: searchQuery,
        },
      ]);
    }
    setShowSearchBar(false);
  };




  const handleAddPhoto = (index) => {
    Alert.alert(
      'Adaugă imagine:',
      '',
      [
        { text: 'Fă o poză', onPress: () => handleCamera(index) },
        { text: 'Alege din galerie', onPress: () => handleGallery(index) },
        { text: 'Anulează', style: 'cancel' },
      ]
    );
  };

  const handleGallery = async (index) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        throw new Error('Gallery permission not granted');
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();
      if (!pickerResult.cancelled) {
        // Handle the selected image URI
        const imageUri = pickerResult.uri;
        // Perform actions with the image URI, such as saving or displaying it
        // You can also update the marker object in the state with the image URI
        const updatedMarkers = [...markers];
        updatedMarkers[index].imageUri = imageUri;
        setMarkers(updatedMarkers);
      }
    } catch (error) {
      console.log('Error selecting image from gallery:', error);
    }
  };

  const handleCamera = async (index) => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        throw new Error('Camera permission not granted');
      }

      const pickerResult = await ImagePicker.launchCameraAsync();
      if (!pickerResult.cancelled) {
        // Handle the taken photo URI
        const photoUri = pickerResult.uri;
        // Perform actions with the photo URI, such as saving or displaying it
        // You can also update the marker object in the state with the photo URI
        const updatedMarkers = [...markers];
        updatedMarkers[index].imageUri = photoUri;
        setMarkers(updatedMarkers);
      }
    } catch (error) {
      console.log('Error taking photo with camera:', error);
    }
  };


  return (
    <>

      {showSearchBar && (
        <View style={styles.searchBar}>
          <GooglePlacesAutocomplete
            placeholder='Caută strada ...'
            styles={{
              textInput: styles.searchInput,
              listView: {/*styles that you want to apply to the suggestion list*/ },
              // you can customize other styles too
            }}
            fetchDetails={true}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
              if (details && details.geometry) {
                setMarkers([
                  ...markers,
                  {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    street: details.formatted_address,
                  },
                ]);
              }
              setShowSearchBar(false);
            }}
            query={{
              key: 'AIzaSyC_YjKVpPNDOB4UPjTQkysaCizl-0Xr31A',
              language: 'en',
            }}
          />
        </View>
      )}


      {showNotification && (
        <View style={styles.notification}>
          <Text style={{ color: 'green', textAlign: 'center' }}>Sesizarea dumneavoastră a fost salvată cu succes!</Text>
        </View>
      )}

      <MapView
        style={{ width: '100%', height: '100%' }}
        initialRegion={{
          latitude: currentLocation ? currentLocation.coords.latitude : latitude,
          longitude: currentLocation ? currentLocation.coords.longitude : longitude,
          latitudeDelta: 0.07,
          longitudeDelta: 0.1,
        }}

        onLongPress={handleLongPress}
      >

        {markers.map((marker, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: marker['latitude'],
                longitude: marker['longitude']
              }}
            >
              <Callout>
                <View style={{ width: 200 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 25 }}>Sesizarea ta</Text>
                  <Text style={{ fontSize: 15 }}>{marker.street} {marker.streetNumber}</Text>

                  {marker.imageUri && (
                    <Image source={{ uri: marker.imageUri }} style={styles.calloutImage} />
                  )}

                  <TextInput
                    style={{ marginTop: 30, marginBottom: 20, marginLeft: 5 }}
                    placeholder="Adaugă descriere ..."
                    value={marker.description}
                    onChangeText={(text) => {
                      const updatedMarkers = [...markers];
                      updatedMarkers[index].description = text;
                      setMarkers(updatedMarkers);
                    }}
                    multiline={true}
                  />


                  <TouchableOpacity
                    style={{ marginTop: 10, marginLeft: 5, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => handleAddPhoto(index)}
                  >
                    <MaterialIcons name="cloud-upload" size={20} color="#333333" style={{ marginRight: 5 }} />
                    <Text style={{ color: '#333333', marginLeft: 5, textAlign: 'center' }}>Încarcă o imagine</Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, marginTop: 25, width: 200 }}
                    onPress={() => handlePostMarker()}
                  >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Salvează sesizarea </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ backgroundColor: 'red', padding: 10, borderRadius: 5, marginTop: 25, width: 200 }}
                    onPress={() => handleDeleteMarker(index)}
                  >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Șterge sesizarea </Text>
                  </TouchableOpacity>




                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.7}
        onPress={() => handleAddMarker()}
      >
        <MaterialIcons name="add" size={40} color="white" />

      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <View style={styles.modalContent}>

            <Text style={{
              marginBottom: 20,
              color: '#4f4f4f',
              fontWeight: 'bold',
              fontSize: 25,
              textAlign: 'center',
            }}>
              Adaugă sesizare:
            </Text>

            <TouchableOpacity style={styles.modalButton} onPress={() => handleChoice('Option 1')}>
              <Text style={styles.modalButtonText}>Țineți apăsat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => handleChoice('Option 2')}>
              <Text style={styles.modalButtonText}>După locația curentă</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => handleChoice('Option 3')}>
              <Text style={styles.modalButtonText}>Căutați strada</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowModal(false)}
            >
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Anulează</Text>
            </TouchableOpacity>

          </View>

        </TouchableOpacity>

      </Modal>


    </>

    //<MapViewDirections />


  );
};

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 50,
    right: 50,
    backgroundColor: 'rgba(255, 165, 0, 0.9)',
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 200,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#383838',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    width: 100,
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
  },
  calloutImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },

  notification: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 5,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    zIndex: 999,
  },
  searchInput: {
    flex: 1,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
});


export default MapScreen;