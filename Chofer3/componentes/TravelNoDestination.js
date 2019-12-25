import React, { Component } from "react";
import { View, Text, StyleSheet, Switch, ScrollView, Image } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import * as Location from "expo-location";
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions';
const GOOGLE_MAPS_APIKEY = 'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY';
import * as Permissions from 'expo-permissions';

export default class TravelNoDestination extends Component {
    constructor(props) {

        super(props);
        this.state = {
            id_usuario: "2",
            puntoEncuentro: false,
            HomeTravel: true,
            aceptViaje: false,
            initravel: false,
            Travel: false,
            mapDirectionVehiclePartida: true,
            mapDirectionPartidaDestino: false,
            positionUser: {
                latitude: 0,
                longitude: 0,

            },

            latitude: 19.273247,
            longitude: -103.715795,
            parada1: {
                latitude: null,
                longitude: null,
            },
            myPosition: {
                latitude: 0,
                longitude: 0
            },
            region: {
                latitude: 0,
                longitude: 0,
                longitudeDelta: 0,
                latitudeDelta: 0

            },
            distance: 0,
            duration: 0,
            categoriaVehiculo: 1,
            Tarifa: 0,
            timer_2: null,
            timerAceptViaje: 15,
            intervaltimerAceptViaje: null,
            infoVehicleLlegada: null,
            DistanceVehicle: null
        };


        keys.socket.on('chat_chofer', (num) => {

            console.log("chat_chofer", num)

            keys.Chat.push(num.Mensaje);

            alert("Te llegó un mensaje");

        })





    }
    // Función para aceptar el viaje
    aceptViaje() {

        var d = new Date(); // get current date
        d.setHours(d.getHours(), d.getMinutes() + this.state.duration, 0, 0);


        clearInterval(this.state.intervaltimerAceptViaje);

        keys.socket.emit('chofer_accept_request', {
            id_usuario_socket: keys.id_usuario_socket,
            id_chofer_socket: keys.id_chofer_socket,
            datos_vehiculo: keys.datos_vehiculo, datos_chofer: keys.datos_chofer,
            positionChofer: this.state.myPosition
        });

        // keys.socket.emit('generar_servicio',{
        //     distancia_destino_usuario:,
        //     tiempo_viaje_destino:,
        //     latitud_usuario:,
        //     longitud_usuario:,
        //     latitud_usuario_destino:,
        //     longitud_usuario_destino:,
        //     geocoder_origen:,
        //     geocoder_destino:,
        //     id_usuario:,
        //     id_unidad:,
        //     id_conductor:
        // })

        this.fleet_chofer_usuario();


        this.setState({
            HomeTravel: false,
            aceptViaje: true,
            initravel: false,
            Travel: false,
            infoVehicleLlegada: d.toLocaleTimeString()
        })

    }

    // Función para enviar la posición del chofer al usuario (Con socket) 
    fleet_chofer_usuario = () => {
        // Envio de coordenadas de chofer hacia usuario emite al socket 'seguimiento_chofer' de usuario
        let intervalBroadcastCoordinates = setInterval(() => {
            this.findCurrentLocationAsync();
            if (this.state.location != null) {


                this.setState({
                    myPosition: {
                        latitude: this.state.location.coords.latitude,
                        longitude: this.state.location.coords.longitude
                    },

                })

                keys.socket.emit('room_chofer_usuario',
                    {
                        id_socket_usuario: keys.id_usuario_socket, id_socket_chofer: keys.id_chofer_socket,
                        coordenadas_chofer: { latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude }
                    });

            }

        }, 5000);
        keys.intervalBroadcastCoordinates = intervalBroadcastCoordinates;

    }

    // Función global para conseguir la posición del dispositivo 
    findCurrentLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permisos denegados por el usuario'
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
    };


    // Iniciar funciones de chófer, envio de coordenadas del chofer al ws
    conectChofer() {


        keys.stateConductor = !keys.stateConductor


        if (keys.stateConductor == true) {

            if (keys.id_chofer != null) {

                let timer = setInterval(() => {

                    this.findCurrentLocationAsync();

                    if (this.state.location != null) {

                        this.findCurrentLocationAsync();
                        keys.socket.emit('coordenadas', {
                            coordenadas: this.state.location.coords, id_chofer: keys.id_chofer,
                            datos_chofer: keys.datos_chofer, datos_vehiculo: keys.datos_vehiculo, estrellas: keys.estrellas, reconocimientos: keys.reconocimientos
                        });



                    }

                }, 10000);
                this.setState({ timer });

                this.setState({ startDisable: true })

            } else {
                alert("Ingrese un id para poder acceder a buscar pasajeros")
            }

        } else {
            clearInterval(this.state.timer);
            this.setState({ startDisable: false })
            this.state.text = '';
            keys.socket.emit('Exit', 'exit0');
        }
    }

    async componentDidMount() {

        const location = await Location.getCurrentPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;

        this.setState({
            region: {
                latitude: latitude,
                longitude: longitude,
                longitudeDelta: 0.0105,
                latitudeDelta: 0.0105

            },
        })
    }

    async componentWillMount() {
        // Bloque para asignar markers y trazos de rutas
        console.log("Travel integrado");
        console.log(keys.travelInfo);


        if (keys.type == "Unico") {

            let usuarioPosition = await Location.geocodeAsync(keys.travelInfo.puntoPartida.addressInput);


            this.setState({
                positionUser: {
                    latitude: usuarioPosition[0]["latitude"],
                    longitude: usuarioPosition[0]["longitude"]
                }
            })

            this.setState({
                parada1: {
                    latitude: keys.travelInfo.Parada1.latitude,
                    longitude: keys.travelInfo.Parada1.longitude
                }
            })

            console.log(this.state.parada1);


            const location = await Location.getCurrentPositionAsync({});
            latitude = location.coords.latitude;
            longitude = location.coords.longitude;


            this.setState({
                myPosition: {

                    latitude: latitude,
                    longitude: longitude

                },

            });

            console.log("positionChofer", this.state.myPosition);

        }

        // Bloque para la cuenta regresiva, ya sea para cancelación o aceptar el viaje 

        let intervaltimerAceptViaje = setInterval(() => {

            this.setState({ intervaltimerAceptViaje });

            console.log(this.state.intervaltimerAceptViaje);

            if (this.state.timerAceptViaje == 0) {

                clearInterval(this.state.intervaltimerAceptViaje);
                // Socket para quitar al chófer de la cola
                keys.socket.emit('popChofer', {
                    id_chofer_socket: keys.id_chofer_socket,
                    id_usuario_socket: keys.id_usuario_socket, Msg: "Solicitud rechazada por conductor, buscando otro conductor"
                });

                let timerCoordenadas = setInterval(() => {

                    this.findCurrentLocationAsync();

                    if (this.state.location != null) {


                        this.findCurrentLocationAsync();
                        keys.socket.emit('coordenadas', {
                            coordenadas: this.state.location.coords, id_chofer: keys.id_chofer,
                            datos_chofer: keys.datos_chofer, datos_vehiculo: keys.datos_vehiculo
                        });

                        console.log("timerCoordenadas", keys.timerCoordenadas)



                    }

                }, 5000);
                keys.timerCoordenadas = timerCoordenadas;

                this.props.navigation.navigate("Home", { flag: 1 });
                alert("Viaje cancelado");


            } else {

                this.setState({
                    timerAceptViaje: this.state.timerAceptViaje - 1
                })
            }


        }, 1000);



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
                    latitude: this.state.positionUser.latitude,
                    longitude: this.state.positionUser.longitude,
                },



            ]
        }

        if (this.state.puntoEncuentro == true) {
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
    // Función para iniciar en el punto de encuentro
    puntoEncuentro() {


        this.setState({
            HomeTravel: false,
            aceptViaje: false,
            initravel: true,
            mapDirectionVehiclePartida: false,
            mapDirectionPartidaDestino: true
        })

        // Socket de punto de encuentro, socket puntoEncuentroUsuario
        keys.socket.emit("puntoEncuentro", {
            id_socket_usuario: keys.id_usuario_socket
        });



    }



    Chat() {

        keys.socket.removeAllListeners("chat_chofer");
        this.props.navigation.navigate("Chat")
    }
    // Función para iniciar el viaje 
    iniciarViaje() {



        this.setState({
            HomeTravel: false,
            aceptViaje: false,
            initravel: false,
            Travel: true,

        })

    }
    // Función para terminar el viaje 
    terminarViaje() {
        this.props.navigation.navigate("viajeFinalizado");

        keys.socket.emit("terminarViajeChofer", { id_usuario_socket: keys.id_usuario_socket })
    }
    // Función para actualizar la región del mapa 
    onRegionChange = async region => {
        latitude = region.latitude;
        longitude = region.longitude;
        latitudeDelta = region.latitudeDelta;
        longitudeDelta = region.longitudeDelta;

        this.setState({
            region
        });


    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.container}>
                    <View style={styles.area}>
                        <View>
                            <Switch
                                value={keys.stateConductor}
                                onChange={() => this.conectChofer()}
                            />
                        </View>
                        <View>
                            <Text style={{ width: 100 }} >{keys.stateConductor ? "Conectado" : "Desconectado"}</Text>
                        </View>

                        <View style={
                            {
                                paddingLeft: 130,
                                paddingBottom: 5
                            }
                        }>
                            <Icon name="question-circle"
                                size={30}></Icon>
                        </View>
                        <View style={
                            {
                                paddingLeft: 10,
                                paddingBottom: 5
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
                                    <Text>{keys.datos_usuario.nombreUsuario}</Text>
                                </View>
                                <View >
                                    <Text style={{ fontWeight: "bold", marginLeft: 100 }}>{this.state.duration}<Text style={{ fontWeight: "normal" }}> min</Text></Text>

                                    <Text style={{ marginLeft: 70 }}>{this.state.distance} km de ti</Text>
                                </View>


                            </View>
                            <View style={styles.area}>

                                <Icon name="chevron-right" color="green" size={15}></Icon>

                                <Text style={{ marginLeft: 10 }}>{keys.travelInfo.puntoPartida.addressInput}</Text>
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
                                    <Text style={{ marginLeft: 10 }}>{this.state.aceptViaje ? keys.travelInfo.puntoPartida.addressInput : keys.travelInfo.Parada1.Direccion}</Text>
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
                            latitude: this.state.region.latitude,
                            longitude: this.state.region.longitude,
                            latitudeDelta: this.state.region.latitudeDelta,
                            longitudeDelta: this.state.region.longitudeDelta
                        }}

                        onRegionChangeComplete={this.onRegionChange}
                        followUserLocation={true}
                        ref={ref => (this.mapView = ref)}
                        zoomEnabled={true}
                        showsUserLocation={true}

                    >
                        {/* {Ubicación del chofer} */}
                        <Marker
                            coordinate={{
                                latitude: this.state.myPosition.latitude,
                                longitude: this.state.myPosition.longitude,
                            }}

                        >
                            <Icon color="#ff8834" name="car" size={20} ></Icon>
                        </Marker>

                        {/* Ubicación del usuario */}
                        <Marker
                            coordinate={{
                                latitude: this.state.positionUser.latitude,
                                longitude: this.state.positionUser.longitude,
                            }}

                        >
                            <Icon name="map-pin" size={20} color="green"></Icon>
                        </Marker>

                        {this.state.mapDirectionVehiclePartida ?

                            <MapViewDirections


                                origin={{
                                    latitude: this.state.myPosition.latitude,
                                    longitude: this.state.myPosition.longitude,
                                }}
                                destination={{
                                    latitude: this.state.positionUser.latitude,
                                    longitude: this.state.positionUser.longitude,
                                }}
                                apikey={GOOGLE_MAPS_APIKEY}
                                strokeWidth={1}
                                strokeColor="orange"
                                onReady={result => {
                                    if (result != null) {

                                        this.setState({
                                            distance: parseInt(result.distance),
                                            duration: parseInt(result.duration)
                                        })


                                    }



                                }}

                            />

                            :
                            null

                        }

                        {this.state.mapDirectionPartidaDestino ?

                            <View>
                                <MapViewDirections


                                    origin={{
                                        latitude: this.state.myPosition.latitude,
                                        longitude: this.state.myPosition.longitude,
                                    }}
                                    destination={{
                                        latitude: this.state.parada1.latitude,
                                        longitude: this.state.parada1.longitude,
                                    }}
                                    apikey={GOOGLE_MAPS_APIKEY}
                                    strokeWidth={1}
                                    strokeColor="blue"
                                    onReady={result => {
                                        if (result != null) {

                                            this.setState({
                                                distance: parseInt(result.distance),
                                                duration: parseInt(result.duration)
                                            })
                                        }



                                    }}

                                />

                                <Marker
                                    coordinate={{
                                        latitude: this.state.parada1.latitude,
                                        longitude: this.state.parada1.longitude,
                                    }}

                                >
                                    <Icon name="map-pin" size={20} color="green"></Icon>
                                </Marker>


                            </View>

                            :

                            null

                        }
                        {/* Ruta de chofer al punto de partida */}



                    </MapView>
                </View>
                {/* Barra inferior de punto de encuentro */}
                {this.state.aceptViaje ?
                    <View>

                        <View style={styles.area}>

                            <Text style={{ marginLeft: 5 }}> Contacta al usuario si llegas después de las {this.state.infoVehicleLlegada}</Text>

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
                            }>{this.state.nombreUsuario}</Text>

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
                                size={25}
                                onPress={() => this.Chat()}
                            ></Icon>


                            <Icon name="phone"
                                style={{ paddingLeft: 15 }}
                                size={25}></Icon>

                        </View>
                        <View style={styles.area}>

                            <View style={{ paddingLeft: 120 }}>
                                <Text style={{ paddingLeft: 20 }}>1234567890</Text>
                                <Text>{this.state.usuarioTelefono}</Text>
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
                                    this.aceptViaje();
                                }}
                            />
                            <Text style={
                                {
                                    paddingLeft: 45
                                }
                            }>{this.state.timerAceptViaje}</Text>
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

                            <Image
                                style={{ width: 50, height: 50 }}
                                source={require("./../assets/user.png")}
                            ></Image>


                            <Text style={
                                {
                                    paddingLeft: 10,
                                    paddingTop: 5
                                }
                            }>{keys.datos_usuario.nombreUsuario}</Text>

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
                                size={25}
                                onPress={() => this.Chat()}
                            ></Icon>


                            <Icon name="phone"
                                style={{ paddingLeft: 15 }}
                                size={25}></Icon>

                        </View>
                        <View style={styles.area}>

                            <View style={{ paddingLeft: 120 }}>
                                <Text style={{ paddingLeft: 20 }}>{keys.datos_usuario.numeroTelefono}</Text>
                                <Text>{keys.datos_usuario.correoElectronico}</Text>
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
                            }>{this.state.nombreUsuario}</Text>

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
                                size={25}
                                onPress={() => this.Chat()}
                            ></Icon>


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
                                <Text style={{ paddingLeft: 25 }}>${keys.Tarifa} MXN</Text>

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
