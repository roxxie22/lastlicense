
import React from "react";
import { View, Button, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import MapView from "react-native-maps";

const Home = ({ navigation }) => {
  return (
      <MapView
        style={{width: '100%', height: '100%'}}
        initialRegion={{
          latitude: 45.760696,
          longitude: 21.226788,
          latitudeDelta: 0.07,
          longitudeDelta: 0.1,

        }}>     
      

              
              <TouchableOpacity 
                  style={{
                    marginTop:640, 
                    marginLeft:100,
                    backgroundColor: 'orange',  
                    padding: 15, 
                    borderRadius: 8, 
                    width: 200,
                    borderWidth: 2,
                    borderColor: '#ccc'
                    }} 
                    activeOpacity={1}
                  onPress={() => navigation.navigate('Login')}>
                <Text style={{color: 'white', fontSize: 30, textAlign: 'center'}}>LOGIN</Text>
              </TouchableOpacity>

      </MapView>
  );
};
  
  
  export default Home;
  