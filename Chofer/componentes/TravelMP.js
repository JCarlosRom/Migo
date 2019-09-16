import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Switch, ScrollView, Slider } from "react-native";
import { Divider, CheckBox, Button  } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
    createAppContainer,
    StackActions,
    NavigationActions
} from "react-navigation"; // Version can be specified in package.json
import { createStackNavigator } from "react-navigation-stack";
import { stringify } from "qs";
import MapView from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps


export default class TravelMP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            puntoEncuentro:false,
            HomeTravel:true,
            aceptViaje:false,
            initravel:false,
            finishTravel: false

       

        };

        
        
    }

    static navigationOptions = {
        title: "Viaje"
    };

    puntoEncuentro(){
        this.setState({
            HomeTravel: false,
            aceptViaje: false,
            initravel:true,
      

        })
    }
    terminarViaje(){
        this.setState({
            HomeTravel: false,
            aceptViaje: false,
            initravel: false,
            finishTravel:true


        })
    }

  

    render() {
        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.container}>
                    <View style={styles.area}>
                        <View>
                            <Switch
                            />
                        </View>
                        <View>
                            <Text >Conectado</Text>
                        </View>
                        <View style={
                            {
                                paddingLeft: 120
                            }
                        }>
                            <Icon name="exclamation-circle"
                                size={30}></Icon>
                        </View>
                        <View style={
                            {
                                paddingLeft: 10
                            }
                        }>
                            <Icon name="question-circle"
                                size={30}></Icon>
                        </View>
                        <View style={
                            {
                                paddingLeft: 10
                            }
                        }>
                            <Icon name="cog"
                                size={30}></Icon>
                        </View>
                    </View>
                    {/* Barra superior de punto de encuentro  */}
                    {this.state.HomeTravel?
                     
                        <View >

                            <View style={{
                                flexDirection: "row",
                                paddingLeft: 10,
                                backgroundColor: "#fff",
                                paddingTop: 10,
                                marginTop: 2
                            }}>
                                <View>
                                    <Icon name="user" size={20}></Icon>
                                </View>
                                <View style={
                                    {
                                        marginLeft: 10
                                    }
                                }>
                                    <Text>Leonel Guardado</Text>
                                </View>
                                <View >
                                    <Text style={{ fontWeight: "bold", marginLeft: 100 }}>8<Text style={{ fontWeight: "normal" }}>min</Text></Text>

                                    <Text style={{ marginLeft: 70 }}>1.5 km de ti</Text>
                                </View>


                            </View>
                            <View style={styles.area}>

                                <Icon name="chevron-right" color="green" size={15}></Icon>

                                <Text style={{ marginLeft: 10 }}>Plaza Zentralia, Paseo de la Madrid Hurtado, 301, Residencial Valle Dorado, 28018 Colima, Col.</Text>
                            </View>
                        </View>
                    :
                       null
                    }
                    {/* Barra superior para aceptar el viaje  */}

                    {this.state.aceptViaje?


                        <View >

                            <View style={styles.area}>

                                <Icon name="chevron-right" color="green" size={15}></Icon>

                                <View  style={{width:280}}>
                                    <Text style={{ marginLeft: 10 }}>Plaza Zentralia, Paseo de la Madrid Hurtado, 301, Residencial Valle Dorado, 28018 Colima, Col.</Text>
                                    <Text style={{marginLeft:10}}>8min (1.5km)</Text>
                                </View>
                                <View>
                                    <Icon name="chevron-up" size={30}></Icon>
                                    <Text style={{paddingLeft:4}}>Go</Text>
                                </View>
                            </View>
                        </View>
                    :
                        null
                    }
    
                  
    
                        </View>
                    <View style={styles.containerMap}>
                        <MapView

                            style={styles.map}
                            region={{
                                latitude: 19.2398017,
                                longitude: - 103.7546414,
                                latitudeDelta: 1,
                                longitudeDelta: 1,
                            }}
                        >
                    </MapView>
                    </View>
                    {/* Barra inferior de punto de encuentro */}
                    {this.state.aceptViaje?
                        <View>

                            <View style={styles.area}>

                            <Text style={{marginLeft:5}}> Contacta al usuario si llegas después de las 21:11</Text>


                            </View>
                            <View style={styles.area}>
                              
                                <Icon style={
                                    {
                                        paddingLeft: 10
                                    }
                                } name="user" size={20}></Icon>
                              
                          
                                    <Text style={
                                        {
                                            paddingLeft: 10,
                                            paddingTop:5
                                        }
                                    }>Leonel Guardado</Text>

                                <Icon name="times"
                                style={{ paddingLeft:10}}
                                color="red"
                                size={25}
                                ></Icon>  
                                
                                <Icon name="angle-double-right"
                                style={{paddingLeft:10}}
                                color="red"
                                size={25}></Icon>
                               
                                <Icon name="comment-dots"
                                    style={{ paddingLeft: 40 }}
                                    size={25}></Icon>
                             

                                <Icon name="phone"
                                    style={{ paddingLeft: 15 }}
                                    size={25}></Icon>

                            </View>
                            <View style={styles.area}>
                                
                                <View style={{paddingLeft:120}}>
                                    <Text style={{ paddingLeft: 20 }}>1234567890</Text>
                                    <Text>soporte@migo.com</Text>
                                </View>

                            </View>
                            <View>

                            </View>
                            <View style={styles.area}>

                                <Icon name="angle-double-right" size={20} style={{ paddingLeft: 10 }}></Icon>
                                <View style={
                                    {
                                        paddingLeft: 50
                                    }
                                }>
                                    <Button

                                        title="En el punto de encuentro"
                                        type="clear"
                                        onPress={() => {
                                            this.puntoEncuentro()
                                        }}
                                    />
                           
                                </View>


                            </View>

                        </View>
                    :
                        null
                    
                    }
                    {/* Barra inferior para aceptar el viaje  */}
                    {this.state.HomeTravel?
                    <View style={styles.area}>

                        <Icon name="angle-double-right" size={30} style={{ paddingLeft: 10 }}></Icon>
                        <View style={
                            {
                                paddingLeft: 85
                            }
                        }>
                            <Button

                                title="Aceptar viaje"
                                type="clear"
                                onPress={() => {
                                    this.setState({
                                        HomeTravel: false,
                                        aceptViaje: true,

                                    });
                                }}
                            />
                            <Text style={
                                {
                                    paddingLeft: 45
                                }
                            }>15 s</Text>
                        </View>


                    </View>
                    :
                        null
                    }
                {/* Barra inferior de inicio de viaje */}
                {this.state.initravel ?
                    <View>

                        <View style={styles.area}>

                            <Text style={{ marginLeft: 20 }}> Por favor espera al usuario: 2:00 minutos</Text>


                        </View>
                        <View style={styles.area}>

                            <Icon style={
                                {
                                    paddingLeft: 10
                                }
                            } name="user" size={20}></Icon>


                            <Text style={
                                {
                                    paddingLeft: 10,
                                    paddingTop: 5
                                }
                            }>Leonel Guardado</Text>

                            <Icon name="times"
                                style={{ paddingLeft: 10 }}
                                color="red"
                                size={25}
                            ></Icon>

                            <Icon name="angle-double-right"
                                style={{ paddingLeft: 10 }}
                                color="red"
                                size={25}></Icon>

                            <Icon name="comment-dots"
                                style={{ paddingLeft: 40 }}
                                size={25}></Icon>


                            <Icon name="phone"
                                style={{ paddingLeft: 15 }}
                                size={25}></Icon>

                        </View>
                        <View style={styles.area}>

                            <View style={{ paddingLeft: 120 }}>
                                <Text style={{ paddingLeft: 20 }}>1234567890</Text>
                                <Text>soporte@migo.com</Text>
                            </View>

                        </View>
                        <View>

                        </View>
                        <View style={styles.area}>

                            <Icon name="angle-double-right" size={20} style={{ paddingLeft: 10, paddingTop:10 }}></Icon>
                            <View style={
                                {
                                    paddingLeft: 110
                                }
                            }>
                                <Button

                                    title="Iniciar viaje"
                                    type="clear"
                                    onPress={() => {
                                        this.terminarViaje()
                                    }}
                                />

                            </View>


                        </View>

                    </View>
                    :
                    null

                }
                {this.state.finishTravel?
                    <View>

                        <View style={styles.area}>

                            <Text style={{ marginLeft: 20 }}> Pago con tarjeta</Text>


                        </View>
                        <View style={styles.area}>

                            <Icon style={
                                {
                                    paddingLeft: 10
                                }
                            } name="user" size={20}></Icon>


                            <Text style={
                                {
                                    paddingLeft: 10,
                                    paddingTop: 5
                                }
                            }>Leonel Guardado</Text>

                            <Icon name="times"
                                style={{ paddingLeft: 10 }}
                                color="red"
                                size={25}
                            ></Icon>

                            <Icon name="angle-double-right"
                                style={{ paddingLeft: 10 }}
                                color="red"
                                size={25}></Icon>

                            <Icon name="comment-dots"
                                style={{ paddingLeft: 40 }}
                                size={25}></Icon>


                            <Icon name="phone"
                                style={{ paddingLeft: 15 }}
                                size={25}></Icon>

                        </View>
                        <View style={styles.area}>

                            <View style={{ paddingLeft: 120 }}>
                                <Text style={{ paddingLeft: 20 }}>1234567890</Text>
                                <Text>soporte@migo.com</Text>
                            </View>

                        </View>
                        <View>

                        </View>
                        <View style={styles.area}>

                            <Icon name="angle-double-right" size={20} style={{ paddingLeft: 10, paddingTop: 25 }}></Icon>
                            <View style={
                                {
                                    paddingLeft: 90
                                }
                            }>
                                <Button

                                    title="Terminar viaje"
                                    type="clear"
                                    onPress={() => {
                                        this.terminarViaje()
                                    }}
                                />
                                <Text style={{paddingLeft:25}}>$60 MXN</Text>

                            </View>


                        </View>

                    </View>
                :
                null
                }
                  

           
            </ScrollView>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f0f4f7",
        marginTop: 10
    },
    row: {
        height: 10,
        backgroundColor: "#f0f4f7"
    },
    line: {
        height: 2,
        backgroundColor: "#f0f4f7"
    },
    block: {
        backgroundColor: "#f0f4f7",
        height: 190
    },
    title: {
        fontSize: 20,
        paddingBottom: 10
    },
    subtitle: {
        fontSize: 15,
        paddingLeft: 15
    },
    land: {
        flex: 1,
        paddingBottom: 30,
        flexDirection: "row"
    },
    icon_close: {
        paddingBottom: 10,
        paddingTop: 10
    },
    area: {
        flexDirection: "row",
        paddingLeft: 10,
        backgroundColor: "#fff",
        paddingTop: 15,
        borderColor:"black"
    },
    text: {
        paddingLeft: 15,
        fontSize: 16
    },
    rightArrow: {
        paddingLeft: 190
    },
    containerMap: {
        // ...StyleSheet.absoluteFillObject,
        height: 300,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10
    },
    map: {
        ...StyleSheet.absoluteFillObject,

    },


 
});
