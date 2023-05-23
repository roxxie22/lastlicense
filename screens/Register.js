import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { auth } from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const Register = ({ navigation }) => {
    const [date, setDate] = useState();
    const [showDatePicker, setShowDatePicker] = useState(false);
    let [user, setUser] = useState('');
    let [password, setPassword] = useState('');

    const handleRegister = async () => {
        
            const auth = getAuth();
            console.log(user + " " + password)
            await createUserWithEmailAndPassword(auth, user, password).then(user =>{
                navigation.navigate("Home")
            }
                
            ).catch(e => {
                console.error(e)
            });
            console.log("Inregistrare creata cu succes");
        
    }

    const handleDateChange = (selectedDate) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
        setShowDatePicker(false);
    };

    const openDatePicker = () => {
        setShowDatePicker(true);
    };






    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ paddingHorizontal: 25 }}>
                <View style={{ alignItems: 'center' }}>
                    <Image source={require('./register123.png')} style={styles.image} />
                </View>

                <View style={{ marginBottom: 50, alignItems: 'center' }}>
                    <Text
                        style={{
                            fontFamily: 'Verdana-Bold',
                            fontSize: 28,
                            fontWeight: '500',
                            color: '#ff8c00',
                        }}>
                        REGISTER
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
                        name='person-outline'
                        size={20}
                        color="#666"
                        style={{ marginRight: 5 }} />
                    <TextInput
                        placeholder='Full name'
                        style={{ flex: 1, paddingVertical: 0 }}
                        keyboardType="email-address" />
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
                        style={{ flex: 1, paddingVertical: 0, textTransform: 'none' }}
                        keyboardType="email-address" />
                </View>

                <View style={{
                    flexDirection: 'row',
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1,
                    paddingBottom: 8,
                    marginBottom: 30

                }}>
                    <Ionicons
                        name='ios-lock-closed-outline'
                        size={20}
                        color="#666"
                        style={{ marginRight: 5 }} />
                    <TextInput
                        onChangeText={(value) => { setPassword(value) }}
                        placeholder='Password'
                        style={{ flex: 1, paddingVertical: 0 }}
                        secureTextEntry={true}
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1,
                    paddingBottom: 8,
                    marginBottom: 30

                }}>
                    <Ionicons
                        name='ios-lock-closed-outline'
                        size={20}
                        color="#666"
                        style={{ marginRight: 5 }} />
                    <TextInput
                        placeholder='Confirm Password'
                        style={{ flex: 1, paddingVertical: 0 }}
                        secureTextEntry={true}
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1,
                    paddingBottom: 8,
                    marginBottom: 30

                }}>
                    <Ionicons
                        name='calendar-outline'
                        size={20}
                        color="#666"
                        style={{ marginRight: 5 }}
                    />

                    <TouchableOpacity onPress={openDatePicker}>
                        <Text style={{
                            color: '#666',
                            marginLeft: 5,
                            marginTop: 5
                        }}>
                            {date ? (date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()) : 'Date of birth'}
                        </Text>

                        <DateTimePickerModal
                            isVisible={showDatePicker}
                            mode='date'
                            date={date}
                            maximumDate={new Date()}
                            onConfirm={handleDateChange}
                            onCancel={() => setShowDatePicker(false)}
                            display='inline'
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => { handleRegister() }}
                    style={{
                        backgroundColor: '#4c4bfa',
                        padding: 20,
                        borderRadius: 10,
                        marginBottom: 20,
                    }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontWeight: '700',
                            fontSize: 16,
                            color: 'white'
                        }}>
                        Register
                    </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 150 }}>
                    <Text style={{ marginRight: 5 }}>Already registered?</Text>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text
                            style={{
                                color: 'orange',
                                fontWeight: '700',

                            }}>
                            Login
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
        marginTop: 140,
        marginBottom: 30,
        width: 160,
        height: 170,
    },
});


export default Register;
