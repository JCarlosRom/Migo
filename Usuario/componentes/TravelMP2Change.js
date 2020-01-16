import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Modal from "react-native-modal";
import { StackActions, NavigationActions } from 'react-navigation';
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, {Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { ScrollView } from "react-native-gesture-handler";
import MapViewDirections from 'react-native-maps-directions';
import * as Location from "expo-location";
import axios from 'axios';
import keys from "./global";
import * as Permissions from 'expo-permissions';
import call from 'react-native-phone-call'



const GOOGLE_MAPS_APIKEY = 'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY';
export default class TravelMP2Change extends Component {
    state = {

        myPosition: {
            latitude: 0,
            longitude: 0,

        },

        positionChofer:{
            latitude:0,
            longitude:0
        },

        region: {
            latitude: 0,
            longitude: 0,
            longitudeDelta: 0,
            latitudeDelta: 0

        },
        showBackButton: true,
        Home:true,
        showEstimations:false,
        helperPay:false,
        Pay:false,
        Onway:false,
        showModalCancel:false,
        showModalCancelAcept:false,
        showModalLlegada:false,
        showModal: false,
        Descripcion: "",
        showTimeChofer: false,
        location:null,
        timeChofer: 0,
        distance:0,
        duration:0,

        Express_Estandar:{
            categoria_servicio: 0,
            nombre_categoria: "",
            out_costo_viaje: 0
        },
        Express_Lujo:{
            categoria_servicio: 0,
            nombre_categoria: "",
            out_costo_viaje: 0
        },
        Pool_Estandar:{
            categoria_servicio: 0,
            nombre_categoria: "",
            out_costo_viaje: 0
        },
        Pool_Lujo:{
            categoria_servicio: 0,
            nombre_categoria: "",
            out_costo_viaje: 0
        },
        isNextVehicles:true,
        routeParada1: false,
        routeParada2: false, 
        routeParada3:false,
        cashPay:true,
        creditPay:false,
        infoVehicleTipo:"",
        infoVehicleLlegada:"",
        infoVehicleTarifa:0,
    };

    constructor(props) {
        super(props);
        
        // Socket para designar el punto de encuentro 
        keys.socket.on('puntoEncuentroUsuario', (num) => {
            this.setState({
                ConductorMapDirection:false,
                routeParada1: true,
                showModalLlegada:true,
                showTimeChofer: false
            })
            
         
    
        })

        keys.socket.on('segundaParadaUsuario', (num) => {
            this.setState({
                ConductorMapDirection: false,
                routeParada1: false,
                routeParada2: true,
            
            })

            console.log("segundaParada");



        })

        keys.socket.on('terminarViajeUsuario', (num) => {
            // console.log('terminarViajeUsuario');
            keys.Chat = [];
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "terminarViaje" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);

        })

        // Cancelación de viaje desde chófer
        keys.socket.on("cancelViajeUsuario", num => {
            keys.Chat = [];
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicioUsuario" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);
        })
    
        // Aqui se acepta el recorrido
        keys.socket.on('recorrido_id_usuario', num => {
            // console.log('Llego respuesta: ', num);
            this.state.id_recorrido = num;
            this.setState({

            });

            // alert('EL conductor acepto tu solicitud, espera a tu chofer ');
            // Desactivar animación 
            // this.fleet_usuario_chofer();
        });
        // Recepción de la información del chofer cuando se acepta la solicitud
        keys.socket.on('conductor_sendInfo', num => {

            var d = new Date(); // get current date
            d.setHours(d.getHours(), d.getMinutes() + 3, 0, 0);
            keys.HoraServicio = d.toLocaleTimeString()

            console.log("Hora", keys.HoraServicio);
            // console.log(num);
            this.setState({
                showBackButton: false
            })

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
                ConductorMapDirection:true,
                showEstimations: false,
                Home: false,
                routeParada1: false,
                routeParada2: false,
                routeParada3: false,
                showTimeChofer: true
            })

            // this.fleet_usuario_chofer();
          
        });

        // Recepción de la información del chofer cuando se acepta la solicitud
        keys.socket.on('conductor_sendInfoChange', num => {
            console.log('conductor_sendInfo2');


            this.setState({
                showBackButton: false,
                showModalAcept: true,
                DescripcionAcept: "Direcciones actualizadas"
            })


            keys.datos_chofer = {
                idChofer: num.datos_chofer.idChofer,
                nombreChofer: num.datos_chofer.nombreChofer,
                Estrellas: num.datos_chofer.Estrellas,
                Reconocimientos: num.datos_chofer.Reconocimientos,
                Telefono: num.datos_chofer.Telefono
            }

            keys.datos_vehiculo = {
                id_unidad: num.datos_vehiculo.id_unidad,
                modelo: num.datos_vehiculo.modelo,
                Matricula: num.datos_vehiculo.Matricula,
                tipoVehiculo: num.datos_vehiculo.tipoVehiculo,
                categoriaVehiculo: num.datos_vehiculo.categoriaVehiculo,
            }

            this.setState({
                positionChofer: {
                    latitude: num.chofer_latitud,
                    longitude: num.chofer_longitud
                }
            })

            keys.id_chofer_socket = num.id_chofer_socket;



            this.setState({
                Onway: true,
                ConductorMapDirection: true,
                showEstimations: false,
                Home: false,
                showTimeChofer: true
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

            console.log("Posición del chófer", this.state.positionChofer);
        
        });
        // Timer para transmitir coordenadas del usuario
        let timer_coordenadasUsuario = setInterval(() => {

            this.findCurrentLocationAsync();

            if (this.state.location != null) {

                keys.socket.emit('coordenadas_usuario', {
                    coordenadas: this.state.location.coords, id_chofer: keys.id_chofer,
                    datos_chofer: keys.datos_chofer, datos_vehiculo: keys.datos_vehiculo
                });
            }

        }, 10000);
        this.setState({ timer_coordenadasUsuario });

        // Socket para hacer el tracking del chofer
        keys.socket.on('ConductorDisponible', num => {
            this.setState({
                showModal: true,
                Descripcion: num.Msg,
            })
        });


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

    callPhoneFunction() {
        const args = {
            number: keys.datos_chofer.Telefono, // String value with the number to call
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

                if (element["categoria_servicio"] == keys.categoriaVehiculo) {

                    this.setState({

                        infoVehicleTarifa: parseInt(element["out_costo_viaje"])

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

    onRegionChange = async region => {
        latitude = region.latitude;
        longitude = region.longitude;
        latitudeDelta = region.latitudeDelta;
        longitudeDelta = region.longitudeDelta;

        this.setState({
            region
        });


    }

    cancelarServicio() {

        var d = new Date(); // get current date
        d.setHours(d.getHours(), d.getMinutes(), 0, 0);
        horaActual = d.toLocaleTimeString()

        console.log("Hora Actual", horaActual);
        console.log("Hora Servicio", keys.HoraServicio);

        if (horaActual < keys.HoraServicio) {
        
            keys.Chat = [];
            this.setState({
    
                showModalCancel: false,
                showModalCancelAcept: true
    
            })
    
            keys.socket.emit("cancelaUsuario", { id: keys.id_servicio })
    
            keys.socket.emit('cancelViajeUsuario', { id_chofer_socket: keys.id_chofer_socket });
    
    
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicio" } })],
                key: undefined
            });
    
            this.props.navigation.dispatch(resetAction);
        }else{
            this.setState({
                showModalCancel: false,
                showModal: true,
                Descripcion: "No se puede cancelar servicio después de 3 minutos de iniciar el servicio"
            })
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


    generarSolicitud = () => {
        
        usuario_latitud = this.state.myPosition.latitude;
        usuario_longitud = this.state.myPosition.longitude;
        datos_usuario = keys.datos_usuario;
        infoTravel = keys.travelInfo;
        type = keys.type;
        keys.id_usuario_socket = keys.socket.id;
        id_chofer_socket = keys.id_chofer_socket;
        Tarifa = this.state.infoVehicleTarifa;
        Distancia = this.state.distance,
            Tiempo = this.state.duration

        keys.Tarifa.Total = Tarifa;

        keys.socket.emit('changeDestino', {
            usuario_latitud: usuario_latitud, usuario_longitud: usuario_longitud,
            datos_usuario: datos_usuario, infoTravel: infoTravel, Paradas: keys.Paradas, type: type,
            id_usuario_socket: keys.id_usuario_socket, categoriaVehiculo: keys.categoriaVehiculo,
            tipoVehiculo: keys.tipoVehiculo, tipoServicio: keys.tipoServicio, Tarifa: Tarifa,
            Distancia: Distancia, Tiempo: Tiempo, id_chofer_socket: id_chofer_socket

        });

        keys.socket.removeAllListeners("conductor_sendInfo");

        this.setState({
            ConductorMapDirection:true, 
            routeParada1:false,
            routeParada2:false
        })
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

        console.log("TravelMP2");

      
        // Generar las coordenadas por medio del nombre de la ubicación recibida
        let primeraParada = await Location.geocodeAsync(keys.travelInfo.puntoPartida.addressInput);
        let Parada1 = await Location.geocodeAsync(keys.travelInfo.Parada1);
        let Parada3 = await Location.geocodeAsync(keys.travelInfo.Parada3);


        // Asignar la posición del usuario en cuanto a su punto de partida
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

        Paradas = []


        // Ordenamiento de las paradas con su correspondiente número de parada
        if (keys.Paradas.Parada1 == "1") {

            Parada1Info = { latitude: Parada1[0]["latitude"], longitude: Parada1[0]["longitude"], numParada: keys.Paradas.Parada1, Direccion: keys.travelInfo.Parada1 }

            this.setState({
                routeParada1: true
            })

        } else {

            if (keys.Paradas.Parada1 == "2") {

                Parada2Info = { latitude: Parada1[0]["latitude"], longitude: Parada1[0]["longitude"], numParada: keys.Paradas.Parada1, Direccion: keys.travelInfo.Parada1 }

                this.setState({
                    routeParada2: true
                })

            }
        }




        if (keys.Paradas.Parada3 == "1") {

            Parada1Info = { latitude: Parada3[0]["latitude"], longitude: Parada3[0]["longitude"], numParada: keys.Paradas.Parada3, Direccion: keys.travelInfo.Parada3 }

            this.setState({
                routeParada1: true
            })
        } else {

            if (keys.Paradas.Parada3 == "2") {

                Parada2Info = { latitude: Parada3[0]["latitude"], longitude: Parada3[0]["longitude"], numParada: keys.Paradas.Parada3, Direccion: keys.travelInfo.Parada1 }

                this.setState({
                    routeParada2: true
                })
            }
        }

        // Anexo de las paradas al array de Paradas, ya ordenadas
        Paradas.push(Parada1Info);
        Paradas.push(Parada2Info);


        this.setState({

            Paradas

        })
        
        keys.Paradas= this.state.Paradas;

     
        
    
    }


    static navigationOptions = {
        title: "Viaje",
        headerLeft: null

    };




    setModalAceptCancel(visible) {

        this.setState({ ModalAceptCancel: visible });
        
        this.setState({ ModalCancel: !visible });

    }
    
    showInfoVehicle(typeVehicle){

        var d = new Date(); // get current date
        d.setHours(d.getHours(), d.getMinutes() + this.state.duration, 0, 0);
    
    
        if(typeVehicle=="Express Estandar"){
            this.setState({
                infoVehicleTipo: "Express Estandar",
                infoVehicleLlegada: d.toLocaleTimeString(),
                infoVehicleTarifa: this.state.Express_Estandar.out_costo_viaje
            })
            // Express
            keys.tipoServicio = 1;
            // Estandar
            keys.tipoVehiculo = 1;


        }else{
            if(typeVehicle=="Express Lujo"){
                this.setState({
                    infoVehicleTipo: "Express Lujo",
                    infoVehicleLlegada: d.toLocaleTimeString(),
                    infoVehicleTarifa: this.state.Express_Lujo.out_costo_viaje
                })

                // Express
                keys.tipoServicio = 1;
                // Lujo
                keys.tipoVehiculo = 2;
            }else{
                if(typeVehicle=="Pool Estandar"){
                    this.setState({
                        infoVehicleTipo: "Pool Estandar",
                        infoVehicleLlegada: d.toLocaleTimeString(),
                        infoVehicleTarifa: this.state.Pool_Estandar.out_costo_viaje
                    })

                    // Pool
                    keys.tipoServicio = 2;
                    // Estandar
                    keys.tipoVehiculo = 1;

                }else{
                    if(typeVehicle=="Pool Lujo"){
                        this.setState({
                            infoVehicleTipo: "Pool Lujo",
                            infoVehicleLlegada: d.toLocaleTimeString(),
                            infoVehicleTarifa: Pool_Lujo.out_costo_viaje
                        })

                        // Pool
                        keys.tipoServicio = 2;
                        // Lujo
                        keys.tipoVehiculo = 2;
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

        keys.socket.removeAllListeners("chat_usuario");
        this.props.navigation.navigate("Chat")
    }

 
    render() {
        return (

            <ScrollView>
                <View style={styles.container}>


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
                    {this.state.showBackButton ?

                        <View style={styles.area}>
                            <View style={{ flex: 1 }}>
                                <Icon
                                    name="arrow-left"
                                    color="#ff8834"
                                    size={25}
                                    onPress={() => this.props.navigation.navigate("Home")}
                                ></Icon>
                            </View>

                        </View>
                        :
                        null
                    }

                    {this.state.showTimeChofer ?
                        <View style={{ flexDirection: "row", backgroundColor: "#fff" }}>
                            <View style={{ flex: 1, backgroundColor: "#EFEEEC" }}></View>
                            <View style={{ backgroundColor: "black", flex: 3, height: 20 }}>
                                <Text style={{ color: "white" }}>Llegada: {this.state.timeChofer} Minuto(s)</Text>
                            </View>
                            <View style={{ flex: 3, backgroundColor: "#EFEEEC" }}></View>
                        </View>

                        :
                        null
                    }

                    {/* Modal para la cancelación del servicio */}

                   
                    <View > 

                        <Modal
                            isVisible={this.state.showModalCancel}

                        >   
                            <View style={{ marginTop: 22, backgroundColor: "#fff"}}>
                                <View>
                                    <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}>Cancelación de servicio</Text>
                                    <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10 }}>¿Está seguro de cancelar el servicio de taxi?</Text>
                                    <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10, textAlign:"justify" }}>Recuerde que si supera x minutos después de haber</Text>
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
                                            title="No"
                                            buttonStyle={{
                                                backgroundColor: "#ff8834"
                                            }}
                                            onPress={() => this.setState({
                                                showModalCancel: false
                                            })}


                                        ></Button>
                                      
                                    </View>

                                    <View style={{ flex:1, paddingLeft:5 }}>

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

                    {/* Modal para la confirmación de llegada del conductor  */}
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

                    {this.state.region.latitude != 0 && this.state.region.longitude != 0 && this.state.region.latitudeDelta != 0 && this.state.region.longitudeDelta != 0 ?

                        <View style={styles.containerMap}>
                            <MapView

                                style={styles.map}

                                region={{
                                    latitude: this.state.region.latitude,
                                    longitude: this.state.region.longitude,
                                    latitudeDelta: this.state.region.latitudeDelta,
                                    longitudeDelta: this.state.region.longitudeDelta,
                                }}

                                onRegionChangeComplete={this.onRegionChange}

                                showsUserLocation={true}
                                showsMyLocationButton={true}
                            >
                

                                <Marker
                                    coordinate={{
                                        latitude: this.state.myPosition.latitude,
                                        longitude: this.state.myPosition.longitude,
                                    }}

                                >
                                    <Icon name="map-pin" size={20} color="green"></Icon>
                                </Marker>

                                {this.state.Paradas!=null?
                                
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

                                {this.state.Paradas != null ?

                                    <Marker
                                        coordinate={{
                                            latitude: this.state.Paradas[1]["latitude"],
                                            longitude: this.state.Paradas[1]["longitude"],
                                        }}

                                    >
                                        <Icon name="map-pin" size={20} color="blue"></Icon>
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
                            



                                {this.state.ConductorMapDirection && this.state.positionChofer.latitude != 0 && this.state.positionChofer.longitude != 0
                                && this.state.myPosition.latitude != 0 && this.state.myPosition.longitude != 0 ?
                                    <MapViewDirections


                                        destination={{
                                            latitude: this.state.positionChofer.latitude,
                                            longitude: this.state.positionChofer.longitude,
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
                                                timeChofer: parseInt(result.duration),
                                                distance: parseInt(result.distance),
                                                duration: parseInt(result.duration)

                                            });

                                            this.getTarifas();


                                        }}

                                    />

                                    :
                                    null
                                }

                                {
                                    this.state.Paradas!=null?

                                        this.state.routeParada1 && this.state.Paradas[0]["latitude"] != 0 
                                        && this.state.Paradas[0]["longitude"] != 0 ?
            
                                            <MapViewDirections
            
            
                                                destination={{
                                                    latitude: this.state.Onway ? this.state.positionChofer.latitude : this.state.myPosition.latitude,
                                                    longitude: this.state.Onway ? this.state.positionChofer.longitude : this.state.myPosition.longitude
                                                }}
                                                origin={{
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

                                        this.state.routeParada2 && this.state.Paradas[1]["latitude"] != 0 
                                            && this.state.Paradas[1]["longitude"] != 0?

                                            <MapViewDirections


                                                destination={{
                                                    latitude: this.state.Onway ? this.state.positionChofer.latitude : this.state.Paradas[0]["latitude"],
                                                    longitude: this.state.Onway ? this.state.positionChofer.longitude : this.state.Paradas[0]["longitude"]
                                                }}
                                                origin={{
                                                    latitude: this.state.Paradas[1]["latitude"],
                                                    longitude: this.state.Paradas[1]["longitude"],
                                                }}
                                                apikey={GOOGLE_MAPS_APIKEY}
                                                strokeWidth={1}
                                                strokeColor="orange"
                                                onReady={result => {
                                                    this.setState({
                                                        distance: this.state.distance + parseInt(result.distance),
                                                        duration: this.state.duration + parseInt(result.duration)

                                                    })
                                                    
                                                    this.getTarifas();

                                                }}

                                            />

                                            :
                                            null


                                        :

                                        null
                                }

  


                                
                    
                                
                            
                            </MapView>
                        </View>
                    :
                        null
                    }   
                   

                    


                    {this.state.Onway?
                        <View>
                            <View styles={styles.area}>
                                <Icon color="#ff8834" name="chevron-up"
                                style={{alignSelf:"center", paddingTop:5}}
                                size={30}
                                    onPress={() => this.props.navigation.navigate("InfoTravel", { typeTravel: "TravelMP", timeArrival: this.state.timeChofer, Arrival: this.state.routeChoferDestino })}
                              
                                ></Icon>

                            </View>
                            <View styles={styles.area}>
                                <Text style={{fontWeight:"bold", fontSize:14, alignSelf:"center"}}>Tu conductor está en camino, espera un momento</Text>
                            </View>
                            <View
                            style={
                                {
                                    backgroundColor:"black",
                                }}
                            >
                                <Text style={{ color: "white", fontWeight: "bold", fontSize: 14, alignSelf:"center"}}>Verifica la matricula y los detalles del auto</Text>
                            </View>

                            <View style={styles.area}>
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
                        
                            <View style={{ alignSelf: "center", backgroundColor:"white" }}>
                                <Text >{keys.datos_chofer.nombreChofer}<Text>*{keys.datos_chofer.Estrellas}</Text> <Icon name="star"></Icon> <Text>* {keys.datos_chofer.Reconocimientos}</Text></Text>
                            </View>

                            <View style={styles.area}>
                                <Icon color="#ff8834" name = "phone" onPress={()=>this.callPhoneFunction()} size={30}></Icon>
                                <View style={{paddingLeft:10}}></View>
                                <Icon name="comment-dots"
                                    color="#ff8834"
                                    style={{ paddingLeft: 40 }}
                                    size={25}
                                    onPress={() => this.Chat()}
                                ></Icon>
                                  
                            </View>

                


                        </View>

                
                    :
                        <View style={{ backgroundColor: "#fff", paddingTop: 50 }}>
                            <Button title="Confirmar"
                                style={{ width: '100%' }}
                                type="outline"
                                onPress={() => this.generarSolicitud()}
                            ></Button>
                        </View>
                    }
                 
                    
                 

                

                </View>
            


            </ScrollView>
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
