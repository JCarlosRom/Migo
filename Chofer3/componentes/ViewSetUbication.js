import React, { Component } from "react";
import { Text, View, StyleSheet, FlatList, TouchableHighlight } from "react-native";
import { Input } from "react-native-elements";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/FontAwesome5";
import keys from "./global";
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { StackActions, NavigationEvents, NavigationActions } from 'react-navigation';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import * as Permissions from 'expo-permissions';


export default class ViewSetUbication extends Component {


    constructor(props) {

        if (keys.socket == null) {

            keys.socket = SocketIOClient(keys.urlSocket);


        }



        super(props);
        this.state = {
            myPosition: {
                latitude: 0,
                longitude: 0
            },
            Comida: false,
            Flete: false,
            Taxi: true,
            showModalPay: false,
            tarifaFinal: 0,
            Propina: 1,
            destination:null,
            predictions: [],
            showListdestination: false,
            positionUser: {
                latitude: 0,
                longitude: 0,

            },
        };


    }

    static navigationOptions = {
        title: "Inicio"
    };




    async componentWillMount() {

        // console.log("keys.travelInfo",keys.travelInfo);


        // Posición de chófer 
        const myLocation = await Location.getCurrentPositionAsync({});
        latitude = myLocation.coords.latitude;
        longitude = myLocation.coords.longitude;


        this.setState({
            myPosition: {

                latitude: latitude,
                longitude: longitude

            },

        });

        console.log("My position",this.state.myPosition);
        // Posición del usuario 

        let usuarioPosition = await Location.geocodeAsync(keys.travelInfo.puntoPartida.addressInput);

        this.setState({
            positionUser: {
                latitude: usuarioPosition[0]["latitude"],
                longitude: usuarioPosition[0]["longitude"]
            }
        })

        console.log("positionUser",this.state.positionUser);


    }

    autocompleteGoogle= async destination => {
        this.setState({
           destination:destination
        });

        this.setState({
            showListdestination: true
        })

        const apiUrl =
            "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" +
            'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY' +
            "&input=" +
            this.state.destination +
            "&location=" +
            this.state.latitude +
            ",%20" +
            this.state.longitude +
            "&radius=2000";
        try {
            const result = await fetch(apiUrl);
            const json = await result.json();
            this.setState({
                predictions: json.predictions
            });



        } catch (error) {
            console.error(error);
        }
    };

    Item = ({ item }) => {


        return (
            <View>
                <NavigationEvents onDidFocus={() => console.log('I am triggered')} />
                <TouchableHighlight

                    onPress={() => this.setDirectionInput(item.description)}
                >
                    <View style={[styles.area, { paddingTop: 10, paddingBottom: 10 }]}>
                        <Icon color="#ff8834" name="map-marker-alt" style={styles.iconLeft} size={30} />
                        <View style={{ justifyContent: "center", width: 250 }}>
                            <Text
                                style={styles.text}
                            >
                                {item.description}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>

            </View>
        );
    };

    setDirectionInput = (description) => {
    
        console.log("Description",description);
        
        this.setState({
            destination: description
        });
        
        this.setState({
            showListdestination:false
        })

        console.log("Destination", this.state.destination);
    };



    goTravel = async () => {

        console.log("Destination 2", this.state.destination);


        let Parada1 = await Location.geocodeAsync(this.state.destination);


        Paradas = []

        Parada1Info = {
            latitude: Parada1[0]["latitude"], longitude: Parada1[0]["longitude"], Direccion: this.state.destination
        }

        Paradas.push(Parada1Info)

        this.setState({

            Paradas

        })

        keys.socket.emit('sendPrimeraParada1Chofer', {
            id_usuario_socket: keys.id_usuario_socket,
            primeraParada: Parada1Info
        });



        keys.Paradas = this.state.Paradas;

        keys.travelInfo.Parada1 = keys.Paradas[0];


        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Travel_Integrado' })],
            key: undefined
        });

        this.props.navigation.dispatch(resetAction);
    }

    render() {

        return (
            <View>

            
                <View>

                    <View style={{ flexDirection: "row", paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}>
                        <View style={{ flex: 6 }}>

                            <Input
                                value={this.state.destination}
                                placeholder="Ingrese el destino"
                                onChangeText={destination => this.autocompleteGoogle(destination)}
                                rightIcon={
                                    <Icon
                                        name="arrow-right"
                                        onPress={this.goTravel}
                                        size={24}
                                        color="#ff8834"
                                    />
                                }
                            />
                        </View>
                        <View style={{ flex: 1 }}></View>
                    </View>

                    {this.state.showListdestination ? (
                        <View>

                            <FlatList
                                style={{
                                    height: 340
                                }}



                                data={this.state.predictions}
                                renderItem={this.Item}
                                keyExtractor={item => item.id}

                            />

                        </View>
                    ) : null}

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
                       


                        {/* {Ubicación del chofer} */}
                        {this.state.myPosition!=null?
                      
                            <Marker
                                coordinate={{
                                    latitude: this.state.myPosition.latitude,
                                    longitude: this.state.myPosition.longitude,
                                }}

                            >
                                <Icon color="#ff8834" name="car" size={20} ></Icon>
                            </Marker>
                        
                        :
                            null
                        }

                        {/* Ubicación del usuario */}
                        {this.state.positionUser!=null?
                        
                            <Marker
                                coordinate={{
                                    latitude: this.state.positionUser.latitude,
                                    longitude: this.state.positionUser.longitude,
                                }}

                            >
                                <Icon name="map-pin" size={20} color="green"></Icon>
                            </Marker>
                        
                        :
                            null
                        }

                        {this.state.myPosition!=null && this.state.positionUser!=null ?

                            <MapViewDirections


                                origin={{
                                    latitude: this.state.myPosition.latitude,
                                    longitude: this.state.myPosition.longitude,
                                }}
                                destination={{
                                    latitude: this.state.positionUser.latitude,
                                    longitude: this.state.positionUser.longitude,
                                }}
                                apikey={keys.GOOGLE_MAPS_APIKEY}
                                strokeWidth={1}
                                strokeColor="orange"
                               

                            />

                        :
                                null
                        }

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