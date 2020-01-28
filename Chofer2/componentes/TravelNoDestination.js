import React, { Component } from "react";
import { View, Text, StyleSheet, Switch, ScrollView, Image, FlatList, TouchableHighlight } from "react-native";
import Modal from "react-native-modal";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import * as Location from "expo-location";
import { StackActions, NavigationEvents, NavigationActions } from 'react-navigation';
import MapViewDirections from 'react-native-maps-directions';
import { showLocation } from 'react-native-map-link'
import getDirections from 'react-native-google-maps-directions';
import * as Permissions from 'expo-permissions';
import axios from 'axios';
import call from 'react-native-phone-call'

export default class TravelNoDestination extends Component {
    constructor(props) {
        keys.socket.on('isConnected', () => { })
        super(props);
        this.state = {
            id_usuario: "2",
            HomeTravel: true,
            aceptViaje: false,
            initravel: false,
            Travel: false,
            mapDirectionVehiclePartida: true,
            mapDirectionPartidaDestino: false,
            showInputAddress: false,
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
            DistanceVehicle: null,
            destination: "",
            predictions: [],
            showListdestination: false,
            showModal:false,
            Descripcion:""
       
        };

        keys.socket.on('recorrido_id_conductor', num => {
            console.log('Llego respuesta: ', num);

            keys.id_servicio = num.servicio;
            keys.id_recorrido = num.recorrdio;

            console.log("idServicio", keys.id_servicio);
            console.log("idRecorrido", keys.id_recorrido);
            // this.state.id_recorrido = num;
            // this.setState({

            // });
        
       
            // Desactivar animación 

        });

        keys.socket.removeAllListeners("chat_chofer");

        keys.socket.on("LlegoMensaje", (num) => {
            this.setState({
                showModal: true,
                Descripcion: "Te llegó un mensaje",
            })
        })

        keys.socket.on('chat_chofer', (num) => {

            keys.Chat.push(num.Mensaje);


        })

        keys.socket.on('cancelViajeChofer', () => {

            keys.Chat = [];

            clearInterval(keys.intervalBroadcastCoordinates);

            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home', params: { Flag: "CancelarServicio" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);

        })






    }

    callPhoneFunction() {
        const args = {
            number: keys.datos_usuario.numeroTelefono, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
        }

        call(args).catch(console.error)
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

        // console.log("id_conductor_socket", keys.id_chofer_socket);
        // console.log("id_usuario_socket", keys.id_usuario_socket);
        // console.log("Distancia", keys.travelInfo.Distancia);
        // console.log("Tiempo Destino", keys.travelInfo.Tiempo);
        // console.log("latitud_usuario", keys.positionUser.latitude);
        // console.log("longitud_usuario", keys.positionUser.longitude);
        // console.log("latitud_usuario_destino", this.state.parada1.latitude);
        // console.log("longitud_usuario_destino", this.state.parada1.longitude);
        // console.log("geocoder_origen", keys.travelInfo.puntoPartida.addressInput);
        // console.log("geocoder_destino", keys.travelInfo.Parada1.Direccion );
        // console.log("id_usuario", keys.datos_usuario.id_usuario);
        // console.log("id_unidad", keys.datos_vehiculo.id_unidad);
        // console.log("id_conductor", keys.id_chofer);

        // keys.socket.emit('generar_servicio', {
        //     id_conductor_socket: keys.id_chofer_socket,
        //     id_usuario_socket: keys.id_usuario_socket,
        //     distancia_destino_usuario: keys.travelInfo.Distancia,
        //     tiempo_viaje_destino: keys.travelInfo.Tiempo,
        //     latitud_usuario: this.state.positionUser.latitude,
        //     longitud_usuario: this.state.positionUser.longitude,
        //     latitud_usuario_destino: this.state.parada1.latitude,
        //     longitud_usuario_destino: this.state.parada1.longitude,
        //     geocoder_origen: keys.travelInfo.puntoPartida.addressInput,
        //     geocoder_destino: keys.travelInfo.Parada1,
        //     id_usuario: keys.datos_usuario.id_usuario,
        //     id_unidad: keys.datos_vehiculo.id_unidad,
        //     id_conductor: keys.datos_vehiculo.id_chofer
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
            console.log("room_chofer_usuario TND")
            this.findCurrentLocationAsync();
            if (this.state.location != null && keys.id_usuario_socket != undefined) {


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




    async componentDidMount() {

        const location = await Location.getCurrentPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;

        this.setState({
            region: {
                latitude: latitude,
                longitude: longitude,
                longitudeDelta: 0.040,
                latitudeDelta: 0.040

            },
        })
    }

    async componentWillMount() {
        // Bloque para asignar markers y trazos de rutas
        Flag = this.props.navigation.getParam('Flag', false);

        if (Flag == "Acept") {
            this.setState({
                showModal: true,
                Descripcion: "Te ha llegado una solicitud"
            })
        }


        let usuarioPosition = await Location.geocodeAsync(keys.travelInfo.puntoPartida.addressInput);


        this.setState({
            positionUser: {
                latitude: usuarioPosition[0]["latitude"],
                longitude: usuarioPosition[0]["longitude"]
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


                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Home', params: { Flag: "CancelarServicioAutomatico" } })],
                    key: undefined
                });

                this.props.navigation.dispatch(resetAction);

               

            } else {

                this.setState({
                    timerAceptViaje: this.state.timerAceptViaje - 1
                })
            }


        }, 1000);



    }

    Go = () => {

        coordinates = {
            latitude: 0,
            longitude: 0
        }

        if (this.state.aceptViaje == true) {
            coordinates = {
                latitude: this.state.positionUser.latitude,
                longitude: this.state.positionUser.longitude,
            }

            console.log(coordinates);

        } else {
            if (this.state.Travel == true) {

                coordinates = {
                    latitude: this.state.parada1.latitude,
                    longitude: this.state.parada1.longitude,
                }


                console.log("punto de encuentro", coordinates);

            }
        }

        // Google maps 
        if (keys.travelType == true) {

            const data = {
                source: {
                    latitude: this.state.myPosition.latitude,
                    longitude: this.state.myPosition.longitude
                },

                destination: {
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude
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

            getDirections(data)

        } else {
            // Waze
            showLocation({
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                sourceLatitude: this.state.myPosition.latitude,  // optionally specify starting location for directions
                sourceLongitude: this.state.myPosition.longitude,  // not optional if sourceLatitude is specified
                title: 'The White House',  // optional
                googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
                alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
                dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
                dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
                cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
                appsWhiteList: ['waze'] // optionally you can set which apps to show (default: will show all supported apps installed on device)
                // app: 'uber'  // optionally specify specific app to use
            })
        }
    }

    static navigationOptions = {
        title: "Viaje",
        headerLeft: null
    };
    // Función para iniciar en el punto de encuentro
    puntoEncuentro() {


        this.setState({
            HomeTravel: false,
            aceptViaje: false,
            initravel: true,
            mapDirectionVehiclePartida: false,
            showInputAddress: true
        })

        if (keys.type != "SinDestino") {
            this.setState({

                mapDirectionPartidaDestino: true

            });
        }

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
    async iniciarViaje() {

        try {
            
            console.log("Destination 2", this.state.destination);
    
    
            let Parada1 = await Location.geocodeAsync(this.state.destination);

            console.log(Parada1);

            if(Parada1.length==0){

                this.setState({
                    showModal: true,
                    Descripcion: "Favor de agregar un destino correcto"
                })
                


            }else{

                this.setState({
                    parada1: {
                        latitude: Parada1[0]["latitude"],
                        longitude: Parada1[0]["longitude"],
                    },
                })
        
        
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
                    info: Parada1Info,
                    flag:"PrimeraParada"
                });
        
        
        
                keys.Paradas = this.state.Paradas;
        
                keys.travelInfo.Parada1 = keys.Paradas[0];
        
                this.setState({
                    showInputAddress: false,
                    mapDirectionPartidaDestino: true,
                    initravel:false,
                    Travel:true
        
                });
        
                console.log("keys travel info",keys.travelInfo.Parada1);
        
             
            }
    
        

        } catch (error) {
            console.log(error);
           
        }   



        
        
     
    }

    async generarServicio(){

        try {
            console.log("categoria 1", keys.datos_vehiculo.categoriaVehiculo)
            console.log("distance 1", this.state.distance);
            console.log("tiempo 1", this.state.duration)

            //console.log(this.props.switchValue);
            const res = await axios.post('http://35.203.42.33:3003/webservice/interfaz164/UsuarioCalculoPrecios', {
                distancia_km: this.state.distance,
                tiempo_min: this.state.duration
            });

            res.data.datos.forEach(element => {
                
                console.log(element)

                if(element["categoria_servicio"]==keys.datos_vehiculo.categoriaVehiculo){

                   
                    keys.Tarifa = parseInt(element["out_costo_viaje"]);
            
                }


            });
        } catch (e) {
            console.log(e);

            this.setState({
                showModal: true,
                Descripcion: "Servicio no disponible, Intente más tarde"
            })


        }




        console.log("Distance", this.state.distance);
        console.log("Duration", this.state.duration);
        console.log("Id Chofer", keys.datos_chofer.idChofer);

        console.log("Tarifa", keys.Tarifa);

        keys.socket.emit('generar_servicio', {
            id_conductor_socket: keys.id_chofer_socket,
            id_usuario_socket: keys.id_usuario_socket,
            distancia_destino_usuario: this.state.distance,
            tiempo_viaje_destino: this.state.duration,
            latitud_usuario: this.state.positionUser.latitude,
            longitud_usuario: this.state.positionUser.longitude,
            latitud_usuario_destino: this.state.parada1.latitude,
            longitud_usuario_destino: this.state.parada1.longitude,
            geocoder_origen: keys.travelInfo.puntoPartida.addressInput,
            geocoder_destino: keys.travelInfo.Parada1.Direccion,
            id_usuario: keys.datos_usuario.id_usuario,
            id_unidad: keys.datos_vehiculo.id_unidad,
            id_conductor: keys.datos_chofer.idChofer
        })

        if (keys.Tarifa != 0) {

            this.setState({
                HomeTravel: false,
                aceptViaje: false,
                initravel: false,
                Travel: true

            })
        }
    }





  
    // Función para terminar el viaje 
    terminarViaje() {

        clearInterval(keys.intervalBroadcastCoordinates);

        keys.Chat = [];

  
        this.props.navigation.navigate("Pago");


        // keys.socket.emit("terminarViajeChofer", { id_usuario_socket: keys.id_usuario_socket })
    }

    // Función para cancelar viaje
    cancelViaje() {

        keys.Chat = [];

        clearInterval(keys.intervalBroadcastCoordinates);

        keys.socket.emit("cancelaConductor", { id: keys.id_servicio })

        keys.socket.emit("cancelViajeChofer", {
            id_socket_usuario: keys.id_usuario_socket
        });

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home', params: { Flag: "CancelarServicioChofer" } })],
            key: undefined
        });

        this.props.navigation.dispatch(resetAction);
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

    autocompleteGoogle = async destination => {
        this.setState({
            destination: destination
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
                    <View style={{ flexDirection:"row", paddingTop: 10, paddingBottom: 10 }}>
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

        console.log("Description", description);

        this.setState({
            destination: description
        });

        this.setState({
            showListdestination: false
        })

        console.log("Destination", this.state.destination);
    };


    render() {
        return (

            <View style={{ flex: 1 }}>
                <View>

                    <Modal
                        isVisible={this.state.showModal}

                    >
                        <View style={{ marginTop: 22, backgroundColor: "#fff" }}>
                            <View>

                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}>{this.state.Descripcion}</Text>

                            </View>
                            <View style={{
                                flexDirection: "row",
                                paddingTop: 5,
                                marginBottom: 5

                            }}>
                                <View style={{ flex: 2 }}></View>


                                <View style={{ flex: 2, paddingBottom: 5 }}>

                                    <Button
                                        title="Ok"
                                        buttonStyle={{
                                            backgroundColor: "#ff8834"
                                        }}
                                        onPress={() => this.setState({
                                            showModal: false
                                        })}
                                    ></Button>


                                </View>
                                <View style={{ flex: 2 }}></View>
                            </View>
                        </View>


                    </Modal>

                </View>


                <View >

                    <Modal
                        isVisible={this.state.showModalCancel}

                    >
                        <View style={styles.area}>
                            <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}>Esta cancelación afectará a tu tasa de viajes finalizados</Text>
                        </View>
                        {/* Primer motivo */}
                        <View style={styles.area}>
                            <View style={{ flex: 1 }}>
                                <View style={{ alignSelf: "center" }}>

                                    <Icon name="check-circle" color={this.state.clienteNoPresento ? "green" : "#ff8834"} size={20} onPress={() => this.setState({
                                        clienteNoPresento: true,
                                        clienteNoCancelacion: false,
                                        direccionIncorrecta: false,
                                        noCobrarCliente: false,
                                        Otro: false
                                    })}></Icon>

                                </View>
                            </View>
                            <View style={{ flex: 5 }}>
                                <Text> El cliente no se presentó</Text>
                            </View>
                        </View>
                        {/* Segundo mótivo */}
                        <View style={styles.area}>
                            <View style={{ flex: 1 }}>
                                <View style={{ alignSelf: "center" }}>

                                    <Icon name="check-circle" color={this.state.clienteNoCancelacion ? "green" : "#ff8834"} size={20} onPress={() => this.setState({
                                        clienteNoPresento: false,
                                        clienteNoCancelacion: true,
                                        direccionIncorrecta: false,
                                        noCobrarCliente: false,
                                        Otro: false
                                    })}></Icon>

                                </View>
                            </View>
                            <View style={{ flex: 5 }}>
                                <Text> El cliente pidió la cancelación</Text>
                            </View>
                        </View>
                        {/* Tercer mótivo */}
                        <View style={styles.area}>
                            <View style={{ flex: 1 }}>
                                <View style={{ alignSelf: "center" }}>

                                    <Icon name="check-circle" color={this.state.direccionIncorrecta ? "green" : "#ff8834"} size={20} onPress={() => this.setState({
                                        clienteNoPresento: false,
                                        clienteNoCancelacion: false,
                                        direccionIncorrecta: true,
                                        noCobrarCliente: false,
                                        Otro: false
                                    })}></Icon>

                                </View>
                            </View>
                            <View style={{ flex: 5 }}>
                                <Text> Dirección incorrecta</Text>
                            </View>
                        </View>

                        {/* Cuarto mótivo */}
                        <View style={styles.area}>
                            <View style={{ flex: 1 }}>
                                <View style={{ alignSelf: "center" }}>
                                    <Icon name="check-circle" color={this.state.noCobrarCliente ? "green" : "#ff8834"} size={20} onPress={() => this.setState({
                                        clienteNoPresento: false,
                                        clienteNoCancelacion: false,
                                        direccionIncorrecta: false,
                                        noCobrarCliente: true,
                                        Otro: false
                                    })}></Icon>
                                </View>
                            </View>
                            <View style={{ flex: 5 }}>
                                <Text> No cobrar al cliente</Text>
                            </View>
                        </View>

                        {/* Quinto mótivo */}
                        <View style={styles.area}>
                            <View style={{ flex: 1 }}>
                                <View style={{ alignSelf: "center" }}>

                                    <Icon name="check-circle" color={this.state.Otro ? "green" : "#ff8834"} size={20}
                                        onPress={() => this.setState({
                                            clienteNoPresento: false,
                                            clienteNoCancelacion: false,
                                            direccionIncorrecta: false,
                                            noCobrarCliente: false,
                                            Otro: true
                                        })}></Icon>
                                </View>
                            </View>
                            <View style={{ flex: 5 }}>
                                <Text> Otro</Text>
                            </View>
                        </View>


                        <View
                            style={styles.area}>
                            <View style={{ flex: 2 }}></View>

                            <View style={{ flex: 2, marginBottom: 5, paddingRight: 5 }}>
                                <Button
                                    title="No Cancelar"
                                    buttonStyle={{
                                        backgroundColor: "#ff8834"
                                    }}
                                    titleStyle={{ fontSize: 12 }}
                                    onPress={() => this.setState({
                                        showModalCancel: false
                                    })}

                                ></Button>

                            </View>
                            <View style={{ flex: 2, marginBottom: 5, marginRight: 5 }}>

                                <Button
                                    title="Cancelar"
                                    buttonStyle={{
                                        backgroundColor: "#ff8834"
                                    }}
                                    titleStyle={{ fontSize: 12 }}
                                    onPress={() => this.cancelViaje()}

                                ></Button>

                            </View>
                        </View>


                    </Modal>

                </View>

                {this.state.region.latitude != 0 && this.state.region.longitude != 0 && this.state.region.latitudeDelta != 0 && this.state.region.longitudeDelta != 0 && this.state.myPosition.latitude != 0 && this.state.myPosition.longitude != 0 ?


                    <MapView

                        style={{top:"-20%", height:"120%"}}
                        region={{
                            latitude: this.state.region.latitude,
                            longitude: this.state.region.longitude,
                            longitudeDelta: this.state.region.longitudeDelta,
                            latitudeDelta: this.state.region.latitudeDelta
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

                        {this.state.mapDirectionVehiclePartida && this.state.myPosition.latitude != 0
                            && this.state.myPosition.longitude != 0 && this.state.positionUser.latitude != 0
                            && this.state.positionUser.longitude != 0 ?

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

                        {this.state.mapDirectionPartidaDestino && this.state.myPosition.latitude != 0
                            && this.state.myPosition.longitude != 0 && this.state.parada1.latitude != 0
                            && this.state.parada1.longitude != 0 ?

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
                                    apikey={keys.GOOGLE_MAPS_APIKEY}
                                    strokeWidth={1}
                                    strokeColor="blue"
                                    onReady={result => {
                                        if (result != null) {

                                            this.setState({
                                                distance: parseInt(result.distance),
                                                duration: parseInt(result.duration)
                                            })

                                            if (keys.Tarifa == 0) {
                                                this.generarServicio();
                                            }






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
                    :
                    null

                }


                <View style={{ flexDirection: "row", position: "absolute", top: "3%" }}>
                    <View style={{ flex: 1 }}>
                        <Switch
                            value={keys.stateConductor}

                        />
                    </View>
                    <View style={{ flex: 4 }}>
                        <Text style={{ width: 100 }} >{keys.stateConductor ? "Conectado" : "Desconectado"}</Text>
                    </View>
                    <View style={{ flex: 1 }}></View>

                    <View style={
                        {
                            flex: 1,
                            paddingBottom: 5
                        }
                    }>
                        <Icon name="question-circle"
                            size={30}
                            color="#ff8834"
                        ></Icon>
                    </View>
                    <View style={
                        {
                            flex: 1,
                            paddingBottom: 5
                        }
                    }>
                        <Icon name="cog"
                            color="#ff8834"
                            size={30}></Icon>
                    </View>
                </View>

                {
                    this.state.showInputAddress ?

                        <View style={{ flexDirection: "row", position: "absolute", top: "10%" }}>
                            <View style={{ flex: 6, paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}>

                                <Input
                                    value={this.state.destination}
                                    placeholder="Ingrese el destino"
                                    onChangeText={destination => this.autocompleteGoogle(destination)}

                                />
                            </View>
                            <View style={{ flex: 1 }}></View>

                        </View>


                        :

                        null
                }

                {this.state.showListdestination ? (
                    <View style={{ flexDirection: "row", position: "absolute", top: "20%" }}>

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

                {/* Barra superior de punto de encuentro  */}
                {this.state.HomeTravel ?



                    <View style={{
                        flexDirection: "row",
                        position: "absolute",
                        top: "10%",
                        left: "3%"
                    }}>
                        <View style={{ flex: 1 }}>
                            <Image
                                style={{ width: 50, height: 50 }}
                                source={require("./../assets/user.png")}
                            ></Image>
                        </View>
                        <View style={
                            {
                                flex: 3
                            }
                        }>
                            <Text>{keys.datos_usuario.nombreUsuario}</Text>
                        </View>
                        <View style={{ flex: 2 }} >
                            <Text style={{ fontWeight: "bold" }}>{this.state.duration}<Text style={{ fontWeight: "normal" }}> min</Text></Text>

                            <Text style={{ marginLeft: 5 }}>{this.state.distance} km de ti</Text>
                        </View>


                    </View>


                    :
                    null
                }

                {this.state.HomeTravel ?
                    <View style={{
                        flexDirection: "row",
                        position: "absolute",
                        top: "20%",
                        left: "3%"
                    }}>

                        <Icon name="chevron-right" color="green" size={15}></Icon>

                        <Text style={{ marginLeft: 10 }}>{keys.travelInfo.puntoPartida.addressInput}</Text>
                    </View>
                    :
                    null
                }


                {this.state.aceptViaje || this.state.Travel ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "12%" }}>

                        <Icon name="chevron-right" color="green" size={15}></Icon>

                        <View style={{ width: 280 }}>
                            <Text style={{ marginLeft: 10 }}>{this.state.aceptViaje ? keys.travelInfo.puntoPartida.addressInput : keys.travelInfo.Parada1.Direccion}</Text>
                            <Text style={{ marginLeft: 10 }}>{this.state.duration} min ({this.state.distance} km)</Text>
                        </View>
                        <View>
                            <Icon name="chevron-up" size={30} color="#ff8834" onPress={this.Go}></Icon>
                            <Text style={{ paddingLeft: 4 }}>Go</Text>
                        </View>
                    </View>

                    :
                    null
                }

                {/* Barra inferior para aceptar el viaje  */}
                {this.state.HomeTravel ?
                    <View style={{ flexDirection: "row", position: "absolute", top: "85%" }}>

                        <View style={{ flex: 1 }}>

                            <Icon name="angle-double-right" color="#ff8834" style={{ marginTop: 15 }} size={30} ></Icon>

                        </View>
                        <View style={
                            {
                                flex: 3
                            }
                        }>
                            <View>

                                <Button

                                    title="Aceptar viaje"
                                    type="clear"
                                    onPress={() => {
                                        this.aceptViaje();
                                    }}
                                />
                                <View style={{ flexDirection: "row" }}>

                                    <View style={{ flex: 1 }}></View>
                                    <View style={{ flex: 1 }}>
                                        <Text>{this.state.timerAceptViaje}</Text>
                                    </View>

                                </View>



                            </View>
                        </View>
                        <View style={{ flex: 1 }}>

                        </View>

                    </View>
                    :
                    null
                }

                {/* Barra inferior de punto de encuentro */}
                {this.state.aceptViaje ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "58%" }}>

                        <Text style={{ marginLeft: 5 }}> Contacta al usuario si llegas después de las {this.state.infoVehicleLlegada}</Text>

                    </View>

                    :
                    null
                }

                {this.state.aceptViaje ?
                    <View style={{ flexDirection: "row", position: "absolute", top: "70%" }}>

                        <View style={{ flex: 1 }}>

                            <Image
                                style={{ width: 50, height: 50 }}
                                source={require("./../assets/user.png")}
                            ></Image>

                        </View>

                        <View style={{ flex: 2 }}>

                            <Text>{keys.datos_usuario.nombreUsuario}</Text>

                        </View>

                        <View style={{ flex: 1 }}>

                            <Icon name="times"
                                color="red"
                                size={25}
                                onPress={() => this.setState({
                                    showModalCancel: true
                                })}
                            ></Icon>
                        </View>

                        <View style={{ flex: 1 }}>

                            <Icon name="comment-dots"
                                size={25}
                                color="#ff8834"
                                onPress={() => this.Chat()}
                            ></Icon>

                        </View>

                        <View style={{ flex: 1 }}>

                            <Icon name="phone" onPress={() => this.callPhoneFunction()}
                                size={25}
                                color="#ff8834"
                                onPress={() => this.callPhoneFunction()}
                            ></Icon>

                        </View>


                    </View>

                    :
                    null
                }

                {this.state.aceptViaje ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "80%" }}>


                        <View style={{ flex: 6 }}>

                            <View style={{ alignSelf: "center" }}>
                                <Text >1234567890</Text>
                                <Text>{keys.datos_usuario.numeroTelefono}</Text>
                            </View>

                        </View>
                    </View>

                    :
                    null

                }

                {this.state.aceptViaje ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "87%" }}>

                        <View style={{ flex: 1 }}>

                            <Icon name="angle-double-right" color="#ff8834" style={{ marginTop: 15 }} size={30} ></Icon>

                        </View>
                        <View style={
                            {
                                flex: 5
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
                        <View style={{ flex: 1 }}>

                        </View>


                    </View>

                    :
                    null
                }

                {/* Barra inferior de inicio de viaje */}
                {this.state.initravel ?
                    <View style={{ flexDirection: "row", position: "absolute", top: "62%" }}>

                        <Text style={{ marginLeft: 5 }}> Por favor espera al usuario: 2:00 minutos</Text>


                    </View>
                    :
                    null

                }

                {this.state.initravel ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "73%" }}>

                        <View style={{ flex: 1 }}>

                            <Image
                                style={{ width: 50, height: 50 }}
                                source={require("./../assets/user.png")}
                            ></Image>

                        </View>

                        <View style={{ flex: 2 }}>

                            <Text>{keys.datos_usuario.nombreUsuario}</Text>

                        </View>

                        <View style={{ flex: 1 }}>

                            <Icon name="times"
                                color="red"
                                size={25}
                                onPress={() => this.setState({
                                    showModalCancel: true
                                })}
                            ></Icon>
                        </View>

                        <View style={{ flex: 1 }}>

                            <Icon name="comment-dots"
                                size={25}
                                color="#ff8834"
                                onPress={() => this.Chat()}
                            ></Icon>

                        </View>

                        <View style={{ flex: 1 }}>

                            <Icon name="phone" onPress={() => this.callPhoneFunction()}
                                size={25}
                                color="#ff8834"
                                onPress={() => this.callPhoneFunction()}
                            ></Icon>

                        </View>


                    </View>

                    :
                    null
                }
                {this.state.initravel ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "83%" }}>
                        <View style={{ flex: 6 }}>

                            <View style={{ flex: 2 }}></View>

                            <View style={{ flex: 2 }}>

                                <View style={{ alignSelf: "center", alignContent: "center" }}>
                                    <Text >{keys.datos_usuario.numeroTelefono}</Text>
                                    <Text>{keys.datos_usuario.correoElectronico}</Text>
                                </View>


                            </View>

                            <View style={{ flex: 2 }}></View>

                        </View>

                    </View>

                    :
                    null
                }

                {this.state.initravel ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "92%" }}>

                        <View style={{ flex: 1 }}>

                            <Icon name="angle-double-right" color="#ff8834" style={{ marginTop: 15 }} size={30} ></Icon>

                        </View>
                        <View style={
                            {
                                flex: 5
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
                        <View style={{ flex: 1 }}>

                        </View>

                    </View>


                    :
                    null
                }

                {this.state.Travel ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "62%" }}>

                        <Text style={{ marginLeft: 20 }}> Pago con tarjeta</Text>


                    </View>
                    :
                    null
                }

                {this.state.Travel ?
                    <View style={{ flexDirection: "row", position: "absolute", top: "67%" }}>

                        <View style={{ flex: 1 }}>

                            <Image
                                style={{ width: 50, height: 50 }}
                                source={require("./../assets/user.png")}
                            ></Image>

                        </View>

                        <View style={{ flex: 2 }}>

                            <Text>{keys.datos_usuario.nombreUsuario}</Text>

                        </View>

                        <View style={{ flex: 1 }}>

                            <Icon name="times"
                                color="red"
                                size={25}
                                onPress={() => this.setState({
                                    showModalCancel: true
                                })}
                            ></Icon>
                        </View>

                        <View style={{ flex: 1 }}>

                            <Icon name="comment-dots"
                                size={25}
                                color="#ff8834"
                                onPress={() => this.Chat()}
                            ></Icon>

                        </View>

                        <View style={{ flex: 1 }}>

                            <Icon name="phone" onPress={() => this.callPhoneFunction()}
                                size={25}
                                color="#ff8834"
                                onPress={() => this.callPhoneFunction()}
                            ></Icon>

                        </View>


                    </View>
                    :
                    null
                }

                {this.state.Travel ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "80%" }}>

                        <View style={{ flex: 1.5 }}>

                        </View>
                        <View style={{ flex: 3, alignContent: "center" }}>

                            <View>
                                <Text>1234567890</Text>
                                <Text>soporte@yimi.com</Text>
                            </View>

                        </View>

                        <View style={{ flex: 1.5 }}>

                        </View>

                    </View>
                    :
                    null
                }

                {this.state.Travel ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "92%" }}>

                        <View style={{ flex: 1 }}>

                            <Icon name="angle-double-right" color="#ff8834" style={{ marginTop: 15 }} size={30} ></Icon>

                        </View>
                        <View style={
                            {
                                flex: 5
                            }
                        }>

                            <Button
                                title="Terminar viaje"
                                type="clear"
                                onPress={() => {
                                    this.terminarViaje()
                                }}

                            />

                        </View>
                        <View style={{ flex: 1 }}>

                        </View>

                    </View>

                    :
                    null
                }




            </View>

          
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
