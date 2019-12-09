import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/FontAwesome5";
import { StackActions, NavigationEvents, NavigationActions } from 'react-navigation';
import keys from "./global";
import * as Permissions from 'expo-permissions';
import MapView from 'react-native-maps';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';

// import keys from "../../config/Keys";

export default class Inicio extends Component {


    constructor(props) {

        if (keys.socket == null) {

            keys.socket = SocketIOClient('http://192.168.0.13:3001');
            // keys.socket = SocketIOClient('http://35.203.42.33:3001/');

        }



        super(props);
        this.state = {
            myPosition:{
                latitude:null,
                longitude:null
            },
            Comida: false,
            Flete: false,
            Taxi: true
        };


    }

    static navigationOptions = {
        title: "Inicio"
    };




    async componentDidMount() {

        const myLocation = await Location.getCurrentPositionAsync({});
        latitude = myLocation.coords.latitude;
        longitude = myLocation.coords.longitude;


        this.setState({
            myPosition: {

                latitude: latitude,
                longitude: longitude

            },
       

        });

    }






    render() {

        return (
            <View>
                
                <View style={{ flexDirection: "row", position:"relative", paddingTop:10 }}>
                    <View style={{ flex: 1, alignContent: "center", marginLeft:10 }}>
                        <Icon name="bars" color="#ff8834" size={35}></Icon>

                    </View>

                    <View style={{ flex: 4 }}>
                        <View style={{flexDirection:"row"}}>
                    
                         
                            <View style={{ flex: 4 }}>
                                <View style={{flexDirection:"row"}}>

                                    <View style={{flex:2}}>
                                        <Text style={{color: this.state.Taxi ? "green" : "#ff8834", alignSelf:"center"}}
                                            onPress={() => this.setState({
                                                Comida: false,
                                                Flete: false,
                                                Taxi: true
                                            })}
                                        >Taxi</Text>
                                        
                                    </View>

                                    <View style={{flex:2}}>

                                        <Text style={{ color: this.state.Flete ? "green" : "#ff8834", alignSelf: "center" }}
                                            onPress={() => this.setState({
                                                Comida: false,
                                                Flete: true,
                                                Taxi: false
                                            })}
                                        >Flete</Text>

                                    </View>

                                    <View style={{flex:2}}>

                                        <Text style={{ color: this.state.Comida ? "green" : "#ff8834", alignSelf: "center" }}
                                            onPress={() => this.setState({
                                                Comida: true,
                                                Flete: false,
                                                Taxi: false
                                            })}
                                        >Comida</Text>

                                    </View>

                                </View>

                            </View>
                            <View style={{ flex: 1 }}>
                          
                            </View>

                        </View>
                    </View>
                    <View style={{ flex: 1, alignContent: "center" }}>
                        <Icon name="comment-dots" size={35} color="#ff8834"></Icon>
                    </View>

                </View>
                <View style={{flexDirection:"row", paddingTop:10, paddingLeft:10}}>
                    <View style={{ flex: 4 }}>

                        <TextInput
                            style={{ height: 40, width: "100%", borderColor: 'gray', borderWidth: 1, backgroundColor: '#DCDCDC' }}
                            placeholder=" ¿A dónde vamos?"
                            placeholderTextColor="gray"
                            onFocus={() => this.props.navigation.navigate("Travel")}
                        ></TextInput>
                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
                <View style={styles.containerMap}>

                  
                    
                    <MapView

                        style={styles.map}
                        region={{
                            latitude: this.state.myPosition.latitude,
                            longitude: this.state.myPosition.longitude,
                            latitudeDelta: 0.0105,
                            longitudeDelta: 0.0105
                        }}

                        showsUserLocation={true}
                        followsUserLocation={true}
                        showsMyLocationButton={false}


                    >
                    </MapView>
                  
                
                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        backgroundColor: "#f0f4f7",
        paddingBottom: 50
    },
    area: {
        flexDirection: "row",
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        backgroundColor: "#fff"
    },

    containerMap: {
        // ...StyleSheet.absoluteFillObject,
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },

});