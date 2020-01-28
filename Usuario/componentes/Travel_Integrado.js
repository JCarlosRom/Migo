// Importación de librerías 
import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, {Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import MapViewDirections from 'react-native-maps-directions';
import * as Location from "expo-location";
import { StackActions, NavigationActions } from 'react-navigation';
import axios from 'axios';
import keys from "./global";
import * as Permissions from 'expo-permissions';
import call from 'react-native-phone-call'

const GOOGLE_MAPS_APIKEY = 'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY';
// Clase principa Travel_Integrado
export default class Travel_Integrado extends Component {
   

    /**
     *Creates an instance of Travel_Integrado.
     * Constructor de la clase Travel_Integrado
     * @param {*} props
     * @memberof Travel_Integrado
     */
    constructor(props) {

        // Socket para asignar los ids de socket en caso de cambio
        keys.socket.on('getIdSocket', (num) => {

            keys.id_usuario_socket = num.id;

            console.log("Usuario", keys.id_usuario_socket);

            // Envio de id nuevo a chofer
            keys.socket.emit("WSsendIdUsuarioChofer", {
                id_usuario_socket: keys.id_usuario_socket, idSocketChofer: keys.id_chofer_socket
            })


        })
        // Socket para recibir el id nuevo del chofer
        keys.socket.on("sendIdChoferUsuario",(num)=>{
            keys.id_chofer_socket = num.id_socket_chofer;
            console.log("Recibí id de chofer",keys.id_chofer_socket)
        })

        super(props);
        // States del componente
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

            showBackButton:true,
            Home: true,
            showEstimations: false,
            helperPay: false,
            Pay: false,
            Onway: false,
            showOnway:false,
            showModalCancel: false,
            showModalAcept: false,
            showModal:false,
            Descripcion:"",
            showModalLlegada:false, 
            showModalAceptViaje:false, 
            showTimeChofer:false,
            location: null,
            timeChofer:0,
            distance: 0,
            duration: 0,
            // Tarifas por tipo de vehículo
            Express_Estandar: {
                categoria_servicio: 0,
                nombre_categoria: "",
                out_costo_viaje: 0,
                tarifaBase: 0,
                tarifaMinima:0,
                porKilometro: 0,
                porMinuto: 0,
                Gob: 0,
                Solicitud: 0,
                tarifa_cancelacion: 0
            },
            Express_Lujo: {
                categoria_servicio: 0,
                nombre_categoria: "",
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
                nombre_categoria: "",
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
                nombre_categoria: "",
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
            routeParada1: true,
            routeChoferDestino: false,
            cashPay: true,
            creditPay: false,
            infoVehicleTipo: "",
            infoVehicleLlegada: "",
            // Estado tarifa final
            infoVehicleTarifa: {
                Tarifa:0,
                tarifaBase: 0,
                tarifaMinima:0,
                porKilometro: 0,
                porMinuto: 0,
                Gob: 0,
                Solicitud: 0,
            },
            timer_coordenadasUsuario: null,
            Change:false,
            Vehicles: null,
            showVehicles:true

        };

        
        // Inicio de consulta de vehículos 
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


        })

        keys.socket.removeAllListeners("chat_usuario");
        // Socket de notificación de mensaje nuevo 
        keys.socket.on("LlegoMensaje", (num)=>{
            this.setState({
                showModal: true,
                Descripcion: "Te llegó un mensaje",
            })

        })
 
        // Chat de Usuario
        keys.socket.on('chat_usuario', (num) => {

            
            keys.Chat.push(num.Mensaje);
            
            console.log("Travel Integrado", keys.Chat)
        })
    
 

        // Socket para designar el punto de encuentro 
        keys.socket.on('puntoEncuentroUsuario', (num) => {

            this.setState({
                ConductorMapDirection:false,
                routeParada1:false,
                routeChoferDestino:true,
                showModalLlegada:true,
                showTimeChofer: false,
                showOnway:false,
                
              
            })
            

    
        })
    
        // Aqui se acepta el recorrido
        keys.socket.on('recorrido_id_usuario', num => {
            console.log('Llego respuesta: ', num);
  
            keys.id_servicio = num.servicio;
            keys.id_recorrido = num.recorrdio;

            console.log("idServicio", keys.id_servicio);
            console.log("idRecorrido", keys.id_recorrido);
        
        });
        // Recepción de la información del chofer cuando se acepta la solicitud
        keys.socket.on('conductor_sendInfo', num => {
            console.log('conductor_sendInfo');

            clearInterval(this.timer_Vehicles);

            clearInterval(this.timer_VehiclesConsult);

            var d = new Date(); // get current date
            d.setHours(d.getHours(), d.getMinutes() + 3, 0, 0);
            keys.HoraServicio= d.toLocaleTimeString()

            console.log("Hora",keys.HoraServicio);

            this.setState({
                showBackButton:false,
                showModalAcept: true,
                Descripcion: "El chofer ha aceptado tu solicitud",
                showVehicles:false
            })

            // Asignación de información 
            keys.datos_chofer={
                idChofer: num.datos_chofer.idChofer,
                nombreChofer: num.datos_chofer.nombreChofer,
                Estrellas: num.datos_chofer.Estrellas,
                Reconocimientos: num.datos_chofer.Reconocimientos,
                Telefono: num.datos_chofer.Telefono
            }

            keys.datos_vehiculo={
                id_unidad: num.datos_vehiculo.id_unidad ,
                modelo: num.datos_vehiculo.modelo,
                Matricula: num.datos_vehiculo.Matricula,
                tipoVehiculo: num.datos_vehiculo.tipoVehiculo,
                categoriaVehiculo: num.datos_vehiculo.categoriaVehiculo,
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
                showOnway:true,
                ConductorMapDirection:true,
                showEstimations: false,
                Home: false,
                showTimeChofer:true
            })

      
          
        });

        // Socket para hacer el tracking del chofer
        keys.socket.on('seguimiento_chofer', num => {

   
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

        // Socket para terminar el viaje
        keys.socket.on('terminarViajeUsuario', num => {

            keys.Chat=[];
            keys.Tarifa.Total = num.Tarifa;
      
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "terminarViaje" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);
        });
        // Socket para cancelación por chofer
        keys.socket.on("cancelViajeUsuario", num =>{

            keys.Chat = [];

            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicioUsuario" } })],
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
    
    /**
     * Función para consulta de los vehiculos en la primera renderización del componente
     *
     * @param {*} categoriaVehiculo
     * @param {*} tipoVehiculo
     * @memberof Travel_Integrado
     */
    async getVehiclesInit(categoriaVehiculo, tipoVehiculo) {

        clearInterval(this.timer_Vehicles);

        clearInterval(this.timer_VehiclesConsult);
        // Emit de consulta 
        keys.socket.emit('vehiclesConsult', {
            categoriaVehiculo: categoriaVehiculo, tipoVehiculo: tipoVehiculo, id_usuario_socket: keys.id_usuario_socket
        });
        // Interval de consulta
        this.timer_VehiclesConsult = setInterval(() => {

            keys.socket.emit('vehiclesConsult', {
                categoriaVehiculo: categoriaVehiculo, tipoVehiculo: tipoVehiculo, id_usuario_socket: keys.id_usuario_socket
            });


        }, 10000);

        keys.categoriaVehiculo = categoriaVehiculo;

        keys.tipoVehiculo = tipoVehiculo;

    }

    /**
     *Función para consulta según los parametros de llegada
     *
     * @param {*} tipoVehiculo
     * @param {*} tipoServicio
     * @memberof Travel_Integrado
     */
    async getVehicles( tipoVehiculo, tipoServicio ){

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

    }


  
    /**
     * Llamada al telefono de chófer
     *
     * @memberof Travel_Integrado
     */
    callPhoneFunction() {
        const args = {
            number: keys.datos_chofer.Telefono, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
        }

        call(args).catch(console.error)
    }

    /**
     * Función para ver el tipo de pago 
     *
     * @memberof Travel_Integrado
     */
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

    /**
     * Función para ocultar el tipo de pago 
     *
     * @memberof Travel_Integrado
     */
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

    /**
     * Función para generar las tarifas
     *
     * @memberof Travel_Integrado
     */
    async getTarifas(){
        try {
            console.log(this.state.distance);
            console.log(this.state.duration);
            //console.log(this.props.switchValue);
            const res = await axios.post('http://35.203.42.33:3003/webservice/interfaz164/UsuarioCalculoPrecios', {
                distancia_km: this.state.distance,
                tiempo_min: this.state.duration
            });
    
            res.data.datos.forEach(element => {

                if(element["categoria_servicio"]==1){
                   
                    this.setState({
                       
                        Express_Estandar: {
                            categoria_servicio: element["categoria_servicio"],
                            nombre_categoria: element["nombre_categoria"],
                            out_costo_viaje: parseInt(element["out_costo_viaje"]),
                            tarifaBase : parseInt(element["tarifa_base"]),
                            tarifaMinima : parseInt(element["tarifa_minima"]),
                            porKilometro : parseInt(element["distancia"]),
                            porMinuto : parseInt(element["tiempo"]),
                            Gob : element["cuota_gob"],
                            Solicitud : element["cuota_solicitud"],
                            tarifa_cancelacion: element["tarifa_cancelacion"]
                        }

                    
                     
                    })
                }

                if (element["categoria_servicio"] == 2) {

                    this.setState({
                        Express_Lujo: {
                            categoria_servicio: element["categoria_servicio"],
                            nombre_categoria: element["nombre_categoria"],
                            out_costo_viaje: parseInt(element["out_costo_viaje"]),
                            tarifaBase: parseInt(element["tarifa_base"]),
                            tarifaMinima: parseInt(element["tarifa_minima"]),
                            porKilometro: parseInt(element["distancia"]),
                            porMinuto: parseInt(element["tiempo"]),
                            Gob: element["cuota_gob"],
                            Solicitud: element["cuota_solicitud"],
                            tarifa_cancelacion: element["tarifa_cancelacion"]
                        }
                    })
                }

                if (element["categoria_servicio"] == 3) {

                    this.setState({
                        Pool_Estandar: {
                            categoria_servicio: element["categoria_servicio"],
                            nombre_categoria: element["nombre_categoria"],
                            out_costo_viaje: parseInt(element["out_costo_viaje"]),
                            tarifaBase: parseInt(element["tarifa_base"]),
                            tarifaMinima: parseInt(element["tarifa_minima"]),
                            porKilometro: parseInt(element["distancia"]),
                            porMinuto: parseInt(element["tiempo"]),
                            Gob: element["cuota_gob"],
                            Solicitud: element["cuota_solicitud"],
                            tarifa_cancelacion: element["tarifa_cancelacion"]
                        }

                    })
                }

                if (element["categoria_servicio"] == 4) {

                    this.setState({
                        Pool_Lujo: {
                            categoria_servicio: element["categoria_servicio"],
                            nombre_categoria: element["nombre_categoria"],
                            out_costo_viaje: parseInt(element["out_costo_viaje"]),
                            tarifaBase: parseInt(element["tarifa_base"]),
                            tarifaMinima: parseInt(element["tarifa_minima"]),
                            porKilometro: parseInt(element["distancia"]),
                            porMinuto: parseInt(element["tiempo"]),
                            Gob: element["cuota_gob"],
                            Solicitud: element["cuota_solicitud"],
                            tarifa_cancelacion: element["tarifa_cancelacion"]
                        }
                    })

        
                }

                
            
            });
        
        } catch (e) {
            console.log(e);
            this.setState({
                showModal: true,
                Descripcion: "Servicio no disponible, Intente más tarde",
            })
      
        }
    }

    /**
     * Función para generar la solicitud
     *
     */
    generarSolicitud = () => {

        keys.Tarifa.Total = this.state.infoVehicleTarifa.Tarifa;
        keys.Tarifa.tarifaBase = this.state.infoVehicleTarifa.tarifaBase;
        keys.Tarifa.tarifaMinima = this.state.infoVehicleTarifa.tarifaMinima;
        keys.Tarifa.porMinuto = this.state.infoVehicleTarifa.porMinuto;
        keys.Tarifa.porKilometro = this.state.infoVehicleTarifa.porKilometro;
        keys.Tarifa.Solicitud = this.state.infoVehicleTarifa.Solicitud;
        keys.Tarifa.Gob = this.state.infoVehicleTarifa.Gob;
        keys.Tarifa.tarifa_cancelacion= this.state.infoVehicleTarifa.tarifa_cancelacion;
        console.log("keys", keys.Tarifa)
        
        
        keys.travelInfo.typePay = keys.typePay;


        usuario_latitud = this.state.myPosition.latitude;
        usuario_longitud = this.state.myPosition.longitude;
        datos_usuario = keys.datos_usuario;
        infoTravel= keys.travelInfo;
        type= keys.type;
        keys.id_usuario_socket= keys.socket.id;
        Tarifa = keys.Tarifa.Total
        Distancia= this.state.distance,
        Tiempo= this.state.duration
        
        
        // Envio de solicitud al chófer
        keys.socket.emit('usuario_solicitud', {
            usuario_latitud: usuario_latitud, usuario_longitud: usuario_longitud, 
            datos_usuario: datos_usuario, infoTravel: infoTravel, Paradas: keys.Paradas, type: type, 
            id_usuario_socket: keys.id_usuario_socket, categoriaVehiculo:keys.categoriaVehiculo, 
            tipoVehiculo: keys.tipoVehiculo, tipoServicio: keys.tipoServicio, Tarifa: Tarifa,
            Distancia:Distancia, Tiempo:Tiempo, 
       
        });
    }
    
    /**
     * Función para generar las coordenadas del GPS del dispositivo Móvil
     *
     */
    findCurrentLocationAsync = async () => {
        // Permisos para el GPS
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
     * Ciclo de vida para antes de que se monte el componente
     *
     * @memberof Travel_Integrado
     */
    async componentWillMount() {

        // Asignación de coordenadas mi posición y región
        let primeraParada = await Location.geocodeAsync(keys.travelInfo.puntoPartida.addressInput);
        
    
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

        // Generación de información de parada 1
        if (keys.type !="SinDestino"){
            
            let Parada1 = await Location.geocodeAsync(keys.travelInfo.Parada1);
    
            Paradas = []
    
            Parada1Info = {
                latitude: Parada1[0]["latitude"], longitude: Parada1[0]["longitude"], Direccion: keys.travelInfo.Parada1
            }
    
            Paradas.push(Parada1Info)
    
            this.setState({
    
                Paradas
    
            })
    
        
    
            keys.Paradas= this.state.Paradas;
        }

        

    }

   

    /**
     * Barra de navegación
     *
     * @static
     * @memberof Travel_Integrado
     */
    static navigationOptions = {
        title: "Viaje",
        headerLeft: null
        
    };







    /**
     * Abrir modal de cancelación 
     *
     * @param {*} visible
     * @memberof Travel_Integrado
     */
    setModalAceptCancel(visible) {

        this.setState({ ModalAceptCancel: visible });
        
        this.setState({ ModalCancel: !visible });

    }
    
    /**
     * Función para asignar y mostrar la información del vehículo
     *
     * @param {*} typeVehicle
     * @memberof Travel_Integrado
     */
    showInfoVehicle(typeVehicle){

        var d = new Date(); // get current date
        d.setHours(d.getHours(), d.getMinutes() + this.state.duration, 0, 0);
    
    
        if(typeVehicle=="Express Estandar"){
            this.setState({
                infoVehicleTipo: "Express Estandar",
                infoVehicleLlegada: d.toLocaleTimeString(),
             

            })


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

            this.getVehicles( keys.tipoVehiculo, keys.tipoServicio)


        }else{
            if(typeVehicle=="Express Lujo"){
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

                this.getVehicles( keys.tipoVehiculo, keys.tipoServicio)
            }else{
                if(typeVehicle=="Pool Estandar"){
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

                    this.getVehicles( keys.tipoVehiculo, keys.tipoServicio)

                }else{
                    if(typeVehicle=="Pool Lujo"){
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

                        this.getVehicles( keys.tipoVehiculo, keys.tipoServicio)
                    }
                }
            }
        }

        
  

        this.setState({
            showEstimations: true,
            Home: false
        })
    }


    /**
     * Función para el Chat
     *
     * @memberof Travel_Integrado
     */
    Chat() {

        keys.socket.removeAllListeners("chat_usuario");
        this.props.navigation.navigate("Chat")
    }

    /**
     * Función para el cambio de región por evento de Desplazamiento
     *
     * @param {*} region
     */
    onRegionChange = async region => {
        latitude = region.latitude;
        longitude = region.longitude;
        latitudeDelta = region.latitudeDelta;
        longitudeDelta = region.longitudeDelta;

        console.log(region)

        this.setState({
            region
        });


    } 

    /**
     * Función para cancelar el servicio 
     *
     * @memberof Travel_Integrado
     */
    cancelarServicio(){

        var d = new Date(); // get current date
        d.setHours(d.getHours(), d.getMinutes(), 0, 0);
        horaActual = d.toLocaleTimeString()

        console.log("Hora Actual", horaActual);
        console.log("Hora Servicio", keys.HoraServicio);

        keys.Chat=[];

        this.setState({
            
            showModalCancel: false,
        

            
        })
        // Emit para enviar al chofe que se canceló el viaje 
        keys.socket.emit('cancelViajeUsuario', { id_chofer_socket: keys.id_chofer_socket });

        if(horaActual<keys.HoraServicio){
            // Después de 3 minutos
            // Emit para la cancelación el viaje 
            keys.socket.emit("cancelaUsuario", { id: keys.id_servicio, isCobro: true, idUsuario: keys.datos_usuario.id_usuario, tarifa_cancelacion: keys.Tarifa.tarifa_cancelacion })

            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicioNoCobro" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);
            
        }else{
            // Antes de 3 minutos
            keys.socket.emit("cancelaUsuario", { id: keys.id_servicio, isCobro: false, idUsuario: keys.datos_usuario.id_usuario, tarifa_cancelacion: keys.Tarifa.tarifa_cancelacion })
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicio" } })],
                key: undefined
            });
    
            this.props.navigation.dispatch(resetAction);

        }

    }


 
    /**
     * Render principal de Travel_Integrado
     *
     * @returns
     * @memberof Travel_Integrado
     */
    render() {
        return (
            <View style={{ flex: 1 }}>


                {/* Modal para mensajes */}
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

                {/* Modal de aviso de viaje aceptado */}
                <View>

                    <Modal
                            isVisible={this.state.showModalAcept}

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
                        <View style={{ marginTop: 22, backgroundColor: "#fff"}}>
                            <View>
                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}>Cancelación de servicio</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10 }}>¿Está seguro de cancelar el servicio de taxi?</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10, textAlign:"justify" }}>Recuerde que si supera 3 minutos después de haber</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10, textAlign: "justify" }}>Solicitado</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 15, marginRight: 10, paddingTop:5 }}> su servicio, se le cobrará la tarifa de cancelación</Text>
                                <Icon name="clock" size={35} style={{ alignSelf: "center", marginTop: 15 }}></Icon>

                            </View>
                            <View style={{
                                flexDirection: "row",
                                paddingTop:5,
                                marginBottom:5

                            }}>
                                <View style={{ flex:2 }}></View>
                                <View style={{ flex:1, paddingRight:5 }}>
                                    <Button
                                        buttonStyle={{
                                            backgroundColor: "#ff8834"
                                        }}
                                        title="No"
                                        onPress={() => this.setState({
                                            showModalCancel: false
                                        })}


                                    ></Button>

                                </View>

                                <View style={{ flex:1, paddingLeft:5 }}>

                                    <Button
                                        buttonStyle={{
                                            backgroundColor: "#ff8834"
                                        }}
                                        title="Si"
                                        onPress={() => this.cancelarServicio()}
                                    ></Button>


                                </View>
                                <View style={{ flex: 2 }}></View>
                            </View>
                        </View>


                    </Modal>

                </View>
                {/* Modal para aviso de llegada */}
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
                                            showModalLlegada:false
                                        })}
                                    ></Button>


                                </View>
                                <View style={{ flex: 2 }}></View>
                            </View>
                        </View>


                    </Modal>

                </View>
                {/* Mapa */}
                {this.state.region.latitude != 0 && this.state.region.longitude != 0 && this.state.region.latitudeDelta != 0 && this.state.region.longitudeDelta != 0 ?

                    <MapView

                        style={{ top: "-30%", height: "130%" }}

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
                        {/* Marcador de la posición del usuario  */}
                        <Marker
                            coordinate={{
                                latitude: this.state.myPosition.latitude,
                                longitude: this.state.myPosition.longitude,
                            }}

                        >
                            <Icon name="map-pin" size={20} color="green"></Icon>
                        </Marker>
                        {/* Bloque para la consulta de vehiculos */}
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
                        {/* Fin del bloque */}
                        {/* Primera parada */}
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

                        {/* Marcador del vehículo */}
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

                        {this.state.ConductorMapDirection 
                        && this.state.positionChofer.latitude!=0 
                        && this.state.positionChofer.longitude != 0
                        && this.state.myPosition.latitude != 0
                        && this.state.myPosition.longitude !=0 
                        ?
                        // ruta de la posición del chófer a la posición del usuario 
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
                                && this.state.myPosition.longitude != 0 
                                && this.state.Paradas[0]["latitude"] !=0
                                && this.state.Paradas[0]["longitude"] !=0
                                ?
                                    // Ruta de mi posición a la parada 1 
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

                                this.state.routeChoferDestino && this.state.positionChofer.latitude!=0
                                    && this.state.positionChofer.longitude != 0
                                    && this.state.Paradas[0]["latitude"] != 0
                                    && this.state.Paradas[0]["longitude"] !=0
                                    ?

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
                {/* Botón para regresar a la pantalla anterior  */}
                {this.state.showBackButton?
                
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
                {/* Tiempo de llegada estimado del conductor */}
               {this.state.showTimeChofer ?
                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "1%"}}>
                        <View style={{ flex: 1, height: 20 }}>
                            <Text style={{ color: "black", fontWeight:"bold" }}>Llegada: {this.state.timeChofer} Minuto(s)</Text> 
                        </View>
                      
                    </View>

                    :
                    null
                }

                {this.state.showEstimations?
                    

                        <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "70%" }}>

                            <View style={{flex:2.5}}></View>
                            <View style={{flex:1}}>
                                <Icon name="car-side" color="#ff8834" size={30} ></Icon>
                            </View>
                            <View style={{ flex: 2.5 }}></View>


                        </View>
                :

                    null

                }   
                {/* Información del taxi */}
                {this.state.showEstimations?
                
                        <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "77%" }}>
                    
                            <View>
                                <Text>{this.state.infoVehicleTipo} <Icon name="info-circle" color="#ff8834" size={18}
                                onPress={() => this.props.navigation.navigate("DesgloseTarifa")}
                                ></Icon> </Text>
                                <Text> {this.state.infoVehicleLlegada}</Text>
                            </View>

                            <View style={{paddingLeft:120}}>
                                <Text> MX$ {this.state.infoVehicleTarifa.Tarifa}</Text>
                            </View>

                        </View>
                :
                    null
                }
                {/* Tipo de pago  */}
                {this.state.showEstimations?
                
                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "87%" }}>
                        <Icon color="#ff8834" name={this.state.cashPay ? "money-bill-alt" :"credit-card"} size={30} onPress={() => this.showPay() }></Icon>

                        <Text color="#ff8834" style={{ fontWeight: "bold", paddingLeft: 10, paddingTop: 5 }}>{this.state.cashPay? "Efectivo" : "Tarjeta de Crédito / débito"}</Text>

                        <Icon color="#ff8834" style={{ paddingLeft: 10, paddingTop: 5 }} name="chevron-down" size={20} onPress={() => this.showPay()}></Icon>

                    </View>
                :
                    null
                }

                {/* Botón de confirmar */}
                {!this.state.Pay && this.state.showEstimations?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "92%" }}>
                        <View style={{flex:6}}>

                            <Button title={"Confirmar "+this.state.infoVehicleTipo }
                                style={{ width: '100%' }}
                                type="outline" 
                                onPress={()=>this.generarSolicitud()}
                                ></Button>

                        </View>
                    </View>
                :
                    null
                }

                {/* Bloque Catalogo de vehiculos */}
                {this.state.Home?

                    <View style={{ position: "absolute", left: "3%", top: "70%" }}>

                        <View>
                            <Text style={{fontWeight:"bold", fontSize:16}}>{
                                this.state.isNextVehicles?
                                    "YiMi Express"
                                :
                                "YiMi Pool"
                            }</Text>

                        </View>
                    </View>
                : 
                    null
                }
                
                {this.state.Home?
                
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

                        <View style={{paddingLeft:30}}> 
                            <Icon name="car-side"
                                color="#ff8834"
                                size={25}
                                style={{alignSelf:"center"}}
                                onPress={()=>this.showInfoVehicle(this.state.isNextVehicles?"Express Estandar": "Pool Estandar")}
                            ></Icon>
                            <Text
                            style={{ alignSelf: "center",
                            fontSize: 12 }}
                            >{
                                this.state.isNextVehicles?
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
                                paddingLeft:30,
                                paddingTop:12
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
                {/* Fin del bloque */}
                {/* Tipo de pago */}
                {this.state.Home?
                
                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "87%" }}>
                        <Icon color="#ff8834" name={this.state.cashPay ? "money-bill-alt" : "credit-card"} size={30} onPress={() => this.setState({
                            showEstimations: false,
                            Home: false,
                            Pay: true
                        })

                        }></Icon>
                        <Text style={{ fontWeight: "bold", paddingLeft: 10, paddingTop: 5 }}>{this.state.cashPay ? "Efectivo" : "Tarjeta de Crédito / débito"}</Text>
                        <Icon color="#ff8834"  style={{ paddingLeft: 10, paddingTop: 5 }} name="chevron-down" size={20} onPress={() => this.setState({
                            showEstimations: false,
                            Home: false,
                            Pay: true
                        })}></Icon>
                    </View>
            
                :
                    null
                }
                {/* Bloque de pago */}
                {this.state.Pay?
                        
                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "70%" }}>
                        <Text style={{fontSize:16, fontWeight:"bold"}}> Método de pago</Text>

                        {this.state.showEstimations?

                            <Icon color="#ff8834" style={{ paddingLeft: 135, paddingTop: 5 }} name="chevron-left" size={20} onPress={() => this.closePay()}></Icon>
                        :
                            <Icon color="#ff8834" style={{ paddingLeft: 135, paddingTop: 5 }} name="chevron-left" size={20} onPress={() => this.closePay()}></Icon>
                        }


                    </View>
                :

                    null
                }
                {this.state.Pay?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "75%" }}>

                        <View style={{flex:1}}>

                            <Icon color="#ff8834" name="money-bill-alt" size={25} ></Icon>

                        </View>

                        <View style={{flex:4}}>

                            <Text>Efectivo</Text>

                        </View>

                        
                        <View style={{flex:1}}>

                            <Icon name="check-circle" color={this.state.cashPay ? "green" : "#ff8834"} size={25}  onPress={() => this.setState({
                                cashPay: true,
                                creditPay: false
                            })}></Icon>


                        </View>



                    </View>
                
            
                :
                    null
                }

                {this.state.Pay?
                
                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "80%" }}>

                        <View style={{flex:1}}>

                            <Icon color="#ff8834" name="credit-card" size={25} ></Icon>

                        </View>

                        <View style={{flex:4}}>

                        <Text color="#ff8834">Tarjeta de crédito / débito </Text>

                        </View>

                        <View style={{flex:1}}>
                            <Icon name="check-circle" color={this.state.creditPay ? "green" : "#ff8834"} size={25}  onPress={() => this.setState({
                                cashPay: false,
                                creditPay: true
                            })}></Icon>

                        </View>


                    </View>
                :
                    null
                }

                {this.state.Pay?
                
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
                {this.state.Pay?
                
                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "90%" }}>
                        <Text>Agregar método de pago</Text>
                    </View>
                :
                    null
                }

                {/* Fin de bloque */}

                {/* Estado En camino */}
                {this.state.Onway?
                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "60%" }}>
                        <View style={{flex:2.5}}></View>
                        <View style={{flex:1}}>
                            <Icon color="#ff8834" name="chevron-up"
                                style={{alignSelf:"center", paddingTop:5}}
                                size={30}
                                onPress={() => this.props.navigation.navigate("InfoTravel", { typeTravel: "Travel_Integrado", timeArrival: this.state.timeChofer, Arrival: this.state.routeChoferDestino})}

                            ></Icon>
                        </View>
                        <View style={{flex:2.5}}></View>

                    </View>
                :
                    null
                }

                {this.state.showOnway ?
                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "65%" }}>
                  
                        <Text style={{fontWeight:"bold", fontSize:14, alignSelf:"center"}}>Tu conductor está en camino, espera un momento</Text>
                          

                    </View>
                    :
                    null
                }


                {this.state.Onway ?
                    <View style={{ flexDirection: "row", position: "absolute", top: "68%", backgroundColor:"black", width:"100%" }}>

                        <View style={{ flex:1 }}></View>

                        <View style={{flex:4}}>

                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 12, alignSelf: "center" }}>Verifica la matricula y los detalles del auto</Text>

                        </View>

                        <View style={{ flex: 1 }}></View>

                    </View>
                    :
                    null
                }

                {this.state.Onway?
                
                    < View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "71%" }}>
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={require("./../assets/user.png")}
                        ></Image>
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={require("./../assets/Auto.png")}
                        ></Image>
                        <View style={{paddingLeft:120}}>
                            <Text>{keys.datos_vehiculo.modelo}</Text>
                            <Text style={{fontWeight:"bold", fontSize:16}}>{keys.datos_vehiculo.Matricula}</Text>
                            <Button color="#ff8834" title="Cancelar"
                                onPress={() => this.setState({
                                    showModalCancel:true
                                })}
                            ></Button>

                        </View>
                    </View>
                :
                    null
                }

                {this.state.Onway?
                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "85%"}}>

                        <Text >{keys.datos_chofer.nombreChofer}<Text>*{keys.datos_chofer.Estrellas}</Text> <Icon name="star"></Icon> <Text>* {keys.datos_chofer.Reconocimientos}</Text></Text>


                    </View>
                :
                    null
                }

        

                {this.state.Onway?

                    <View style={{ flexDirection: "row", position: "absolute", left: "3%", top: "90%" }}>

                        <View style={{flex:2}}></View>
                        <View style={{flex:1}}>
                            
                            <Icon color="#ff8834" name="phone" onPress={() => this.callPhoneFunction()} size={30} onPress={() => this.callPhoneFunction()}></Icon>

                        </View>
                        <View style={{flex:1}}>

                            <Icon name="comment-dots"
                                color="#ff8834"
                                // style={{ paddingLeft: 40 }}
                                size={30}
                                onPress={() => this.Chat()}
                            ></Icon>

                        </View>
                        <View style={{flex:2}}></View>
                        
                       
                    </View>
                :
                    null
                }



                {/* Fin del bloque */}
            </View>
            

  
        
        );
    }
}
// Estilos de Travel_Integrado
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
