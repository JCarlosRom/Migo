// Importación de librerías 
import React, { Component } from "react";
import { View, Text, StyleSheet, Switch, ScrollView, Image } from "react-native";
import Modal from "react-native-modal";
import { Button  } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { StackActions, NavigationActions } from 'react-navigation';
import MapViewDirections from 'react-native-maps-directions';
import { showLocation } from 'react-native-map-link'
import getDirections from 'react-native-google-maps-directions';
import keys from './global';
import * as Location from "expo-location";
import * as Permissions from 'expo-permissions';
import call from 'react-native-phone-call'
// Clase principal de Componente de Travel MP 
export default class TravelMP extends Component {
    /**
     *Creates an instance of TravelMP.
     * Constructor de de la clase TRAVELMP
     * @param {*} props
     * @memberof TravelMP
     */
    constructor(props) {

        // Socket para asignar los ids de socket en caso de cambio
        keys.socket.on('getIdSocket', (num) => {

            // Asignación de nuevo socket
            keys.id_chofer_socket = num.id;

            // Socket de emisión de Id de Chofer a usuario
            keys.socket.emit("WSsendIdChoferUsuario", {
                id_socket_usuario: keys.id_usuario_socket, idSocketChofer: keys.id_chofer_socket
            })

        })
        // Socket para escuchar el cambio de id de usuario
        keys.socket.on('sendIdUsuarioChofer', (num) => {
            // Asignación de id del usuario, en variable global 
            keys.id_usuario_socket = num.id_socket_usuario;
        })
        // Socket para recibir ids de recorrido y servicio, en caso de inserción 
        keys.socket.on('recorrido_id_conductor', num => {
            console.log('Llego respuesta: ', num);

            keys.id_servicio = num.servicio;
            keys.id_recorrido = num.recorrdio;

            console.log("idServicio", keys.id_servicio);
            console.log("idRecorrido", keys.id_recorrido);
         

        });

        // Socket receptor, verificador de chófer On Line 
        keys.socket.on('isConnected', () => { })

        super(props);
        // Estados de componente
         this.state = {
            // Estados de navegación
            puntoEncuentro:false,
            HomeTravel:true,
            aceptViaje:false,
            initravel:false,
            Travel: false,
            showMapDirections:false,
            // Posición del usuario 
             positionUser: {
                 latitude: 0,
                 longitude: 0,

             },
            // Coordenadas fijas para consulta de direcciones, google directions
            latitude: 19.273247,
            longitude: -103.715795,
            myPosition:null,
            distance:0,
            duration:0,
            // Estados de las rutas de cada destino del viaje 
            routeInitial: true,
            routeParada1: false,
            routeParada2: false,
            routeParada3: false,
            location:null,
            // Coordenadas de la región inicial del mapa
             region: {
                 latitude: 0,
                 longitude: 0,
                 longitudeDelta: 0,
                 latitudeDelta: 0

             },
            timerAceptViaje: 15,
            intervaltimerAceptViaje: null,
            showModal:false,
            Descripcion:"",
            infoVehicleLlegada:0,
             // Cronometers
             minutosUsuario: 2,
             segundosUsuario: 0,
             timeUsuario: "",
             finTimerUsuario: false,
             // TimerTravel
             minutosTravelUsuario: 0,
             segundosTravelUsuario: 0,
             timeTravelUsuario: "",
             FinTimeTravelUsuario: false
        
    

        };

        // Socket para escuchar nueva solicitud de usuario a conductor y guardado de información 
        keys.socket.on('changeDestinoChofer', num => {

            clearInterval(keys.intervalBroadcastCoordinates);
         
            // Asignación de datos del nuevo viaje en variables globales de Chofer
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

                // Limpiar intervalos de coordenadas de usuario 

                clearInterval(this.state.timer);
                clearInterval(keys.timerCoordenadas);

                keys.socket.emit('chofer_accept_requestChange', {
                    id_usuario_socket: keys.id_usuario_socket,
                    id_chofer_socket: keys.id_chofer_socket,
                    datos_vehiculo: keys.datos_vehiculo, datos_chofer: keys.datos_chofer,
                    positionChofer: this.state.myPosition,


                });
                // Sección de navegación por tipo de viaje
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
                // Fin de sección

            }

        });
        // Detiene el socket de chat 
        keys.socket.removeAllListeners("chat_chofer");

  
        // Socket para recibir nuevo mensaje de chat
        keys.socket.on('chat_chofer', (num) => {

            keys.Chat.push(num.Mensaje);


        })
        // Socket para detectar la cancelación del servicio por parte del usuario
        keys.socket.on('cancelViajeChofer', () => {

            keys.Chat=[];

            clearInterval(keys.intervalBroadcastCoordinates);

            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home', params: { Flag: "CancelarServicio" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);

        })

      
        
    };
    /**
     * Función para llamar al teléfono del usuario
     *
     * @memberof TravelMP
     */
    callPhoneFunction() {
        const args = {
            number: keys.datos_usuario.numeroTelefono, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
        }

        call(args).catch(console.error)
    }
    /** Función para llamar al teléfono de soporte
     *
     *
     * @memberof TravelMP
     */
    callPhoneSoporte() {
        const args = {
            number: keys.numeroSoporte, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
        }

        call(args).catch(console.error)
    }

    /**
    *Ciclo de vida para despúes de que se monta el componente
    *
    * @memberof TravelMP
    */
    componentDidMount(){

        // Bloque para accionar funciones como Aceptación del viaje o cambio de destino 
        Flag = this.props.navigation.getParam('Flag', false);
        console.log(Flag)

        if (Flag == "Acept") {
            let intervaltimerAceptViaje = setInterval(() => {

                this.setState({ intervaltimerAceptViaje });

                // console.log("timerAceptViajeMP",this.state.timerAceptViaje);

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
        // Fin del bloque 
    }


    /**
    *
    *Ciclo de vida para antes de que se monte el componente
    * @memberof TravelMP
    */
    async componentWillMount() {

        this.subs = [
            this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
        ]; 


        // Bloque para pedir permisos de GPS
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permisos denegados por el usuario'
            });
        }
        // Fin del bloque 

        // Bloque para la asignación de mi posición, paradas, y del usuario 

        let location = await Location.getCurrentPositionAsync({});

        this.setState({ location });

        if (this.state.location != null) {

            this.setState({
                myPosition: {

                    latitude: this.state.location.coords.latitude,
                    longitude: this.state.location.coords.longitude

                },
                region: {
                    latitude: this.state.location.coords.latitude,
                    longitude: this.state.location.coords.longitude,
                    longitudeDelta: 0.040,
                    latitudeDelta: 0.040

                },
            })



        }

        try {
           

            let primeraParada = await Location.geocodeAsync(keys.travelInfo.puntoPartida.addressInput);
           
            this.setState({
                positionUser: {
                    latitude: primeraParada[0]["latitude"],
                    longitude: primeraParada[0]["longitude"]
                }
            })


        


        } catch (e) {
            console.log(e);
            this.setState({
                showModal: true,
                Descripcion: "Servicio no disponible, Intente más tarde"
            })
        }

        


        Paradas =[];


        Paradas.push(keys.travelInfo.Parada1)

        this.setState({
            Paradas
        })
        // Fin del bloque
        
    }

    componentDidFocus() {
        console.log("focus")
        // Socket de notificación de mensaje nuevo 
        keys.socket.on("LlegoMensaje", (num) => {
            this.setState({
                showModal: true,
                Descripcion: "Te llegó un mensaje",
            })

        })
    }
    
    /**
     * Función para aceptar el viaje
     *
     * @memberof TravelMP
    */
    aceptViaje() {

     

        // Generar la hora límite para generar la cancelación del servicio 
        var d = new Date(); // get current date
        d.setHours(d.getHours(), d.getMinutes() + this.state.duration, 0, 0);
        keys.HoraServicio = d.toLocaleTimeString()

        console.log("Hora", keys.HoraServicio);

        var d = new Date(); // get current date
        d.setHours(d.getHours(), d.getMinutes() + this.state.duration, 0, 0);


        clearInterval(this.state.intervaltimerAceptViaje);

        // Socket para emitir la aceptación del viaje 
        keys.socket.emit('chofer_accept_request', {
            id_usuario_socket: keys.id_usuario_socket,
            id_chofer_socket: keys.id_chofer_socket,
            datos_vehiculo: keys.datos_vehiculo, datos_chofer: keys.datos_chofer,
            positionChofer: this.state.myPosition
        });

        // Socket para generar el servicio 
        keys.socket.emit('generar_servicio', {
            id_conductor_socket: keys.id_chofer_socket,
            id_usuario_socket: keys.id_usuario_socket,
            distancia_destino_usuario: keys.travelInfo.Distancia,
            tiempo_viaje_destino: keys.travelInfo.Tiempo,
            latitud_usuario: (this.state.positionUser.latitude == 0) ? 0 : this.state.positionUser.latitude,
            longitud_usuario: (this.state.positionUser.longitude == 0) ? 0 : this.state.positionUser.longitude,
            latitud_usuario_destino: keys.travelInfo.Parada1.latitude,
            longitud_usuario_destino: keys.travelInfo.Parada1.longitude,
            geocoder_origen: keys.travelInfo.puntoPartida.addressInput,
            geocoder_destino: keys.travelInfo.Parada3.Direccion,
            id_usuario: keys.datos_usuario.id_usuario,
            id_unidad: keys.datos_vehiculo.id_unidad,
            id_conductor: keys.datos_vehiculo.id_chofer
        })
        // Inicio de transmisión de coordenadas al usuario 
        this.fleet_chofer_usuario();
        // Cambio de estado de componente a viaje aceptado 
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
                        coordenadas_chofer: { latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude }
                    });

            }

        }, 5000);
        keys.intervalBroadcastCoordinates = intervalBroadcastCoordinates;

    }

    chofer_setPosition(){
        let timer_chofer = setInterval(() => {
            this.findCurrentLocationAsync();
            if (this.state.location != null) {

                this.setState({
                    myPosition:{
        
                        latitude: this.state.location.coords.latitude,
                        longitude: this.state.location.coords.longitude 
                        
                    }
                })
         
                   
            }

        }, 5000);

        this.setState({ timer_chofer });
    }
    /**
    * Función para enviar la posición del chofer al usuario (Con socket)
    *
    * Retorno de coordenadas de chófer, transmisión
    */
    findCurrentLocationAsync = async () => {
        // Envio de coordenadas de chofer hacia usuario emite al socket 'seguimiento_chofer' de usuario
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permisos denegados por el usuario'
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
    };

    /**
    * Función para empezar el viaje por google maps y Waze
    *
    * @memberof TravelMP
    */
    Go = () => {
        // Bloque de asignación de coordenadas de la posición del usuario y las paradas
        coordinates = {
            latitude: 0,
            longitude: 0
        }

        if (this.state.aceptViaje == true) {

            coordinates = {
                latitude: this.state.positionUser.latitude,
                longitude: this.state.positionUser.longitude
            }

        }

        if (this.state.Travel == true && this.state.routeParada2 == false) {
            coordinates = {
                latitude: keys.travelInfo.Parada1.latitude,
                longitude: keys.travelInfo.Parada1.longitude,
            }
        }

        if (this.state.routeParada2 == true) {
            coordinates = {
                latitude: keys.travelInfo.Parada2.latitude,
                longitude: keys.travelInfo.Parada2.longitude,
            }
        }


        if (this.state.routeParada3 == true) {
            coordinates = {
                latitude: keys.travelInfo.Parada3.latitude,
                longitude: keys.travelInfo.Parada3.longitude,
            }
        }
        // Fin del bloque 

        // Asignación de coordenadas para usar el viaje con google maps 
        if (keys.travelType == true){

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
    /**
    *Barra de navegación de TravelMP
    *
    * @static
    * @memberof TravelMP
    */
    static navigationOptions = {
        title: "Viaje",
        headerLeft: null
    };


    /**
     * Función para iniciar en el punto de encuentro
     *
     * @memberof TravelMP
     */
    puntoEncuentro(){
        // Asignación de estado de componentes iniciar el viaje 
        this.setState({
            HomeTravel: false,
            aceptViaje: false,
            initravel:true,
            routeInitial: false,
            routeParada1: true
      

        })

     

        // Socket de punto de encuentro, socket puntoEncuentroUsuario
        keys.socket.emit("puntoEncuentro", {
            id_socket_usuario: keys.id_usuario_socket
        });
        // Interval para el cronometro de 2 minutos de manera regresiva 
        let intervalEsperaUsuario = setInterval(() => {
            if (this.state.segundosUsuario == 0) {
                this.setState({
                    segundosUsuario: 59,
                    minutosUsuario: this.state.minutosUsuario - 1

                })
            } else {
                this.setState({
                    segundosUsuario: this.state.segundosUsuario - 1
                })
            }

            if (this.state.segundosUsuario < 10) {

                this.setState({
                    timeUsuario: this.state.minutosUsuario + ":0" + this.state.segundosUsuario
                })
            } else {
                this.setState({
                    timeUsuario: this.state.minutosUsuario + ":" + this.state.segundosUsuario
                })
            }
            if (this.state.minutosUsuario == 0 && this.state.segundosUsuario == 0) {
                keys.socket.emit("EsperaUsuarioTerminoChofer", { id_socket_usuario: keys.id_usuario_socket });
                clearInterval(intervalEsperaUsuario)
                this.setState({
                    finTimerUsuario: true
                })
            }
            console.log("timeUsuario", this.state.timeUsuario)
        }, 1000)

        keys.intervalEsperaUsuario = intervalEsperaUsuario;


    }


    /**
     *Función para terminar el viaje
    *
    * @memberof TravelMP
    */
    terminarViaje(){
        // Limpiar intervals de cronometro del viaje y de la transmisión de coordenadas 
        clearInterval(keys.intervalTimeTravel)
        clearInterval(keys.intervalBroadcastCoordinates);

        keys.Chat =[]

        this.props.navigation.navigate("Pago");

   

    }
    /**
     * Función para cancelar el viaje
     *
     * @memberof TravelMP
     */
    cancelViaje() {

        // Limpiar chat 
        keys.Chat=[]
        // Limpíar el intervalo de transmisión de coordenas
        clearInterval(keys.intervalBroadcastCoordinates);
        // Socket para hacer la transacción de la cancelación del viaje 
        keys.socket.emit("cancelaConductor", { id: keys.id_servicio })
        // Emisión de la cancelación al usuario 
        keys.socket.emit("cancelViajeChofer", {
            id_socket_usuario: keys.id_usuario_socket
        });
        // Cambio de pantalla a Home 
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home', params: { Flag: "CancelarServicioChofer" } })],
            key: undefined
        });

        this.props.navigation.dispatch(resetAction);

      
    }
    /**
    * Función para actualizar la región del mapa
    *
    * @param {*} region
    */
    onRegionChange = async region => {


        this.setState({
            region
        });


    } 

    /**
     * Función para la primera parada
     *
     * @memberof TravelMP
     */
    primeraParada(){
        // Asignar estados de primera parada, reiniciar timer de viaje 
        this.setState({
            routeInitial: false,
            routeParada1: true,
            routeParada2: false,
            routeParada2: false,
            FinTimeTravelUsuario:false,
            segundosTravelUsuario:0, 
            minutosTravelUsuario:0
        })
        clearInterval(keys.intervalTimeTravel);
        // Iniciar intervalo de cronometro, de tiempo de viaje 
        let intervalTimeTravel = setInterval(() => {
            if (this.state.segundosTravelUsuario == 59) {
                this.setState({
                    segundosTravelUsuario: 0,
                    minutosTravelUsuario: this.state.minutosTravelUsuario + 1

                })
            } else {
                this.setState({
                    segundosTravelUsuario: this.state.segundosTravelUsuario + 1
                })
            }

            if (this.state.segundosTravelUsuario < 10) {

                this.setState({
                    timeTravelUsuario: this.state.minutosTravelUsuario + ":0" + this.state.segundosTravelUsuario
                })
            } else {
                this.setState({
                    timeTravelUsuario: this.state.minutosTravelUsuario + ":" + this.state.segundosTravelUsuario
                })
            }

            if (this.state.minutosTravelUsuario == this.state.duration) {
                this.setState({
                    FinTimeTravelUsuario: true
                })
            }

            console.log("timeTravelUsuario", this.state.timeTravelUsuario)
        }, 1000)

        keys.intervalTimeTravel = intervalTimeTravel;


    }

    /**
     * Función para la segunda parada
     *
     * @memberof TravelMP
     */
    segundaParada(){
        // Asignar estados de segunda parada, reiniciar timer de viaje 
        clearInterval(keys.intervalTimeTravel);
        Paradas = [];
        Paradas.push(keys.travelInfo.Parada2)

        this.setState({
            Paradas
        })

        this.setState({
            routeInitial: false,
            routeParada1: false,
            routeParada2: true,
            routeParada3: false,
            FinTimeTravelUsuario: false,
            segundosTravelUsuario: 0,
            minutosTravelUsuario: 0
        })

        // Socket de segunda parada
        keys.socket.emit("segundaParada", {
            id_socket_usuario: keys.id_usuario_socket
        });
        // Iniciar intervalo de cronometro, de tiempo de viaje 
        let intervalTimeTravel = setInterval(() => {
            if (this.state.segundosTravelUsuario == 59) {
                this.setState({
                    segundosTravelUsuario: 0,
                    minutosTravelUsuario: this.state.minutosTravelUsuario + 1

                })
            } else {
                this.setState({
                    segundosTravelUsuario: this.state.segundosTravelUsuario + 1
                })
            }

            if (this.state.segundosTravelUsuario < 10) {

                this.setState({
                    timeTravelUsuario: this.state.minutosTravelUsuario + ":0" + this.state.segundosTravelUsuario
                })
            } else {
                this.setState({
                    timeTravelUsuario: this.state.minutosTravelUsuario + ":" + this.state.segundosTravelUsuario
                })
            }

            if (this.state.minutosTravelUsuario == this.state.duration) {
                this.setState({
                    FinTimeTravelUsuario: true
                })
            }

            console.log("timeTravelUsuario", this.state.timeTravelUsuario)
        }, 1000)

        keys.intervalTimeTravel = intervalTimeTravel;
    }

    /**
     * Función de la tercera parada
     *
     * @memberof TravelMP
     */
    terceraParada(){
        // asignar los estados de la tercera parada
        clearInterval(keys.intervalTimeTravel);

        this.setState({
            FinTimeTravelUsuario: false,
            segundosTravelUsuario: 0,
            minutosTravelUsuario: 0
        })
        Paradas = [];


        Paradas.push(keys.travelInfo.Parada3)

        this.setState({
            Paradas
        })

        this.state.routeParada2 = false;
        this.state.routeParada3 = true;


        // Socket de tercera parada
        keys.socket.emit("terceraParada", {
            id_socket_usuario: keys.id_usuario_socket
        });
         // Iniciar intervalo de cronometro, de tiempo de viaje 
        let intervalTimeTravel = setInterval(() => {
            if (this.state.segundosTravelUsuario == 59) {
                this.setState({
                    segundosTravelUsuario: 0,
                    minutosTravelUsuario: this.state.minutosTravelUsuario + 1

                })
            } else {
                this.setState({
                    segundosTravelUsuario: this.state.segundosTravelUsuario + 1
                })
            }

            if (this.state.segundosTravelUsuario < 10) {

                this.setState({
                    timeTravelUsuario: this.state.minutosTravelUsuario + ":0" + this.state.segundosTravelUsuario
                })
            } else {
                this.setState({
                    timeTravelUsuario: this.state.minutosTravelUsuario + ":" + this.state.segundosTravelUsuario
                })
            }

            if (this.state.minutosTravelUsuario == this.state.duration) {
                this.setState({
                    FinTimeTravelUsuario: true
                })
            }

            console.log("timeTravelUsuario", this.state.timeTravelUsuario)
        }, 1000)

        keys.intervalTimeTravel = intervalTimeTravel;

    }
    /**
    * Función para el Chat
    *
    * @memberof TravelMP
    */
    Chat() {

        keys.socket.removeAllListeners("chat_chofer");
        this.props.navigation.navigate("Chat")
    }
    /**
    * Función para iniciar el viaje
    *
    * @memberof TravelMP
    */
    async iniciarViaje() {
        // Limpiar el intervalo de la espera de usuario 
        clearInterval(keys.intervalEsperaUsuario)


        this.setState({
            HomeTravel: false,
            aceptViaje: false,
            initravel: false,
            Travel: true,


        })

        // Socket para notificar al usuario el inicio del viaje 
        keys.socket.emit("aceptViaje", {
            id_socket_usuario: keys.id_usuario_socket
        })
        // Intervalo para generar el cronometro del tiempo de viaje 
        let intervalTimeTravel = setInterval(() => {
            if (this.state.segundosTravelUsuario == 59) {
                this.setState({
                    segundosTravelUsuario: 0,
                    minutosTravelUsuario: this.state.minutosTravelUsuario + 1

                })
            } else {
                this.setState({
                    segundosTravelUsuario: this.state.segundosTravelUsuario + 1
                })
            }

            if (this.state.segundosTravelUsuario < 10) {

                this.setState({
                    timeTravelUsuario: this.state.minutosTravelUsuario + ":0" + this.state.segundosTravelUsuario
                })
            } else {
                this.setState({
                    timeTravelUsuario: this.state.minutosTravelUsuario + ":" + this.state.segundosTravelUsuario
                })
            }

            if (this.state.minutosTravelUsuario == this.state.duration) {
                this.setState({
                    FinTimeTravelUsuario: true
                })
            }

            console.log("timeTravelUsuario", this.state.timeTravelUsuario)
        }, 1000)

        keys.intervalTimeTravel = intervalTimeTravel;



    }

 
  
    /**
     * Render principal del componente
     *
     * @returns
     * @memberof TravelMP
     */
    render() {
        return (

            <View style={{ flex: 1 }}>
                {/* Modal genérico de mensajes*/}
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

                {/* Modal de cancelación  */}
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
                {/* Mapa */}
                {this.state.region.latitude != 0 && this.state.region.longitude != 0 && this.state.region.latitudeDelta != 0 && this.state.region.longitudeDelta != 0 && this.state.positionUser != null ?

                    <MapView

                        style={{ top: "-10%", height: "110%" }}
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

                        {/* Mi posición */}
                        <Marker
                            coordinate={{
                                latitude: this.state.myPosition.latitude,
                                longitude: this.state.myPosition.longitude,
                            }}

                        >
                            <Icon name="car" size={20} color="orange"></Icon>
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

                        {
                            this.state.Paradas != null ?

                                this.state.Paradas.map(marker => (

                                    <Marker
                                        key={marker.numParada ? marker.numParada : "key"}
                                        coordinate={{
                                            latitude: marker.latitude,
                                            longitude: marker.longitude
                                        }}

                                    >
                                        <Icon name="map-pin" size={20} color="orange"></Icon>

                                    </Marker>
                                ))
                                :

                                null


                        }


                        {/* Primer Parada */}
                        {this.state.routeInitial && this.state.myPosition.latitude != 0 && this.state.positionUser.longitude != 0
                            && this.state.positionUser.latitude != 0 && this.state.positionUser.longitude != 0 ?

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

                            :
                            null
                        }
                        {/* Ruta de mi posición a la parada 1 */}
                        {this.state.routeParada1 && this.state.myPosition.latitude != 0 && this.state.myPosition.longitude != 0
                            && keys.travelInfo.Parada1.latitude != 0 && keys.travelInfo.Parada1.longitude != 0 ?

                            <MapViewDirections
                                origin={{
                                    latitude: this.state.myPosition.latitude,
                                    longitude: this.state.myPosition.longitude,
                                }}
                                destination={{
                                    latitude: keys.travelInfo.Parada1.latitude,
                                    longitude: keys.travelInfo.Parada1.longitude,
                                }}
                                apikey={keys.GOOGLE_MAPS_APIKEY}
                                strokeWidth={1}
                                strokeColor="orange"
                                onReady={result => {
                                    this.setState({
                                        distance: parseInt(result.distance),
                                        duration: parseInt(result.duration)

                                    })



                                }}

                            />
                            :
                            null
                        }
                        {/* Ruta de mi posición a parada 2 */}
                        {
                            this.state.routeParada2 && this.state.myPosition.latitude != 0 && this.state.myPosition.longitude != 0
                                && keys.travelInfo.Parada2.latitude != 0 && keys.travelInfo.Parada2.longitude != 0 ?

                                <MapViewDirections
                                    origin={{
                                        latitude: this.state.myPosition.latitude,
                                        longitude: this.state.myPosition.longitude,
                                    }}
                                    destination={{
                                        latitude: keys.travelInfo.Parada2.latitude,
                                        longitude: keys.travelInfo.Parada2.longitude,
                                    }}
                                    apikey={keys.GOOGLE_MAPS_APIKEY}
                                    strokeWidth={1}
                                    strokeColor="red"
                                    onReady={result => {
                                        this.setState({
                                            distance: parseInt(result.distance),
                                            duration: parseInt(result.duration)

                                        })



                                    }}

                                />
                                :
                                null
                        }
                        {/* Ruta de mi posición a la parada 3 */}
                        {
                            this.state.routeParada3 == true && this.state.myPosition.latitude != 0 && this.state.myPosition.longitude != 0
                                && keys.travelInfo.Parada3.latitude != 0 && keys.travelInfo.Parada3.longitude != 0 ?


                                <MapViewDirections
                                    origin={{
                                        latitude: this.state.myPosition.latitude,
                                        longitude: this.state.myPosition.longitude,
                                    }}
                                    destination={{
                                        latitude: keys.travelInfo.Parada3.latitude,
                                        longitude: keys.travelInfo.Parada3.longitude,
                                    }}
                                    apikey={keys.GOOGLE_MAPS_APIKEY}
                                    strokeWidth={1}
                                    strokeColor="green"
                                    onReady={result => {
                                        this.setState({
                                            distance: parseInt(result.distance),
                                            duration: parseInt(result.duration)

                                        })



                                    }}

                                />

                                :
                                null
                        }


                    </MapView>

                    :

                    null

                }

                {/* Barra superior del componente  */}
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
                                source={{ uri: keys.datos_usuario.imgChofer }}
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
                {/* Componente de muestra de punto de partida */}
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

                {/* Nombre de los destinos, tiempo y distancia, funcón de viaje en waze o Google Maps */}
                {this.state.aceptViaje || this.state.Travel ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "12%" }}>

                        <Icon name="chevron-right" color="green" size={15}></Icon>

                        <View style={{ width: 280 }}>
                            <Text style={{ marginLeft: 10 }}> {(this.state.routeInitial == true) ? keys.travelInfo.puntoPartida.addressInput : (this.state.routeParada1 == true) ? keys.travelInfo.Parada1.Direccion : (this.state.routeParada2 == true) ? keys.travelInfo.Parada2.Direccion : (this.state.routeParada3 == true) ? keys.travelInfo.Parada3.Direccion : "Test"}</Text>
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
                {/* Foto de perfil y Nombre del usuario, cancelación, chat y llamada  */}
                {this.state.aceptViaje ?
                    <View style={{ flexDirection: "row", position: "absolute", top: "70%" }}>

                        <View style={{ flex: 1 }}>

                            <Image
                                style={{ width: 50, height: 50 }}
                                source={{ uri: keys.datos_usuario.imgChofer }}
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

                            <Icon name="phone" 
                                size={25}
                                color="#ff8834"
                                onPress={() => this.callPhoneFunction()}
                            ></Icon>

                        </View>


                    </View>

                    :
                    null
                }
                {/* Llamada a soporte */}
                {this.state.aceptViaje ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "80%", left: "3%" }}>


                        <View style={{ flex: 1 }}>

                            <Icon name="phone"
                                onPress={() => this.callPhoneSoporte()}
                                size={30}
                                color="#ff8834"

                            ></Icon>

                        </View>
                        <View style={{ flex: 3 }}>
                            <Text >Soporte YiMi</Text>
                        </View>
                    </View>

                    :
                    null

                }
                {/* Botón de punto de encuentro  */}
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
                    this.state.finTimerUsuario ?
                        <View style={{ flexDirection: "row", position: "absolute", top: "62%" }}>

                            <Text style={{ marginLeft: 5 }}> El usuario está retrasado pongase en contacto para confirmar el horario</Text>


                        </View>
                        :
                        <View style={{ flexDirection: "row", position: "absolute", top: "62%" }}>

                            <Text style={{ marginLeft: 5 }}> Por favor espera al usuario: {this.state.timeUsuario} minutos</Text>


                        </View>
                    :
                    null

                }
                {/* Foto de perfil y Nombre del usuario, cancelación, chat y llamada  */}
                {this.state.initravel ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "73%" }}>

                        <View style={{ flex: 1 }}>

                            <Image
                                style={{ width: 50, height: 50 }}
                                source={{ uri: keys.datos_usuario.imgChofer }}
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
                {/* Llamada a soporte */}
                {this.state.initravel ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "83%", left: "3%" }}>

                        <View style={{ flex: 1 }}>

                            <Icon name="phone"
                                onPress={() => this.callPhoneSoporte()}
                                size={30}
                                color="#ff8834"

                            ></Icon>

                        </View>
                        <View style={{ flex: 3 }}>
                            <Text >Soporte YiMi</Text>
                        </View>

                    </View>

                    :
                    null
                }
                {/* Botón para iniciar el viaje */}
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
                                onPress={() => this.iniciarViaje()
                                }

                            />

                        </View>
                        <View style={{ flex: 1 }}>

                        </View>

                    </View>


                    :
                    null
                }
                {/* Tipo de pago y tiempo de viaje  */}
                {this.state.Travel ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "62%" }}>


                        <View style={{ flex: 5 }}>

                            <Text> Pago con tarjeta</Text>

                        </View>


                        <View style={{ flex: 1 }}>

                            <Text style={{ color: (this.state.FinTimeTravelUsuario == false) ? "green" : "red" }}>{this.state.timeTravelUsuario}</Text>
                        </View>


                    </View>
                    :
                    null
                }
                {/* Foto de perfil y Nombre del usuario, cancelación, chat y llamada  */}
                {this.state.Travel ?
                    <View style={{ flexDirection: "row", position: "absolute", top: "67%" }}>

                        <View style={{ flex: 1 }}>

                            <Image
                                style={{ width: 50, height: 50 }}
                                source={{ uri: keys.datos_usuario.imgChofer }}
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
                {/* Llamada a soporte */}
                {this.state.Travel ?

                    <View style={{ flexDirection: "row", position: "absolute", top: "80%", left: "3%" }}>


                        <View style={{ flex: 1 }}>

                            <Icon name="phone"
                                onPress={() => this.callPhoneSoporte()}
                                size={30}
                                color="#ff8834"

                            ></Icon>

                        </View>
                        <View style={{ flex: 3 }}>
                            <Text >Soporte YiMi</Text>
                        </View>

                    </View>
                    :
                    null
                }
                {/* Botón de finalización del viaje  */}
                {this.state.Travel && this.state.routeInitial ?

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
                                title="Ir a primera parada"
                                type="clear"
                                onPress={() => this.primeraParada()}

                            />

                        </View>
                        <View style={{ flex: 1 }}>

                        </View>

                    </View>

                    :
                    null
                }
                {/* Botón de segunda parada */}
                {this.state.Travel && this.state.routeParada1?

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

                                title="Ir a segunda parada"
                                type="clear"
                                onPress={() => this.segundaParada()}

                            />

                        </View>
                        <View style={{ flex: 1 }}>

                        </View>

                    </View>
           
            
            
                :
                    null
                }
                {/* Botón de tercera parada */}
                {this.state.Travel && this.state.routeParada2 ?


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
                                title={"Ir a tercera parada"}
                                type="clear"
                                onPress={() =>

                                    this.terceraParada()

                                }

                            />

                        </View>
                        <View style={{ flex: 1 }}>

                        </View>

                    </View>

               

                    :
                    null
                }
                {/* Botón para terminar viaje */}
                {this.state.Travel && this.state.routeParada3 ?


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


// Estilos de TravelMP
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
