import React, { Component } from "react";
import { View, Text, StyleSheet, Switch, ScrollView, Image, FlatList, TouchableHighlight } from "react-native";
import Modal from "react-native-modal";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { showLocation } from 'react-native-map-link'
import * as Location from "expo-location";
import { StackActions, NavigationEvents, NavigationActions } from 'react-navigation';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions';
import * as Permissions from 'expo-permissions';
import axios from 'axios';
import call from 'react-native-phone-call'

export default class Travel_Integrado extends Component {
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
            mapDirectionPartidaDestino:false,
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
            timer_2:null,
            timerAceptViaje: 15,
            intervaltimerAceptViaje: null,
            infoVehicleLlegada: null,
            durationVehicule:0, 
            DistanceVehicle: null,
            destination: null,
            predictions: [],
            showListdestination: false,
            showModalCancel:false,
            showModal:false,
            Descripcion:""
            
        };

        // Socket para escuchar nueva solicitud de usuario a conductor y guardado de información 
        keys.socket.on('changeDestinoChofer', num => {

            clearInterval(keys.intervalBroadcastCoordinates);
            // this.state.datos_solicitud = num;

            console.log("Datos Solicitud", num);

            if (num != null) {

                keys.datos_usuario = {
                    id_usuario: num.datos_usuario.id_usuario,
                    nombreUsuario: num.datos_usuario.nombreUsuario,
                    CURP: num.datos_usuario.CURP,
                    numeroTelefono: num.datos_usuario.numeroTelefono,
                    correoElectronico: num.datos_usuario.correoElectronico
                }

                keys.type = num.type;

                if (keys.type != "SinDestino") {


                    keys.travelInfo = {
                        puntoPartida: num.infoTravel.puntoPartida,
                        Parada1: num.Paradas[0],
                        Parada2: num.Paradas[1],
                        Parada3: num.Paradas[2],
                        Distancia: num.Distancia,
                        Tiempo: num.Tiempo,

                        // Distancia: num.Distancia, 
                        // Tiempo: num.Tiempo
                    }

                } else {
                    keys.travelInfo = {
                        puntoPartida: num.infoTravel.puntoPartida,
                    }
                }


                keys.positionUser = {
                    latitude: num.usuario_latitud,
                    longitude: num.usuario_longitud
                }

                keys.id_usuario_socket = num.id_usuario_socket

                keys.id_chofer_socket = keys.socket.id;

                keys.Tarifa = num.Tarifa;

            


                // console.log("Socket del chofer", keys.id_chofer_socket)



                clearInterval(this.state.timer);
                clearInterval(keys.timerCoordenadas);

                keys.socket.emit('chofer_accept_requestChange', {
                    id_usuario_socket: keys.id_usuario_socket,
                    id_chofer_socket: keys.id_chofer_socket,
                    datos_vehiculo: keys.datos_vehiculo, datos_chofer: keys.datos_chofer,
                    positionChofer: this.state.myPosition,
                    // tiempoLlegada: d.toLocaleTimeString(

                });

                if (keys.type == "Unico") {

                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Travel_Integrado', params: { Flag: "changeDestino" } })],
                        key: undefined
                    });

                    this.props.navigation.dispatch(resetAction);

           

                } else {

                    if (keys.type == "Multiple") {

                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'TravelMP', params: { Flag: "changeDestino" } })],
                            key: undefined
                        });

                        this.props.navigation.dispatch(resetAction);

               

                    } else {

                        if (keys.type == "Multiple 2 paradas") {

                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'TravelMP2', params: { Flag: "changeDestino" } })],
                                key: undefined
                            });

                            this.props.navigation.dispatch(resetAction);
          
                        } else {

                            
                            if (keys.type == "SinDestino") {

                                const resetAction = StackActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({ routeName: 'TravelNoDestination', params: { Flag: "changeDestino" } })],
                                    key: undefined
                                });

                                this.props.navigation.dispatch(resetAction);

                            }
                        }

                    }


                }

            }

        });

        keys.socket.on('recorrido_id_conductor', num => {
            console.log('Llego respuesta: ', num);

            keys.id_servicio = num.servicio; 
            keys.id_recorrido = num.recorrdio; 

            console.log("idServicio",keys.id_servicio);
            console.log("idRecorrido", keys.id_recorrido);
            // this.state.id_recorrido = num;
            // this.setState({

            // });
            // alert('EL conductor acepto tu solicitud, espera a tu chofer ');
            // Desactivar animación 

        });

        keys.socket.removeAllListeners("chat_chofer");

        
        keys.socket.on('chat_chofer', (num) => {


            keys.Chat.push(num.Mensaje);

            this.setState({
                showModal:true,
                Descripcion:"Te llegó un mensaje"
            })

          

        })

        keys.socket.on('cancelViajeChofer', () => {

            console.log("cancelViajeChofer");
            
            clearInterval(keys.intervalBroadcastCoordinates);

            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home', params: { Flag: "CancelarServicio" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);

         })
      
    }

    callPhoneFunction(){
        const args = {
            number: keys.datos_usuario.numeroTelefono , // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
        }

        call(args).catch(console.error)
    }

    async getTarifas() {
        try {
            console.log(this.state.distance);
            console.log(this.state.duration);
            //console.log(this.props.switchValue);
            const res = await axios.post('http://35.203.42.33:3003/webservice/interfaz164/UsuarioCalculoPrecios', {
                distancia_km: this.state.distance,
                tiempo_min: this.state.duration
            });

            res.data.datos.forEach(element => {

                if (keys.datos_vehiculo.categoriaVehiculo == 1) {

                    keys.Tarifa = element["out_costo_viaje"];

                 
                }
                if (keys.datos_vehiculo.categoriaVehiculo == 2) {

                    keys.Tarifa = element["out_costo_viaje"];

                }

                if (keys.datos_vehiculo.categoriaVehiculo == 3) {

                    keys.Tarifa = element["out_costo_viaje"];
                }

                if (keys.datos_vehiculo.categoriaVehiculo == 4) {

                    keys.Tarifa = element["out_costo_viaje"];
                }
            });
        } catch (e) {
            console.log(e);

            this.setState({
                showModal: true,
                Descripcion: "Servicio no disponible, Intente más tarde"
            })

         
        }
    }
    // Función para aceptar el viaje
    aceptViaje(){

        var d = new Date(); // get current date
        d.setHours(d.getHours(), d.getMinutes() + this.state.durationVehicule, 0, 0);
        keys.HoraServicio = d.toLocaleTimeString()

        console.log("Hora", keys.HoraServicio);
        

        clearInterval(this.state.intervaltimerAceptViaje);
        
        keys.socket.emit('chofer_accept_request', {
            id_usuario_socket: keys.id_usuario_socket,
            id_chofer_socket: keys.id_chofer_socket,
            datos_vehiculo: keys.datos_vehiculo, datos_chofer: keys.datos_chofer,
            positionChofer: this.state.myPosition,
            // tiempoLlegada: d.toLocaleTimeString(

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

        keys.socket.emit('generar_servicio',{
            id_conductor_socket: keys.id_chofer_socket,
            id_usuario_socket: keys.id_usuario_socket,
            distancia_destino_usuario: keys.travelInfo.Distancia,
            tiempo_viaje_destino: keys.travelInfo.Tiempo,
            latitud_usuario: keys.positionUser.usuario_latitud,
            longitud_usuario: keys.positionUser.usuario_longitud,
            latitud_usuario_destino: this.state.parada1.latitude,
            longitud_usuario_destino: this.state.parada1.longitude,
            geocoder_origen: keys.travelInfo.puntoPartida.addressInput,
            geocoder_destino: keys.travelInfo.Parada1.Direccion,
            id_usuario: keys.datos_usuario.id_usuario,
            id_unidad: keys.datos_vehiculo.id_unidad,
            id_conductor: keys.datos_vehiculo.id_chofer
        })

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
                        coordenadas_chofer: {latitude:this.state.location.coords.latitude, longitude:this.state.location.coords.longitude}
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


   

    async componentDidMount(){

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

      
        // Bloque para asignar markers y trazos de rutas

        Flag = this.props.navigation.getParam('Flag', false);
        console.log(Flag)
        
        if (Flag =="Acept"){
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

        if (Flag == "Acept") {
            this.setState({
                showModal: true,
                Descripcion: "Te ha llegado una solicitud"
            })
        } else {
            if (Flag == "changeDestino") {
                this.aceptViaje();
            }
        }

    }

    

    async componentWillMount() {


       
            let usuarioPosition = await Location.geocodeAsync(keys.travelInfo.puntoPartida.addressInput);
   
    
            this.setState({
                positionUser:{
                    latitude: usuarioPosition[0]["latitude"],
                    longitude: usuarioPosition[0]["longitude"]
                }
            })



            this.setState({
                parada1:{
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

    Go = () => {
        
        coordinates ={
            latitude:0,
            longitude:0
        }

        if (this.state.aceptViaje == true) {
                coordinates={
                    latitude: this.state.positionUser.latitude,
                    longitude: this.state.positionUser.longitude,
                }

                console.log(coordinates);
               
        }else{
            if (this.state.Travel == true) {

                coordinates = {
                    latitude: this.state.parada1.latitude,
                    longitude: this.state.parada1.longitude,
                }


                console.log("punto de encuentro",coordinates);
              
            }
        }
        // Google maps 
    
        if (keys.travelType==true){

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

        }else{
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
            mapDirectionVehiclePartida:false,
            mapDirectionPartidaDestino:true
       
        })
    

        // Socket de punto de encuentro, socket puntoEncuentroUsuario
        keys.socket.emit("puntoEncuentro",{
            id_socket_usuario: keys.id_usuario_socket
        });

        
        
    }



    Chat(){

        keys.socket.removeAllListeners("chat_chofer");
        this.props.navigation.navigate("Chat")
    }
    // Función para iniciar el viaje 
    async iniciarViaje(){


        this.setState({
            HomeTravel: false,
            aceptViaje: false,
            initravel: false,
            Travel: true,
            
            
        })


        
    }
    // Función para terminar el viaje 
    terminarViaje(){
        clearInterval(keys.intervalBroadcastCoordinates);
        this.props.navigation.navigate("viajeFinalizado");

        keys.socket.emit("terminarViajeChofer", { id_usuario_socket:keys.id_usuario_socket})

        keys.Chat=[];
    }
    // Función para cancelar el viaje
    cancelViaje(){

        var d = new Date(); // get current date
        d.setHours(d.getHours(), d.getMinutes(), 0, 0);
        horaActual = d.toLocaleTimeString()

        console.log("Hora Actual", horaActual);
        console.log("Hora Servicio", keys.HoraServicio);

        if(horaActual<keys.HoraServicio){

            clearInterval(keys.intervalBroadcastCoordinates);
    
            keys.Chat=[];

            keys.socket.emit("cancelaConductor", { id: keys.id_servicio})
    
            keys.socket.emit("cancelViajeChofer",{
                id_socket_usuario: keys.id_usuario_socket
            });
    
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home', params: { Flag: "CancelarServicioChofer" } })],
                key: undefined
            });
    
            this.props.navigation.dispatch(resetAction);
        }else{
            this.setState({
                showModalCancel:false,
                showModal:true,
                Descripcion:"No se puede cancelar servicio después de 3 minutos de iniciar el servicio"
            })
        }

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
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.container}>

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
                                <View style={{flex:1}}>
                                    <View style={{ alignSelf: "center" }}>

                                        <Icon name="check-circle" color={this.state.clienteNoPresento ? "green" : "#ff8834"} size={20} onPress={() => this.setState({
                                            clienteNoPresento: true,
                                            clienteNoCancelacion: false,
                                            direccionIncorrecta : false, 
                                            noCobrarCliente: false, 
                                            Otro: false
                                        })}></Icon>

                                    </View>
                                </View>
                                <View style={{flex:5}}>
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
                                    <View style={{alignSelf:"center"}}>
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
                                    <View style={{alignSelf:"center"}}>

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
                                <View style={{flex:2}}></View>

                                <View style={{ flex: 2, marginBottom:5, paddingRight:5 }}>
                                    <Button 
                                        title="No Cancelar"
                                        buttonStyle={{
                                            backgroundColor:"#ff8834"
                                        }}
                                        titleStyle={{  fontSize:12 }}
                                        onPress={()=>this.setState({
                                            showModalCancel:false
                                        })}

                                    ></Button>
                             
                                </View>
                                <View style={{ flex: 2, marginBottom: 5, marginRight:5 }}>

                                    <Button
                                        title="Cancelar"
                                        buttonStyle={{
                                            backgroundColor: "#ff8834"
                                        }}
                                        titleStyle={{ fontSize: 12 }}
                                        onPress={()=>this.cancelViaje()}
                                
                                    ></Button>
                                  
                                </View>
                            </View>


                        </Modal>

                    </View>

                    <View style={styles.area}>
                        <View style={{flex:1}}>
                            <Switch
                                value={keys.stateConductor}
                        
                            />
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text style={{ width: 100 }} >{keys.stateConductor ? "Conectado" : "Desconectado"}</Text>
                        </View>
                        <View style={{flex:1}}></View>

                        <View style={
                            {
                                flex:1,
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
                                flex:1,
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

                            <View style={styles.area}>
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
                                    <Image
                                        style={{ width: 50, height: 50 }}
                                        source={require("./../assets/user.png")}
                                    ></Image>
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
                                    <Text style={{ marginLeft: 10 }}>{this.state.aceptViaje? keys.travelInfo.puntoPartida.addressInput : keys.travelInfo.Parada1.Direccion}</Text>
                                    <Text style={{ marginLeft: 10 }}>{this.state.duration} min ({this.state.distance} km)</Text>
                                </View>
                                <View>
                                    <Icon name="chevron-up" size={30} color="#ff8834" onPress={this.Go}></Icon>
                                    <Text style={{ paddingLeft: 4 }}>Go</Text>
                                </View>
                            </View>
                          
                        </View>
                        :
                        null
                    }



                </View>

                {this.state.region.latitude != 0 && this.state.region.longitude != 0 && this.state.region.latitudeDelta != 0 && this.state.region.longitudeDelta != 0 && this.state.myPosition.latitude != 0 && this.state.myPosition.longitude != 0 ?

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
                            {this.state.positionUser.latitude!=0 && this.state.positionUser.longitude ?
                            
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

                            {this.state.mapDirectionVehiclePartida
                            && this.state.myPosition.latitude !=0
                            && this.state.myPosition.longitude !=0
                            && this.state.positionUser.latitude !=0
                            && this.state.positionUser.longitude != 0 
                            ?
                            
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
                                                duration: parseInt(result.duration), 
                                                durationVehicule: parseInt(result.duration)
                                            })


                                        }



                                    }}

                                />
                        
                            :
                                null
                            
                            }

                            {this.state.mapDirectionPartidaDestino && this.state.myPosition.latitude !=0
                            && this.state.myPosition.longitude && this.state.parada1.latitude 
                            && this.state.parada1.longitude ?

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
                :
                    null

                }
                {/* Barra inferior de punto de encuentro */}
                {this.state.aceptViaje ?
                    <View>

                        <View style={styles.area}>

                            <Text style={{ marginLeft: 5 }}> Contacta al usuario si llegas después de las {this.state.infoVehicleLlegada}</Text>

                        </View>
                        <View style={styles.area}>

                            <View style={{flex:1}}>

                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require("./../assets/user.png")}
                                ></Image>

                            </View>

                            <View style={{flex:2}}>

                                <Text>{keys.datos_usuario.nombreUsuario}</Text>

                            </View>

                            <View style={{flex:1}}>

                                <Icon name="times"
                                    color="red"
                                    size={25}
                                    onPress={()=>this.setState({
                                        showModalCancel:true
                                    })}
                                ></Icon>
                            </View>

                            <View style={{flex:1}}>

                                <Icon name="comment-dots"
                                    size={25}
                                    color="#ff8834"
                                    onPress={() => this.Chat()}
                                ></Icon>
                           
                            </View>

                            <View style={{flex:1}}>

                                <Icon name = "phone" onPress={()=>this.callPhoneFunction()}
                                    size={25}
                                    color="#ff8834"
                                    onPress={()=>this.callPhoneFunction()}
                                ></Icon>

                            </View>


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

                            <Icon name="angle-double-right" color="#ff8834" size={20} style={{ paddingLeft: 10 }}></Icon>
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

                        <Icon name="angle-double-right" color="#ff8834" size={30} style={{ paddingLeft: 10 }}></Icon>
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

                        <View style={styles.area}>

                            <View style={{ paddingLeft: 120 }}>
                                <Text style={{ paddingLeft: 20 }}>{keys.datos_usuario.numeroTelefono}</Text>
                                <Text>{keys.datos_usuario.correoElectronico}</Text>
                            </View>

                        </View>
                        <View>

                        </View>
                        <View style={styles.area}>

                            <Icon color="#ff8834" color="#ff8834" name="angle-double-right" size={20} style={{ paddingLeft: 10, paddingTop: 10 }}></Icon>
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

                        <View style={styles.area}>

                            <View style={{ paddingLeft: 120 }}>
                                <Text style={{ paddingLeft: 20 }}>1234567890</Text>
                                <Text>soporte@yimi.com</Text>
                            </View>

                        </View>
                        <View>

                        </View>
                        <View style={styles.area}>

                            <Icon name="angle-double-right" color="#ff8834" size={20} style={{ paddingLeft: 10, paddingTop: 25 }}></Icon>
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
