import React, { Component } from "react";
import { getDistance } from "geolib";
import { View, Text, StyleSheet, Image, BackHandler } from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, {Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { ScrollView } from "react-native-gesture-handler";
import MapViewDirections from 'react-native-maps-directions';
import * as Location from "expo-location";
import { StackActions, NavigationActions } from 'react-navigation';
import axios from 'axios';
import keys from "./global";
import * as Permissions from 'expo-permissions';
import call from 'react-native-phone-call'

const GOOGLE_MAPS_APIKEY = 'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY';
export default class TravelNoDestination extends Component {
   

    constructor(props) {

        // Socket para asignar los ids de socket en caso de cambio
        keys.socket.on('getIdSocket', (num) => {

            keys.id_usuario_socket = num.id;

            //console.log("Usuario", keys.id_usuario_socket);

            // Envio de id nuevo a chofer
            keys.socket.emit("WSsendIdUsuarioChofer", {
                id_usuario_socket: keys.id_usuario_socket, idSocketChofer: keys.id_chofer_socket
            })


        })

        keys.socket.on("tarifaCancelacionInicioViaje", num => {

            keys.Tarifa.tarifa_cancelacion = num.tarifaCancelacion;

            console.log(keys.Tarifa.tarifa_cancelacion);


            keys.socket.emit("cancelaUsuario", { id: keys.id_servicio, isCobro: true, idUsuario: keys.datos_usuario.id_usuario, tarifa_cancelacion: keys.Tarifa.tarifa_cancelacion })

            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicio" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);
        })

        // Socket para recibir el id nuevo del chofer
        keys.socket.on("sendIdChoferUsuario", (num) => {
            keys.id_chofer_socket = num.id_socket_chofer;
            //console.log("Recibí id de chofer", keys.id_chofer_socket)
        })

        super(props);

        this.state = {

            myPosition: {
                latitude: 0,
                longitude: 0,

            },
            region: {
                latitude: 0,
                longitude: 0,
                longitudeDelta: 0,
                latitudeDelta: 0

            },

            showBackButton: true,
            Home: true,
            showEstimations: false,
            helperPay: false,
            Pay: false,
            Onway: false,
            showOnway:false,
            showModalCancel: false,
            showModalLlegada:false,
            showModalAcept:false, 
            showModal: false,
            Descripcion:"",
            DescripcionAcept:"",
            showTimeChofer: false,
            location: null,
            timeChofer:0,
            distance: 0,
            duration: 0,

            Express_Estandar: {
                categoria_servicio: 0,
                nombre_categoria: "Express Estandar",
                out_costo_viaje: 0,
                tarifaBase: 0,
                tarifaMinima: 0,
                porKilometro: 0,
                porMinuto: 0,
                Gob: 0,
                Solicitud: 0,
                tarifa_cancelacion: 0
            },
            Express_Lujo: {
                categoria_servicio: 0,
                nombre_categoria: "Express Lujo",
                out_costo_viaje: 0,
                tarifaBase: 0,
                tarifaMinima: 0,
                porKilometro: 0,
                porMinuto: 0,
                Gob: 0,
                Solicitud: 0,
                tarifa_cancelacion: 0
            },
            Pool_Estandar: {
                categoria_servicio: 0,
                nombre_categoria: "Pool Estandar",
                out_costo_viaje: 0,
                tarifaBase: 0,
                tarifaMinima: 0,
                porKilometro: 0,
                porMinuto: 0,
                Gob: 0,
                Solicitud: 0,
                tarifa_cancelacion: 0
            },
            Pool_Lujo: {
                categoria_servicio: 0,
                nombre_categoria: "Pool Lujo",
                out_costo_viaje: 0,
                tarifaBase: 0,
                tarifaMinima: 0,
                porKilometro: 0,
                porMinuto: 0,
                Gob: 0,
                Solicitud: 0,
                tarifa_cancelacion: 0
            },
      
            isNextVehicles: true,
            routeParada1: false,
            routeChoferDestino: false,
            cashPay: true,
            creditPay: false,
            infoVehicleTipo: "",
            infoVehicleLlegada: "",
            timer_coordenadasUsuario: null,
            Vehicles: null,
            showVehicles: true,
            initViajeUsuario: false,
            tiempoExcedidoUsuario: false,
            distanciaViajeCancelacion: 0,
            duracionViajeCancelacion: 0,
            // Timers espera usuario 
            minutosUsuario: 0,
            segundosUsuario: 0,
            timeUsuario: null

        };

        if (keys.categoriaVehiculo == null || keys.tipoVehiculo == null) {

            this.getVehiclesInit(1, 1);

        } else {

            this.getVehiclesInit(keys.categoriaVehiculo, keys.tipoVehiculo);

        }
        // Socket para escuchar el socket de vehículo
        keys.socket.on('vehiclesGet', (num) => {

            this.setState({
                Vehicles: num
            })

            // //console.log("Vehiculos Travel 1",this.state.Vehicles, "-----");


        })
        keys.socket.removeAllListeners("chat_usuario");

 
        // Chat del chofer
        keys.socket.on('chat_usuario', (num) => {

            keys.Chat.push(num.Mensaje);


        })

        // Aqui se acepta el recorrido
        keys.socket.on('recorrido_id_usuario', num => {
            //console.log('Llego respuesta: ', num);
            // this.state.id_recorrido = num;
            // this.setState({

            // });
            keys.id_servicio = num.servicio;
            keys.id_recorrido = num.recorrdio;

            //console.log("idServicio", keys.id_servicio);
            //console.log("idRecorrido", keys.id_recorrido);



        });

        keys.socket.on("setPrimeraParada1Usuario", (num) => {

            this.setPrimeraParada1Usuario(num);

        })

        keys.socket.on("puntoEncuentroUsuario",()=>{
            this.setState({
                showModalLlegada:true,
                showTimeChofer: false,
                showOnway:false
            })
        } )

        keys.socket.on("cancelViajeUsuario", num => {

            clearInterval(keys.intervalEsperaUsuario)

            BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton)

            keys.Chat = [];

            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicioUsuario" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);
        })
   
        // Recepción de la información del chofer cuando se acepta la solicitud
        keys.socket.on('conductor_sendInfo', num => {

            BackHandler.addEventListener("hardwareBackPress", this.handleBackButton)

            //console.log('conductor_sendInfo');

            var d = new Date(); // get current date
            d.setHours(d.getHours(), d.getMinutes() + 3, 0, 0);
            keys.HoraServicio = d.toLocaleTimeString()

            clearInterval(this.timer_Vehicles);

            clearInterval(this.timer_VehiclesConsult);


            this.setState({
                showBackButton: false,
                showModalAcept: true,
                DescripcionAcept: "El chofer ha aceptado tu solicitud",
                showVehicles: false
            })

            keys.datos_chofer={
                idChofer: num.datos_chofer.idChofer,
                nombreChofer: num.datos_chofer.nombreChofer,
                Estrellas: num.datos_chofer.Estrellas,
                Reconocimientos: num.datos_chofer.Reconocimientos,
                Telefono: num.datos_chofer.Telefono,
                imgChofer: num.datos_chofer.imgChofer
            }

            keys.datos_vehiculo={
                id_unidad: num.datos_vehiculo.id_unidad ,
                modelo: num.datos_vehiculo.modelo,
                Matricula: num.datos_vehiculo.Matricula,
                tipoVehiculo: num.datos_vehiculo.tipoVehiculo,
                categoriaVehiculo: num.datos_vehiculo.categoriaVehiculo,
                imgVehiculo: num.datos_vehiculo.imgVehiculo
            }

            this.setState({
                positionChofer:{
                    latitude:num.chofer_latitud,
                    longitude: num.chofer_longitud
                }
            })

            keys.id_chofer_socket = num.id_chofer_socket;

    

            this.setState({
                Onway: true,
                ConductorMapDirection:true,
                showEstimations: false,
                Home: false,
                showTimeChofer: true,
                showOnway:true
            })

      
          
        });

        // Socket para hacer el tracking del chofer
        keys.socket.on('seguimiento_chofer', num => {

            // //console.log(num.coordenadas_chofer);
   
            this.setState({
                positionChofer:{
                    latitude: num.coordenadas_chofer.latitude, 
                    longitude: num.coordenadas_chofer.longitude
                }
            })

 
        
        });
    

        // Socket para hacer el tracking del chofer
        keys.socket.on('ConductorDisponible', num => {
            this.setState({
                showModal: true,
                Descripcion: num.Msg,
            })
      
        });

        keys.socket.on('aceptViajeUsuario', num => {
            this.setState({
                initViajeUsuario: true
            })

            console.log("Inicio viaje ");

        })

        keys.socket.on('EsperaUsuarioTerminoUsuario', num => {
            this.setState({
                tiempoExcedidoUsuario: true
            })

            // Interval para el cronometro de 2 minutos de manera regresiva 
            let intervalEsperaUsuario = setInterval(() => {
                if (this.state.segundosUsuario == 59) {
                    this.setState({
                        segundosUsuario: 0,
                        minutosUsuario: this.state.minutosUsuario + 1

                    })
                } else {
                    this.setState({
                        segundosUsuario: this.state.segundosUsuario + 1
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

                // console.log("timeUsuario", this.state.timeUsuario)
            }, 1000)

            keys.intervalEsperaUsuario = intervalEsperaUsuario;
        })

        keys.socket.on('terminarViajeUsuario', (num) => {

            clearInterval(keys.intervalEsperaUsuario)

            BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton)

            keys.Chat = []
            keys.Tarifa.Total = num.Tarifa;
            //console.log('terminarViajeUsuario', keys.Tarifa.Total);
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "terminarViaje" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);

        })


        keys.socket.on('statusChofer', num => {

            this.setState({
                showModal: true,
                Descripcion: num.Msg,
            })

         

            setTimeout(() => {
                if (num.Msg == "Solicitud rechazada por conductor, buscando otro conductor"){
                    usuario_latitud = this.state.myPosition.latitude;
                    usuario_longitud = this.state.myPosition.longitude;
                    datos_usuario = keys.datos_usuario;
                    infoTravel = keys.travelInfo;
                    type = keys.type;
                    keys.id_usuario_socket = keys.socket.id;
    
                    keys.socket.emit('usuario_solicitud', {
                        usuario_latitud: usuario_latitud, usuario_longitud: usuario_longitud,
                        datos_usuario: datos_usuario, infoTravel: infoTravel, Paradas: keys.Paradas, type: type,
                        id_usuario_socket: keys.id_usuario_socket, tipoVehiculo: keys.tipoVehiculo
    
                    });
                }

                
            }, 2000);
        });
    }

    async getVehiclesInit(categoriaVehiculo, tipoVehiculo) {



        clearInterval(this.timer_Vehicles);

        clearInterval(this.timer_VehiclesConsult);

        keys.socket.emit('vehiclesConsult', {
            categoriaVehiculo: categoriaVehiculo, tipoVehiculo: tipoVehiculo, id_usuario_socket: keys.id_usuario_socket
        });

        this.timer_VehiclesConsult = setInterval(() => {

            keys.socket.emit('vehiclesConsult', {
                categoriaVehiculo: categoriaVehiculo, tipoVehiculo: tipoVehiculo, id_usuario_socket: keys.id_usuario_socket
            });


        }, 10000);

        keys.categoriaVehiculo = categoriaVehiculo;

        keys.tipoVehiculo = tipoVehiculo;


        //console.log("Categoria vehiculo get");
        //console.log(keys.categoriaVehiculo);
        //console.log("Tipo Vehiculo Get");
        //console.log(keys.tipoVehiculo);

    }

    async getVehicles(tipoVehiculo, tipoServicio) {

        clearInterval(this.timer_Vehicles);

        clearInterval(this.timer_VehiclesConsult);

        keys.socket.emit('vehiclesConsultTravel', {
            tipoVehiculo: tipoVehiculo, tipoServicio: tipoServicio, id_usuario_socket: keys.id_usuario_socket
        });

        this.timer_VehiclesConsult = setInterval(() => {

            keys.socket.emit('vehiclesConsultTravel', {
                tipoVehiculo: tipoVehiculo, tipoServicio: tipoServicio, id_usuario_socket: keys.id_usuario_socket
            });


        }, 10000);

        keys.tipoVehiculo = tipoVehiculo;

        keys.tipoServicio = tipoServicio;


        //console.log("Categoria vehiculo get");
        //console.log(keys.categoriaVehiculo);
        //console.log("Tipo de vehiculo");
        //console.log(keys.tipoVehiculo);
        //console.log("Tipo Servicio Get");
        //console.log(keys.tipoServicio);
    }
    callPhoneFunction() {
        const args = {
            number: keys.datos_chofer.Telefono, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
        }

        call(args).catch(console.error)
    }

    async setPrimeraParada1Usuario(num) {

        // //console.log("num", num);

        // //console.log("setPrimeraParada1Usuario",num.Parada.Direccion);

        if (num.Flag =="PrimeraParada"){
    
            let Parada1 = await Location.geocodeAsync(num.Info.Direccion);
    
            //console.log("Parada 1", Parada1);
    
            Paradas = [];
    
            Parada1Info = {
                latitude: Parada1[0]["latitude"], longitude: Parada1[0]["longitude"], Direccion: keys.travelInfo.Parada1
            }
    
            Paradas.push(Parada1Info)
    
            this.setState({
    
                Paradas
    
            })
    
            keys.Paradas = this.state.Paradas;
    
            this.setState({
                routeParada1: false,
                ConductorMapDirection:false,
                routeChoferDestino: true,
      
            })

        }else{
            if (num.Flag=="Tarifa"){
                keys.Tarifa.Total= num.Info;
                keys.Chat = [];


                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "terminarViaje" } })],
                    key: undefined
                });

                this.props.navigation.dispatch(resetAction);
            }
        }

    }


    
  

    showPay(){
        if(this.state.showEstimations==true){

            this.setState({
                helperPay: true,
                showEstimations: false,
                Home: false,
                Pay: true
            })


        }else{

            this.setState({
                helperPay: false,
                showEstimations: false,
                Home: false,
                Pay: true
            })
            
        }
    }

    closePay(){
        if(this.state.helperPay==true){
            this.setState({
                Pay:false, 
                showEstimations:true,
                Home:false
            })
        }else{
            this.setState({
                Pay: false,
                showEstimations: false,
                Home: true
            })
        }
    }

    async getTarifas(){
        try {
            //console.log("Distancia",this.state.distance);
            //console.log("Duración",this.state.duration);
            //console.log("Categoria",keys.categoriaVehiculo)
            ////console.log(this.props.switchValue);
            const res = await axios.post('http://35.203.57.92:3003/webservice/interfaz164/UsuarioCalculoPrecios', {
                distancia_km: this.state.distance,
                tiempo_min: this.state.duration
            });
    
            res.data.datos.forEach(element => {

                if (keys.tipoVehiculo == 1 && keys.tipoServicio == 1) {

                    if (element["categoria_servicio"] == 1) {

                        this.setState({
                            infoVehicleTarifa: {
                                categoria_servicio: element["categoria_servicio"],
                                nombre_categoria: element["nombre_categoria"],
                                Tarifa: parseInt(element["out_costo_viaje"]),
                                tarifaBase: parseInt(element["tarifa_base"]),
                                tarifaMinima: parseInt(element["tarifa_minima"]),
                                porKilometro: parseInt(element["distancia"]),
                                porMinuto: parseInt(element["tiempo"]),
                                Gob: element["cuota_gob"],
                                Solicitud: element["cuota_solicitud"],
                                tarifa_cancelacion: element["tarifa_cancelacion"]


                            },
                        })
                    }
                } else {
                    if (keys.tipoVehiculo == 2 && keys.tipoServicio == 1) {
                        if (element["categoria_servicio"] == 2) {

                            this.setState({
                                infoVehicleTarifa: {
                                    categoria_servicio: element["categoria_servicio"],
                                    nombre_categoria: element["nombre_categoria"],
                                    Tarifa: parseInt(element["out_costo_viaje"]),
                                    tarifaBase: parseInt(element["tarifa_base"]),
                                    tarifaMinima: parseInt(element["tarifa_minima"]),
                                    porKilometro: parseInt(element["distancia"]),
                                    porMinuto: parseInt(element["tiempo"]),
                                    Gob: element["cuota_gob"],
                                    Solicitud: element["cuota_solicitud"],
                                    tarifa_cancelacion: element["tarifa_cancelacion"]


                                },
                            })
                        }
                    } else {
                        if (keys.tipoVehiculo == 1 && keys.tipoServicio == 2) {
                            if (element["categoria_servicio"] == 3) {

                                this.setState({
                                    infoVehicleTarifa: {
                                        categoria_servicio: element["categoria_servicio"],
                                        nombre_categoria: element["nombre_categoria"],
                                        Tarifa: parseInt(element["out_costo_viaje"]),
                                        tarifaBase: parseInt(element["tarifa_base"]),
                                        tarifaMinima: parseInt(element["tarifa_minima"]),
                                        porKilometro: parseInt(element["distancia"]),
                                        porMinuto: parseInt(element["tiempo"]),
                                        Gob: element["cuota_gob"],
                                        Solicitud: element["cuota_solicitud"],
                                        tarifa_cancelacion: element["tarifa_cancelacion"]


                                    },
                                })
                            }
                        } else {
                            if (keys.tipoVehiculo == 2 && keys.tipoServicio == 2) {
                                if (element["categoria_servicio"] == 4) {

                                    this.setState({
                                        infoVehicleTarifa: {
                                            categoria_servicio: element["categoria_servicio"],
                                            nombre_categoria: element["nombre_categoria"],
                                            Tarifa: parseInt(element["out_costo_viaje"]),
                                            tarifaBase: parseInt(element["tarifa_base"]),
                                            tarifaMinima: parseInt(element["tarifa_minima"]),
                                            porKilometro: parseInt(element["distancia"]),
                                            porMinuto: parseInt(element["tiempo"]),
                                            Gob: element["cuota_gob"],
                                            Solicitud: element["cuota_solicitud"],
                                            tarifa_cancelacion: element["tarifa_cancelacion"]


                                        },
                                    })
                                }
                            }
                        }
                    }
                }


            });

            
        } catch (e) {
            //console.log(e);
            this.setState({
                showModal: true,
                Descripcion: "Servicio no disponible, Intente más tarde",
            })
         
        }
    }

    generarSolicitud = () => {

    

        usuario_latitud = this.state.myPosition.latitude;
        usuario_longitud = this.state.myPosition.longitude;
        datos_usuario = keys.datos_usuario;
        infoTravel= keys.travelInfo;
        type= keys.type;
        keys.id_usuario_socket= keys.socket.id;
        Tarifa = keys.Tarifa.Total;
        Distancia= this.state.distance,
        Tiempo= this.state.duration
        
 

        keys.socket.emit('usuario_solicitud', {
            usuario_latitud: usuario_latitud, usuario_longitud: usuario_longitud, 
            datos_usuario: datos_usuario, infoTravel: infoTravel, Paradas: keys.Paradas, type: type, 
            id_usuario_socket: keys.id_usuario_socket, categoriaVehiculo:keys.categoriaVehiculo, 
            tipoVehiculo: keys.tipoVehiculo, tipoServicio: keys.tipoServicio, Tarifa: Tarifa,
            Distancia:Distancia, Tiempo:Tiempo, 
       
        });
    }
    
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
    



    async componentWillMount() {

        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton)

        this.subs = [
            this.props.navigation.addListener('didFocus', (payload) => this.componentDidFocus(payload)),
        ]; 

        let primeraParada = await Location.geocodeAsync(keys.travelInfo.puntoPartida.addressInput);
       
        console.log("keys.travelInfo",keys.travelInfo.puntoPartida.addressInput);

        console.log("primeraParada",primeraParada);

        this.setState({
            myPosition: {

                latitude: primeraParada[0]["latitude"],
                longitude: primeraParada[0]["longitude"]

            },
            region: {
                latitude: primeraParada[0]["latitude"],
                longitude: primeraParada[0]["longitude"],
                longitudeDelta: 0.060,
                latitudeDelta: 0.060

            },

        });

        //console.log(this.state.region);

      
        // let Parada1 = await Location.geocodeAsync(keys.travelInfo.Parada1);

        // Paradas = []

        // Parada1Info = {
        //     latitude: Parada1[0]["latitude"], longitude: Parada1[0]["longitude"], Direccion: keys.travelInfo.Parada1
        // }

        // Paradas.push(Parada1Info)

        // this.setState({

        //     Paradas

        // })

    

        // keys.Paradas= this.state.Paradas;

    }

    componentDidFocus() {
        //console.log("focus")
        // Socket de notificación de mensaje nuevo 
        keys.socket.on("LlegoMensaje", (num) => {
            this.setState({
                showModal: true,
                Descripcion: "Te llegó un mensaje",
            })

        })

        if (this.state.Onway == true) {

            BackHandler.addEventListener("hardwareBackPress", this.handleBackButton)
        }
    }


    static navigationOptions = {
        title: "Viaje",
        headerLeft: null

    };




    setModalAceptCancel(visible) {

        this.setState({ ModalAceptCancel: visible });
        
        this.setState({ ModalCancel: !visible });

    }
    
    showInfoVehicle(typeVehicle) {

        var d = new Date(); // get current date
        d.setHours(d.getHours(), d.getMinutes() + this.state.duration, 0, 0);


        if (typeVehicle == "Express Estandar") {
            this.setState({
                infoVehicleTipo: "Express Estandar",
                infoVehicleLlegada: d.toLocaleTimeString(),


            })
            //console.log(this.state.Express_Estandar)
            //console.log("------")
            //console.log(this.state.infoVehicleTarifa)

            this.setState({
                infoVehicleTarifa: {
                    Tarifa: this.state.Express_Estandar.out_costo_viaje,
                    tarifaBase: this.state.Express_Estandar.tarifaBase,
                    tarifaMinima: this.state.Express_Estandar.tarifaMinima,
                    porKilometro: this.state.Express_Estandar.porKilometro,
                    porMinuto: this.state.Express_Estandar.porMinuto,
                    Gob: this.state.Express_Estandar.Gob,
                    Solicitud: this.state.Express_Estandar.Solicitud,
                    tarifa_cancelacion: this.state.Express_Estandar.tarifa_cancelacion
                },
            })
            // Estandar
            keys.tipoVehiculo = 1;
            // Express
            keys.tipoServicio = 1;

            this.getVehicles(keys.tipoVehiculo, keys.tipoServicio)


        } else {
            if (typeVehicle == "Express Lujo") {
                this.setState({
                    infoVehicleTipo: "Express Lujo",
                    infoVehicleLlegada: d.toLocaleTimeString(),
                    infoVehicleTarifa: {
                        Tarifa: this.state.Express_Lujo.out_costo_viaje,
                        tarifaBase: this.state.Express_Lujo.tarifaBase,
                        tarifaMinima: this.state.Express_Lujo.tarifaMinima,
                        porKilometro: this.state.Express_Lujo.porKilometro,
                        porMinuto: this.state.Express_Lujo.porMinuto,
                        Gob: this.state.Express_Lujo.Gob,
                        Solicitud: this.state.Express_Lujo.Solicitud,
                        tarifa_cancelacion: this.state.Express_Lujo.tarifa_cancelacion
                    }

                })



                // Lujo
                keys.tipoVehiculo = 2;
                // Express
                keys.tipoServicio = 1;

                this.getVehicles(keys.tipoVehiculo, keys.tipoServicio)
            } else {
                if (typeVehicle == "Pool Estandar") {
                    this.setState({
                        infoVehicleTipo: "Pool Estandar",
                        infoVehicleLlegada: d.toLocaleTimeString(),
                        infoVehicleTarifa: {
                            Tarifa: this.state.Pool_Estandar.out_costo_viaje,
                            tarifaBase: this.state.Pool_Estandar.tarifaBase,
                            tarifaMinima: this.state.Pool_Estandar.tarifaMinima,
                            porKilometro: this.state.Pool_Estandar.porKilometro,
                            porMinuto: this.state.Pool_Estandar.porMinuto,
                            Gob: this.state.Pool_Estandar.Gob,
                            Solicitud: this.state.Pool_Estandar.Solicitud,
                            tarifa_cancelacion: this.state.Pool_Estandar.tarifa_cancelacion
                        }

                    })

                    // Estandar
                    keys.tipoVehiculo = 1;
                    // Pool
                    keys.tipoServicio = 2;

                    this.getVehicles(keys.tipoVehiculo, keys.tipoServicio)

                } else {
                    if (typeVehicle == "Pool Lujo") {
                        this.setState({
                            infoVehicleTipo: "Pool Lujo",
                            infoVehicleLlegada: d.toLocaleTimeString(),
                            infoVehicleTarifa: {
                                Tarifa: this.state.Pool_Lujo.out_costo_viaje,
                                tarifaBase: this.state.Pool_Lujo.tarifaBase,
                                tarifaMinima: this.state.Pool_Lujo.tarifaMinima,
                                porKilometro: this.state.Pool_Lujo.porKilometro,
                                porMinuto: this.state.Pool_Lujo.porMinuto,
                                Gob: this.state.Pool_Lujo.Gob,
                                Solicitud: this.state.Pool_Lujo.Solicitud,
                                tarifa_cancelacion: this.state.Pool_Lujo.tarifa_cancelacion
                            }

                        })

                        // Lujo
                        keys.tipoVehiculo = 2;
                        // Pool
                        keys.tipoServicio = 2;

                        this.getVehicles(keys.tipoVehiculo, keys.tipoServicio)
                    }
                }
            }
        }




        this.setState({
            showEstimations: true,
            Home: false
        })
    }


    Chat() {

        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton)
        keys.socket.removeAllListeners("chat_usuario");
        this.props.navigation.navigate("Chat")
    }

    onRegionChange = async region => {
        latitude = region.latitude;
        longitude = region.longitude;
        latitudeDelta = region.latitudeDelta;
        longitudeDelta = region.longitudeDelta;

        this.setState({
            region
        });


    } 

    handleBackButton() {
        console.log("BackTravelND");

        return true;
    }

    cancelarServicio() {

        console.log(this.state.initViajeUsuario);


        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton)
        clearInterval(keys.intervalEsperaUsuario)

        var d = new Date(); // get current date
        d.setHours(d.getHours(), d.getMinutes(), 0, 0);
        horaActual = d.toLocaleTimeString()

        console.log("Hora Actual", horaActual);
        console.log("Hora Servicio", keys.HoraServicio);

        keys.Chat = [];

        this.setState({

            showModalCancel: false,

        })
        // Emit para enviar al chofe que se canceló el viaje 
        keys.socket.emit('cancelViajeUsuario', { id_chofer_socket: keys.id_chofer_socket });
        // Antes de tres minutos, sin iniciar el viaje y sin exceder el tiempo de espera: Sin cobro de cancelación
        if (horaActual < keys.HoraServicio && this.state.initViajeUsuario == false && this.state.tiempoExcedidoUsuario == false) {
            // Antes de 3 minutos
            // Emit para la cancelación el viaje 
            console.log("Antes de tres minutos, sin iniciar el viaje y sin excederse el tiempo de espera, Sin cobro de cancelación");

            keys.socket.emit("cancelaUsuario", { id: keys.id_servicio, isCobro: false, idUsuario: keys.datos_usuario.id_usuario, tarifa_cancelacion: keys.Tarifa.tarifa_cancelacion })

            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicioNoCobro" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);

        } else {
            // Después de 3 minutos, sin iniciar el viaje y sin exceder el tiempo: con cobro de cancelación 
            if (horaActual > keys.HoraServicio && this.state.initViajeUsuario == false && this.state.tiempoExcedidoUsuario == false) {
                console.log("Despues de tres minutos, sin iniciar el viaje y sin excederse el tiempo de espera: Con cobro de cancelación");

                keys.Tarifa.tarifa_cancelacion = 10; 

                // Después de 3 minutos
                keys.socket.emit("cancelaUsuario", { id: keys.id_servicio, isCobro: true, idUsuario: keys.datos_usuario.id_usuario, tarifa_cancelacion: keys.Tarifa.tarifa_cancelacion })
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicio" } })],
                    key: undefined
                });

                this.props.navigation.dispatch(resetAction);
            }


        }
        // Viaje iniciado, tiempo de espera excedido: false

        if (this.state.initViajeUsuario == true) {



            if (this.state.tiempoExcedidoUsuario == true) {

                console.log("Viaje iniciado y tiempo excedido de usuario: True");


                var distanciaCancelacion = getDistance(
                    { latitude: this.state.myPosition.latitude, longitude: this.state.myPosition.longitude },
                    { latitude: this.state.positionChofer.latitude, longitude: this.state.positionChofer.longitude }
                );

                this.setState({
                    distanciaViajeCancelacion: distanciaCancelacion
                })

                console.log("DistanciaCancelacion", this.state.distanciaViajeCancelacion)

                keys.socket.emit("cancelarViajeUsuarioInicioViaje", {
                    id_usuario_socket: keys.id_usuario_socket, distancia: this.state.distanciaViajeCancelacion, duracion: this.state.duracionViajeCancelacion, tipo: (keys.tipoVehiculo == 1 && keys.tipoServicio == 1 ? 1 : (keys.tipoVehiculo == 2 && keys.tipoServicio == 1) ? 2 : (keys.tipoVehiculo == 1 && keys.tipoServicio == 2) ? 3 : (keys.tipoVehiculo == 1 && keys.tipoServicio == 2) ? 4 : 1)
                    , istiempoExcedido: true, tiempoExcedido: this.state.minutosUsuario
                })
            } else {
                if (this.state.tiempoExcedidoUsuario == false) {


                    var distanciaCancelacion = getDistance(
                        { latitude: this.state.myPosition.latitude, longitude: this.state.myPosition.longitude },
                        { latitude: this.state.positionChofer.latitude, longitude: this.state.positionChofer.longitude }
                    );

                    this.setState({
                        distanciaViajeCancelacion: distanciaCancelacion
                    })

                    console.log("DistanciaCancelacion", this.state.distanciaViajeCancelacion)

                    console.log("Viaje iniciado y tiempo excedido usuario: false ");

                    keys.socket.emit("cancelarViajeUsuarioInicioViaje", {
                        id_usuario_socket: keys.id_usuario_socket, distancia: this.state.distanciaViajeCancelacion, duracion: this.state.duracionViajeCancelacion, tipo: (keys.tipoVehiculo == 1 && keys.tipoServicio == 1 ? 1 : (keys.tipoVehiculo == 2 && keys.tipoServicio == 1) ? 2 : (keys.tipoVehiculo == 1 && keys.tipoServicio == 2) ? 3 : (keys.tipoVehiculo == 1 && keys.tipoServicio == 2) ? 4 : 1)
                        , istiempoExcedido: false, tiempoExcedido: undefined
                    })
                }
            }


        } else {
            if (this.state.initViajeUsuario == false && this.state.tiempoExcedidoUsuario == true) {

                console.log("Viaje no iniciado y tiempo excedido usuari: true");

                keys.socket.emit("cancelarViajeUsuarioInicioViaje", {
                    id_usuario_socket: keys.id_usuario_socket, distancia: 0, duracion: 0, tipo: (keys.tipoVehiculo == 1 && keys.tipoServicio == 1 ? 1 : (keys.tipoVehiculo == 2 && keys.tipoServicio == 1) ? 2 : (keys.tipoVehiculo == 1 && keys.tipoServicio == 2) ? 3 : (keys.tipoVehiculo == 1 && keys.tipoServicio == 2) ? 4 : 1)
                    , istiempoExcedido: true, tiempoExcedido: this.state.minutosUsuario
                })
            }
        }

    }
 
    render() {
        return (

            <View style={{flex:1}}>
                <View>
                    {/* Modal para mensajes */}
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
                {/* Modal de aceptación del chofer */}
                <View>

                    <Modal
                        isVisible={this.state.showModalAcept}

                    >
                        <View style={{ marginTop: 22, backgroundColor: "#fff" }}>
                            <View>

                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}>{this.state.DescripcionAcept}</Text>

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
                                            showModalAcept: false
                                        })}
                                    ></Button>


                                </View>
                                <View style={{ flex: 2 }}></View>
                            </View>
                        </View>


                    </Modal>

                </View>


                {/* Modal para la cancelación del servicio */}

                <View >

                    <Modal
                        isVisible={this.state.showModalCancel}

                    >
                        <View style={{ marginTop: 22, backgroundColor: "#fff" }}>
                            <View>
                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}>Cancelación de servicio</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10 }}>¿Está seguro de cancelar el servicio de taxi?</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10, textAlign: "justify" }}>Recuerde que si supera 3 minutos después de haber</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10, textAlign: "justify" }}>Solicitado</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 15, marginRight: 10, paddingTop: 5 }}> su servicio, se le cobrará la tarifa de cancelación</Text>
                                <Icon name="clock" size={35} style={{ alignSelf: "center", marginTop: 15 }}></Icon>

                            </View>
                            <View style={{
                                flexDirection: "row",
                                paddingTop: 5,
                                marginBottom: 5

                            }}>
                                <View style={{ flex: 2 }}></View>
                                <View style={{ flex: 1, paddingRight: 5 }}>
                                    <Button
                                        title="No"
                                        buttonStyle={{
                                            backgroundColor: "#ff8834"
                                        }}
                                        onPress={() => this.setState({
                                            showModalCancel: false
                                        })}


                                    ></Button>

                                </View>

                                <View style={{ flex: 1, paddingLeft: 5 }}>

                                    <Button
                                        title="Si"
                                        buttonStyle={{
                                            backgroundColor: "#ff8834"
                                        }}
                                        onPress={() => this.cancelarServicio()}
                                    ></Button>


                                </View>
                                <View style={{ flex: 2 }}></View>
                            </View>
                        </View>


                    </Modal>

                </View>

                {/* Modal para aceptar la cancelación del servicio  */}
                <View>

                    <Modal
                        isVisible={this.state.showModalLlegada}

                    >
                        <View style={{ marginTop: 22, backgroundColor: "#fff" }}>
                            <View>
                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}>Llegada</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10 }}>El conductor ha llegado al punto de partida</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10, textAlign: "justify" }}>Solo te esperará 7 minutos</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10, textAlign: "justify" }}>¡Ve hacía ahí! De lo contrario, se te cobrará tarifa</Text>
                                <Icon name="clock" size={35} style={{ alignSelf: "center", marginTop: 15 }}></Icon>

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
                                            showModalLlegada: false
                                        })}
                                    ></Button>


                                </View>
                                <View style={{ flex: 2 }}></View>
                            </View>
                        </View>


                    </Modal>

                </View>


                {this.state.region.latitude!=0 && this.state.region.longitude!=0?

        

                    <MapView

                        style={{top:"-20%", height:"120%"}}
                        region={{
                            latitude: this.state.region.latitude,
                            longitude: this.state.region.longitude,
                            latitudeDelta: this.state.region.latitudeDelta,
                            longitudeDelta: this.state.region.longitudeDelta
                        }}

                        onRegionChangeComplete={this.onRegionChange}

                        showsUserLocation={true}
                        showsMyLocationButton={true}
                    >

                        {this.state.Vehicles != null && this.state.showVehicles ?


                            this.state.Vehicles.map(marker => (

                                <Marker
                                    key={"key"}
                                    coordinate={{
                                        latitude: marker.latitud,
                                        longitude: marker.longitud
                                    }}

                                >
                                    <Icon name={(marker.tipoVehiculo == 1) ? "car-side" : (marker.tipoVehiculo == 2) ? "car" : (marker.tipoVehiculo == 3) ? "shuttle-van" : (marker.tipoVehiculo == 4) ? "truck-pickup" : "car-side"} size={20} color="orange"></Icon>

                                </Marker>
                            ))


                            :
                            null

                        }


                        <Marker
                            coordinate={{
                                latitude: this.state.myPosition.latitude,
                                longitude: this.state.myPosition.longitude,
                            }}

                        >
                            <Icon name="map-pin" size={20} color="green"></Icon>
                        </Marker>



                        {
                            this.state.Paradas!=null?


                                <Marker
                                    coordinate={{
                                        latitude: this.state.Paradas[0]["latitude"],
                                        longitude: this.state.Paradas[0]["longitude"],
                                    }}

                                >
                                    <Icon name="map-pin" size={20} color="red"></Icon>
                                </Marker>

                            :

                            null
                        }


                        {this.state.Onway?
                            <Marker
                                coordinate={{
                                    latitude: this.state.positionChofer.latitude,
                                    longitude: this.state.positionChofer.longitude,
                                }}

                            >
                                <Icon color="#ff8834" name="car" size={20} ></Icon> 
                            </Marker>

                        :
                            null
                        }

                        {this.state.ConductorMapDirection && this.state.positionChofer.latitude != 0
                        && this.state.positionChofer.longitude != 0 && this.state.myPosition.latitude != 0
                        && this.state.myPosition.longitude != 0?
                            <MapViewDirections

                                origin={{
                                    latitude: this.state.positionChofer.latitude,
                                    longitude: this.state.positionChofer.longitude,
                                }}

                                destination={{
                                    latitude: this.state.myPosition.latitude,
                                    longitude: this.state.myPosition.longitude,
                                }}
                                apikey={GOOGLE_MAPS_APIKEY}
                                strokeWidth={1}
                                strokeColor="orange"
                                onReady={result => {

                                    this.setState({
                                        timeChofer: parseInt(result.duration),
                                        distance: parseInt(result.distance),
                                        duration: parseInt(result.duration)

                                    });




                                }}

                            />

                            :
                            null
                        }

                        {
                            this.state.Paradas!=null?

                                this.state.routeParada1 && this.state.myPosition.latitude != 0 
                                    && this.state.myPosition.longitude != 0 && this.state.Paradas[0]["latitude"] != 0
                                    && this.state.Paradas[0]["longitude"] != 0 ?

                                    <MapViewDirections


                                        origin={{
                                            latitude: this.state.myPosition.latitude,
                                            longitude: this.state.myPosition.longitude,
                                        }}
                                        destination={{
                                            latitude: this.state.Paradas[0]["latitude"],
                                            longitude: this.state.Paradas[0]["longitude"],
                                        }}
                                        apikey={GOOGLE_MAPS_APIKEY}
                                        strokeWidth={1}
                                        strokeColor="blue"

                                        onReady={result => {

                                            this.setState({
                                                distance: parseInt(result.distance),
                                                duration: parseInt(result.duration)

                                            });

                                            this.getTarifas();




                                        }}

                                    />

                                :
                                    null


                            :

                            null
                        }


                        {
                            this.state.Paradas != null ?

                                this.state.routeChoferDestino && this.state.positionChofer.latitude != 0
                                    && this.state.positionChofer.longitude != 0 && this.state.Paradas[0]["latitude"] !=0
                                    && this.state.Paradas[0]["longitude"] != 0 ?

                                    <MapViewDirections


                                        origin={{
                                            latitude: this.state.positionChofer.latitude,
                                            longitude: this.state.positionChofer.longitude,
                                        }}
                                        destination={{
                                            latitude: this.state.Paradas[0]["latitude"],
                                            longitude: this.state.Paradas[0]["longitude"],
                                        }}
                                        apikey={GOOGLE_MAPS_APIKEY}
                                        strokeWidth={1}
                                        strokeColor="blue"

                                        onReady={result => {

                                            this.setState({
                                                distance: parseInt(result.distance),
                                                duration: parseInt(result.duration)

                                            });

                                            this.getTarifas();




                                        }}

                                    />

                                    :
                                    null


                                :

                                null
                        }

                    </MapView>
                

                :
                    null
                }


                {this.state.showBackButton ?

                    <View style={{
                        flexDirection: "row",
                        position: "absolute", //use absolute position to show button on top of the map
                        left: "3%",
                        top: "1%",

                    }}>
                        <View style={{ flex: 1 }}>
                            <Icon
                                name="arrow-left"
                                color="#ff8834"
                                size={30}
                                onPress={() => {
                                    clearInterval(this.timer_Vehicles);
                                    clearInterval(this.timer_VehiclesConsult);
                                    this.props.navigation.navigate("Home")
                                }}
                            ></Icon>
                        </View>

                    </View>
                    :
                    null
                }

                {this.state.showTimeChofer ?
                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "1%" }}>
                        <View style={{ flex: 1, height: 20 }}>
                            <Text style={{ color: "black", fontWeight: "bold" }}>Llegada: {this.state.timeChofer} Minuto(s)</Text>
                        </View>

                    </View>

                    :
                    null
                }

                {this.state.showEstimations ?


                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "70%" }}>

                        <View style={{ flex: 2.5 }}></View>
                        <View style={{ flex: 1 }}>
                            <Icon name="car-side" color="#ff8834" size={30} ></Icon>
                        </View>
                        <View style={{ flex: 2.5 }}></View>


                    </View>
                    :

                    null

                }

                {this.state.showEstimations ?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "77%" }}>

                        <View>
                            <Text>{this.state.infoVehicleTipo} <Icon name="info-circle" color="#ff8834" size={18}
                                onPress={() => this.props.navigation.navigate("DesgloseTarifa")}
                            ></Icon> </Text>
                            <Text> {this.state.infoVehicleLlegada}</Text>
                        </View>

                        <View style={{ paddingLeft: 120 }}>
                            <Text> MX$ {this.state.infoVehicleTarifa.Tarifa}</Text>
                        </View>

                    </View>
                    :
                    null
                }

                {this.state.showEstimations ?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "87%" }}>
                        <Icon color="#ff8834" name={this.state.cashPay ? "money-bill-alt" : "credit-card"} size={30} onPress={() => this.showPay()}></Icon>

                        <Text color="#ff8834" style={{ fontWeight: "bold", paddingLeft: 10, paddingTop: 5 }}>{this.state.cashPay ? "Efectivo" : "Tarjeta de Crédito / débito"}</Text>

                        <Icon color="#ff8834" style={{ paddingLeft: 10, paddingTop: 5 }} name="chevron-down" size={20} onPress={() => this.showPay()}></Icon>

                    </View>
                    :
                    null
                }


                {!this.state.Pay && this.state.showEstimations ?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "92%" }}>
                        <View style={{ flex: 6 }}>

                            <Button title={"Confirmar " + this.state.infoVehicleTipo}
                                style={{ width: '100%' }}
                                type="outline"
                                onPress={() => this.generarSolicitud()}
                            ></Button>

                        </View>
                    </View>
                    :
                    null
                }

                {this.state.Home ?

                    <View style={{ position: "absolute", left: "3%", top: "70%" }}>

                        <View>
                            <Text style={{ fontWeight: "bold", fontSize: 16 }}>{
                                this.state.isNextVehicles ?
                                    "YiMi Express"
                                    :
                                    "YiMi Pool"
                            }</Text>

                        </View>
                    </View>
                    :
                    null
                }

                {this.state.Home ?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "77%" }}>

                        {this.state.isNextVehicles ?
                            null
                            :
                            <Icon name="chevron-left"
                                color="#ff8834"
                                size={25}
                                onPress={() => this.setState({
                                    isNextVehicles: !this.state.isNextVehicles
                                })}
                            ></Icon>
                        }

                        <View style={{ paddingLeft: 30 }}>
                            <Icon name="car-side"
                                color="#ff8834"
                                size={25}
                                style={{ alignSelf: "center" }}
                                onPress={() => this.showInfoVehicle(this.state.isNextVehicles ? "Express Estandar" : "Pool Estandar")}
                            ></Icon>
                            <Text
                                style={{
                                    alignSelf: "center",
                                    fontSize: 12
                                }}
                            >{
                                    this.state.isNextVehicles ?
                                        this.state.Express_Estandar.nombre_categoria
                                        :
                                        this.state.Pool_Estandar.nombre_categoria

                                }</Text>
                            <Text
                                style={{
                                    alignSelf: "center",
                                    fontSize: 12
                                }}
                            >Aprox MX ${
                                    this.state.isNextVehicles ?
                                        this.state.Express_Estandar.out_costo_viaje
                                        :
                                        this.state.Pool_Estandar.out_costo_viaje

                                }</Text>
                        </View>
                        <View style={{ paddingLeft: 35 }}>
                            <Icon name="car-side"
                                color="#ff8834"
                                onPress={() => this.showInfoVehicle(this.state.isNextVehicles ? "Express Lujo" : "Pool Lujo")}
                                size={25}
                                style={{ alignSelf: "center" }}
                            ></Icon>
                            <Text
                                style={{
                                    alignSelf: "center",
                                    fontSize: 12
                                }}
                            >{
                                    this.state.isNextVehicles ?
                                        this.state.Express_Lujo.nombre_categoria
                                        :
                                        this.state.Pool_Lujo.nombre_categoria

                                }</Text>
                            <Text
                                style={{
                                    alignSelf: "center",
                                    fontSize: 12
                                }}
                            >Aprox MX ${
                                    this.state.isNextVehicles ?
                                        this.state.Express_Lujo.out_costo_viaje
                                        :
                                        this.state.Pool_Lujo.out_costo_viaje

                                }</Text>
                        </View>
                        <View style={
                            {
                                paddingLeft: 30,
                                paddingTop: 12
                            }
                        }>

                            {this.state.isNextVehicles ?

                                <Icon name="chevron-right"
                                    color="#ff8834"
                                    size={25}
                                    onPress={() => this.setState({
                                        isNextVehicles: !this.state.isNextVehicles
                                    })}
                                ></Icon>
                                :
                                null
                            }

                        </View>
                    </View>
                    :
                    null
                }

                {this.state.Home ?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "87%" }}>
                        <Icon color="#ff8834" name={this.state.cashPay ? "money-bill-alt" : "credit-card"} size={30} onPress={() => this.setState({
                            showEstimations: false,
                            Home: false,
                            Pay: true
                        })

                        }></Icon>
                        <Text style={{ fontWeight: "bold", paddingLeft: 10, paddingTop: 5 }}>{this.state.cashPay ? "Efectivo" : "Tarjeta de Crédito / débito"}</Text>
                        <Icon color="#ff8834" style={{ paddingLeft: 10, paddingTop: 5 }} name="chevron-down" size={20} onPress={() => this.setState({
                            showEstimations: false,
                            Home: false,
                            Pay: true
                        })}></Icon>
                    </View>

                    :
                    null
                }

                {this.state.Pay ?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "70%" }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}> Método de pago</Text>

                        {this.state.showEstimations ?

                            <Icon color="#ff8834" style={{ paddingLeft: 135, paddingTop: 5 }} name="chevron-left" size={20} onPress={() => this.closePay()}></Icon>
                            :
                            <Icon color="#ff8834" style={{ paddingLeft: 135, paddingTop: 5 }} name="chevron-left" size={20} onPress={() => this.closePay()}></Icon>
                        }


                    </View>
                    :

                    null
                }
                {this.state.Pay ?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "75%" }}>

                        <View style={{ flex: 1 }}>

                            <Icon color="#ff8834" name="money-bill-alt" size={25} ></Icon>

                        </View>

                        <View style={{ flex: 4 }}>

                            <Text>Efectivo</Text>

                        </View>


                        <View style={{ flex: 1 }}>

                            <Icon name="check-circle" color={this.state.cashPay ? "green" : "#ff8834"} size={25} onPress={() => this.setState({
                                cashPay: true,
                                creditPay: false
                            })}></Icon>


                        </View>



                    </View>


                    :
                    null
                }

                {this.state.Pay ?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "80%" }}>

                        <View style={{ flex: 1 }}>

                            <Icon color="#ff8834" name="credit-card" size={25} ></Icon>

                        </View>

                        <View style={{ flex: 4 }}>

                            <Text color="#ff8834">Tarjeta de crédito / débito </Text>

                        </View>

                        <View style={{ flex: 1 }}>
                            <Icon name="check-circle" color={this.state.creditPay ? "green" : "#ff8834"} size={25} onPress={() => this.setState({
                                cashPay: false,
                                creditPay: true
                            })}></Icon>

                        </View>


                    </View>
                    :
                    null
                }

                {this.state.Pay ?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "85%" }}>
                        <Icon color="#ff8834" name="cc-visa" size={25} ></Icon>

                        <Text style={{ paddingLeft: 10 }}> **** **** **** 1254 </Text>

                        <Icon name="check-circle" color={this.state.creditPay ? "green" : "#ff8834"} size={25} style={{ paddingLeft: 45 }} onPress={() => this.setState({
                            cashPay: false,
                            creditPay: true
                        })}></Icon>


                    </View>
                    :
                    null
                }
                {this.state.Pay ?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "90%" }}>
                        <Text>Agregar método de pago</Text>
                    </View>
                    :
                    null
                }


                {this.state.Onway ?
                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "60%" }}>
                        <View style={{ flex: 2.5 }}></View>
                        <View style={{ flex: 1 }}>
                            <Icon color="#ff8834" name="chevron-up"
                                style={{ alignSelf: "center", paddingTop: 5 }}
                                size={30}
                                onPress={() => this.props.navigation.navigate("InfoTravel", { typeTravel: "Travel_Integrado", timeArrival: this.state.timeChofer, Arrival: this.state.routeChoferDestino })}

                            ></Icon>
                        </View>
                        <View style={{ flex: 2.5 }}></View>

                    </View>
                    :
                    null
                }

                {this.state.showOnway ?
                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "65%" }}>

                        <Text style={{ fontWeight: "bold", fontSize: 14, alignSelf: "center" }}>Tu conductor está en camino, espera un momento</Text>


                    </View>
                    :
                    null
                }


                {this.state.Onway ?
                    <View style={{ flexDirection: "row", position: "absolute", top: "68%", backgroundColor: "black", width: "100%" }}>

                        <View style={{ flex: 1 }}></View>

                        <View style={{ flex: 4 }}>

                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 12, alignSelf: "center" }}>Verifica la matricula y los detalles del auto</Text>

                        </View>

                        <View style={{ flex: 1 }}></View>

                    </View>
                    :
                    null
                }

                {this.state.Onway ?

                    < View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "71%" }}>
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={{ uri: keys.datos_chofer.imgChofer }}
                        ></Image>
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={{ uri: keys.datos_vehiculo.imgVehiculo }}
                        ></Image>
                        <View style={{ paddingLeft: 120 }}>
                            <Text>{keys.datos_vehiculo.modelo}</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 16 }}>{keys.datos_vehiculo.Matricula}</Text>
                            <Button color="#ff8834" title="Cancelar"
                                onPress={() => this.setState({
                                    showModalCancel: true
                                })}
                            ></Button>

                        </View>
                    </View>
                    :
                    null
                }

                {this.state.Onway ?
                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "85%" }}>

                        <Text >{keys.datos_chofer.nombreChofer}<Text>*{keys.datos_chofer.Estrellas}</Text> <Icon name="star"></Icon> <Text>* {keys.datos_chofer.Reconocimientos}</Text></Text>


                    </View>
                    :
                    null
                }



                {this.state.Onway ?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "90%" }}>

                        <View style={{ flex: 2 }}></View>
                        <View style={{ flex: 1 }}>

                            <Icon color="#ff8834" name="phone" onPress={() => this.callPhoneFunction()} size={30} onPress={() => this.callPhoneFunction()}></Icon>

                        </View>
                        <View style={{ flex: 1 }}>

                            <Icon name="comment-dots"
                                color="#ff8834"
                                // style={{ paddingLeft: 40 }}
                                size={30}
                                onPress={() => this.Chat()}
                            ></Icon>

                        </View>
                        <View style={{ flex: 2 }}></View>


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
        paddingBottom: 50
    },
 


    area: {
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        backgroundColor: "#fff"
    },
    areawrow: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        backgroundColor: "#fff"
    },
  
    containerMap: {
        // ...StyleSheet.absoluteFillObject,
        height: 425,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },

    // bottonModal:{
    //     justifyContent:"flex-end",
    //     margin:0
    // }
});
