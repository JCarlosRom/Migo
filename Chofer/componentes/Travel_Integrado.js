import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, Switch, ScrollView, Slider } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
    createAppContainer,
    StackActions,
    NavigationActions
} from "react-navigation"; // Version can be specified in package.json
import MapView, { Marker, AnimatedRegion } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import axios from 'axios';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions';
const GOOGLE_MAPS_APIKEY = 'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY';
export default class Travel_Integrado extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id_usuario: "2",
            puntoEncuentro: false,
            HomeTravel: true,
            aceptViaje: false,
            initravel: false,
            Travel: false,
            showMapDirections: false,
            positionUser: {
                latitude: 0,
                longitude: 0,

            },

            latitude: 19.273247,
            longitude: -103.715795,
            parada1: {
                latitude: 19.264983,
                longitude: -103.713446,
            },
            myPosition: {
                latitude: 0,
                longitude: 0
            },
            distance: 0,
            duration: 0,
            categoriaVehiculo: 1,
            Tarifa: 0






        };



    }



    async componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {

                this.setState({
                    myPosition: {

                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude

                    },
                    error: null,
                });

            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true },
        );


        try {
            //console.log(this.props.switchValue);
            const res = await axios.post('http://34.95.33.177:3003/webservice/interfaz204/MostrarDestinosFavoritos', {
                id_usuario: this.state.id_usuario
            });


            this.setState({
                positionUser: {
                    latitude: parseFloat(res.data.datos[0]["coordenadas"].substring(0, 9)),
                    longitude: parseFloat(res.data.datos[0]["coordenadas"].substring(10, 22)),
                }


            })


            //console.log(res);


        } catch (e) {
            console.log(e);
            alert("No hay conexión al web service", "Error");
        }


    }

    Go = () => {
        const data = {
            source: {
                latitude: this.state.myPosition.latitude,
                longitude: this.state.myPosition.longitude
            },
            destination: {
                latitude: this.state.positionUser.latitude,
                longitude: this.state.positionUser.longitude
            },
            params: [
                {
                    key: "travelmode",
                    value: "driving"        // may be "walking", "bicycling" or "transit" as well
                },
                {
                    key: "dir_action",
                    value: "navigate"       // this instantly initializes navigation using the given travel mode
                }
            ],


        }

        if (this.state.Travel == true) {
            data.waypoints = [
                {
                    latitude: this.state.parada1.latitude,
                    longitude: this.state.parada1.longitude,
                },
           


            ]
        }

        getDirections(data)
    }

    static navigationOptions = {
        title: "Viaje"
    };

    puntoEncuentro() {
        this.setState({
            HomeTravel: false,
            aceptViaje: false,
            initravel: true,
            showMapDirections: true


        })
    }

    async iniciarViaje() {

        try {
            //console.log(this.props.switchValue);
            const res = await axios.post('http://34.95.33.177:3003/webservice/interfaz164/UsuarioCalculoPrecios', {
                distancia_km: this.state.distance,
                tiempo_min: this.state.duration
            });


            res.data.datos.forEach(element => {



                if (element["categoria_servicio"] == this.state.categoriaVehiculo) {

                    this.setState({

                        Tarifa: element["out_costo_viaje"],


                    })
                }



            });

        } catch (e) {
            console.log(e);
            alert("No hay conexión al web service", "Error");
        }

        this.setState({
            HomeTravel: false,
            aceptViaje: false,
            initravel: false,
            Travel: true,

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
                    {this.state.HomeTravel ?

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
                                    <Text style={{ fontWeight: "bold", marginLeft: 100 }}>{this.state.duration}<Text style={{ fontWeight: "normal" }}> min</Text></Text>

                                    <Text style={{ marginLeft: 70 }}>{this.state.distance} km de ti</Text>
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

                    {this.state.aceptViaje || this.state.Travel ?


                        <View >

                            <View style={styles.area}>

                                <Icon name="chevron-right" color="green" size={15}></Icon>

                                <View style={{ width: 280 }}>
                                    <Text style={{ marginLeft: 10 }}>Plaza Zentralia, Paseo de la Madrid Hurtado, 301, Residencial Valle Dorado, 28018 Colima, Col.</Text>
                                    <Text style={{ marginLeft: 10 }}>{this.state.duration} min ({this.state.distance} km)</Text>
                                </View>
                                <View>
                                    <Icon name="chevron-up" size={30} onPress={this.Go}></Icon>
                                    <Text style={{ paddingLeft: 4 }}>Go</Text>
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
                            latitude: this.state.myPosition.latitude,
                            longitude: this.state.myPosition.longitude,
                            latitudeDelta: 0.0105,
                            longitudeDelta: 0.0105,
                        }}
                        followUserLocation={true}
                        ref={ref => (this.mapView = ref)}
                        zoomEnabled={true}
                        showsUserLocation={true}

                    >

                        {/* Ubicación del usuario */}
                        <Marker
                            coordinate={{
                                latitude: this.state.positionUser.latitude,
                                longitude: this.state.positionUser.longitude,
                            }}

                        >
                            <Icon name="map-pin" size={20} color="green"></Icon>
                        </Marker>

                        {this.state.showMapDirections ?
                            <View>
                                {/* Ubicación del destino 1 */}
                                <Marker
                                    coordinate={{
                                        latitude: this.state.parada1.latitude,
                                        longitude: this.state.parada1.longitude,
                                    }}

                                >
                                    <Icon name="map-pin" size={20} color="orange"></Icon>
                                </Marker>
                                {/* Ubicación del destino 2 */}
                            

                            </View>

                            :
                            null
                        }


                        {this.state.initravel?
                            
                            null
                    
                        :
                        
                            <MapViewDirections


                                destination={{
                                    latitude: this.state.positionUser.latitude,
                                    longitude: this.state.positionUser.longitude,
                                }}
                                origin={{
                                    latitude: this.state.myPosition.latitude,
                                    longitude: this.state.myPosition.longitude,
                                }}
                                apikey={GOOGLE_MAPS_APIKEY}
                                strokeWidth={1}
                                strokeColor="blue"
                                onReady={result => {
                                    this.setState({
                                        distance: parseInt(result.distance),
                                        duration: parseInt(result.duration)

                                    })


                                }}

                            />
                        }


                        {this.state.showMapDirections ?
                           
                            <View>


                                <MapViewDirections


                                    origin={{
                                        latitude: this.state.positionUser.latitude,
                                        longitude: this.state.positionUser.longitude,
                                    }}

                                    destination={{
                                        latitude: this.state.parada1.latitude,
                                        longitude: this.state.parada1.longitude,
                                    }}
                                    apikey={GOOGLE_MAPS_APIKEY}
                                    strokeWidth={1}
                                    strokeColor="orange"
                                    onReady={result => {
                                        this.setState({
                                            distance: this.state.distance + parseInt(result.distance),
                                            duration: this.state.duration + parseInt(result.duration)

                                        })


                                    }}

                                />

                            </View>

                            :

                            null
                        }



                    </MapView>
                </View>
                {/* Barra inferior de punto de encuentro */}
                {this.state.aceptViaje ?
                    <View>

                        <View style={styles.area}>

                            <Text style={{ marginLeft: 5 }}> Contacta al usuario si llegas después de las 21:11</Text>


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
                {this.state.HomeTravel ?
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
                                        showMapDirections: true

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

                            <Icon name="angle-double-right" size={20} style={{ paddingLeft: 10, paddingTop: 10 }}></Icon>
                            <View style={
                                {
                                    paddingLeft: 110
                                }
                            }>
                                <Button

                                    title="Iniciar viaje"
                                    type="clear"
                                    onPress={() => {
                                        this.iniciarViaje()
                                    }}
                                />

                            </View>


                        </View>

                    </View>
                    :
                    null

                }
                {this.state.Travel ?
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
                                <Text style={{ paddingLeft: 25 }}>${this.state.Tarifa} MXN</Text>

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
        borderColor: "black"
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
