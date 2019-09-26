import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TextInput, ScrollView, Slider } from "react-native";
import { Divider, CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
    createAppContainer,
    StackActions,
    NavigationActions
} from "react-navigation"; // Version can be specified in package.json
import { createStackNavigator } from "react-navigation-stack";
import { stringify } from "qs";
import MapView, { Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import axios from 'axios';
import MapViewDirections from 'react-native-maps-directions';





export default class InfoTravel extends Component {
    constructor(props) {
        super(props);
        this.state = {
         



        };



    }

    //  origin = { latitude: this.state.myPosition.latitude, longitude: this.state.myPosition.longitude };
    //  destination = { latitude: this.state.Destino.latitude, longitude: this.state.Destino.longitude };
    //  GOOGLE_MAPS_APIKEY = '…';





    async componentDidMount() {
       
    }







    static navigationOptions = {
        title: "Información"
    };






    render() {
        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View styles={styles.area}>
                    <View>
                        <Text style={{ fontWeight: "bold", fontSize: 14 }}>A 15 min.</Text>
                        <Text style={{ fontWeight: "bold", fontSize: 14 }}>Llegada: 9:28 p.m.</Text>
                    </View>
                </View>
                <View
                    style={
                        {
                            backgroundColor: "black",
                        }}
                >
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 14, alignSelf: "center" }}>Verifica la matricula y los detalles del auto</Text>
                </View>

                <View style={styles.area}>
                    <Icon name="user-circle" size={60}></Icon>
                    <Icon name="car" size={45} style={{ paddingLeft: 10 }}></Icon>
                    <View style={{ paddingLeft: 120 }}>
                        <Text>Dodge Attitude</Text>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>FRS408A</Text>
                   

                    </View>
                </View>

                <View style={{ alignSelf: "center", backgroundColor: "white" }}>
                    <Text >Oscar Dario<Text>*4.8</Text> <Icon name="star"></Icon> <Text>* Habla inglés y español</Text></Text>
                </View>

                <View style={styles.area}>
                    <Icon name="phone" size={30}></Icon>
                    <View style={{ paddingLeft: 10 }}></View>
                    <TextInput
                        style={{ height: 40, width: 270, borderColor: 'gray', borderWidth: 1, backgroundColor: '#DCDCDC' }}
                        placeholder=" Nota para iniciar el viaje"
                        placeholderTextColor="black"
                    ></TextInput>
                </View>
                <View >
                    <Button color="red" title="Cancelar"
                        onPress={() => this.setModalCancel(!this.state.modalVisible)}
                    ></Button>
                </View>

                <View style={{
                    flexDirection: "row",
                    paddingBottom: 10,
                    paddingLeft: 20,
                    backgroundColor: "#fff",
                    paddingTop: 10
                }}>
                    <Icon name="map-marker-alt" size={25}></Icon>
                    <Text style={{paddingLeft:30, marginTop:2}}>Lomas del Centenario</Text>
                    <Text style={{ paddingLeft: 30, marginTop: 2, color:"blue" }}>Agregar o cambiar</Text>
                </View>
                <View style={styles.line}></View>

                <View style={{
                    flexDirection: "row",
                    paddingBottom: 10,
                    paddingLeft: 20,
                    backgroundColor: "#fff",
                    paddingTop:10
        
                }}>
                    <Icon name="money-bill-alt" size={25}></Icon>
                    <Text style={{ paddingLeft: 30, marginTop: 2 }}>Efectivo</Text>
                    <Text style={{ paddingLeft: 170, marginTop: 2, color:"blue" }}>Cambiar</Text>
                </View>

                <View style={styles.line}></View>
                
                <View style={{
                    flexDirection: "row",
                    paddingBottom: 10,
                    paddingLeft: 20,
                    backgroundColor: "#fff",
                    paddingTop: 10
              
                }}>
                    <Icon name="share" size={25}></Icon>
                    <Text style={{ paddingLeft: 30, marginTop: 2 }}>Compartir estado del viaje</Text>
                    <Text style={{ paddingLeft: 50, marginTop: 2, color:"blue" }}>Compartir</Text>
                </View>
                <View style={styles.line}></View>

                <View style={styles.area}>
                    <View style={{ width: 300 }}>
                        <Text style={{marginTop:5}}>Guardar el destino</Text>
                        <Text style={{ marginTop: 5 }}>Lomas del Centenario, Villa de Álvarez, Colima, México</Text>
                        <Text style={{ marginTop: 5, color:"blue" }}>Agregar a mis ubicaciones guardadas</Text>
                    </View>
                </View>
                <View style={styles.line}></View>

                <View style={styles.area}>
                    <View style={{width:280}}>
                        <Text>Conduce la app de Migo</Text>
                        <Text>Únete a miles de usuarios que también conducen con Migo</Text>
                    </View>
                    <View style={{paddingTop:10}}>
                        <Icon name="car" size={50}></Icon>
                    </View>
                </View>

                <View style={styles.line}></View>

                <View style={styles.area}>
                    <View style={{ width: 280, marginTop:5 }}>
                        <Text style={{color:"blue"}}>Pruebalo y conduce</Text>
                    </View>
                </View>




            </ScrollView>



        );
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f0f4f7",
        paddingBottom: 10
    },
    row: {
        height: 10,
        backgroundColor: "#f0f4f7"
    },
    line: {
        height: 2,
        backgroundColor: "#f0f4f7"
    },
    area: {
        flexDirection: "row",
        paddingBottom: 20,
        paddingLeft: 20,
        backgroundColor: "#fff"
    },

    contentContainer: {
        paddingVertical: 20
    },




});
