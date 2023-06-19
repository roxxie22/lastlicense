import React, { useState } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ navigation }) => {

    let [user, setUser] = useState('');
    let [password, setPassword] = useState('');
    const handleLogin = async () => {

        const auth = getAuth();
        console.log(user + " " + password)
        await signInWithEmailAndPassword(auth, user, password).then(user => {
            console.log("Conectare realizata cu succes");
            navigation.navigate("MapScreen");
        }

        ).catch(e => {
            console.error(e);
            console.error('Login failed');
        });


    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ paddingHorizontal: 25 }}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('./user.png')} style={styles.image} />
                </View>

                <View style={{ marginBottom: 50, alignItems: 'center' }}>
                    <Text
                        style={{
                            fontFamily: 'Verdana-Bold',
                            fontSize: 28,
                            fontWeight: '500',
                            color: '#4c4bfa',
                        }}>
                        LOGIN
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1,
                    paddingBottom: 8,
                    marginBottom: 30,
                }}>
                    <MaterialIcons
                        name='alternate-email'
                        size={20}
                        color="#666"
                        style={{ marginRight: 5 }} />
                    <TextInput
                        onChangeText={(value) => { setUser(value) }}
                        placeholder='Email ID'
                        style={{ flex: 1, paddingVertical: 0 }}
                        keyboardType="email-address" />
                </View>

                <View style={{
                    flexDirection: 'row',
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1,
                    paddingBottom: 8,
                    marginBottom: 10

                }}>
                    <Ionicons
                        name='ios-lock-closed-outline'
                        size={20}
                        color="#666"
                        style={{ marginRight: 5 }} />
                    <TextInput
                        onChangeText={(value) => { setPassword(value) }}
                        placeholder='password'
                        style={{ flex: 1, paddingVertical: 0 }}
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity onPress={() => { }}>
                    <Text style={{ color: '#4c4bfa', fontWeight: '700', marginLeft: 210, marginBottom: 40 }}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { handleLogin() }}
                    style={{
                        backgroundColor: 'orange',
                        padding: 20,
                        borderRadius: 10,
                        marginBottom: 30,
                    }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontWeight: '700',
                            fontSize: 16,
                            color: 'white'
                        }}>
                        Login
                    </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 150 }}>
                    <Text style={{ marginRight: 5 }}>Are you new?</Text>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text
                            style={{
                                color: '#4c4bfa',
                                fontWeight: '700',
                            }}>
                            Register
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    image:
    {
        marginBottom: 30,
        width: 160,
        height: 160,
    },
});


export default Login;
