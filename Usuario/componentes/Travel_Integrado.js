import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
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

const GOOGLE_MAPS_APIKEY = 'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY';
export default class Travel_Integrado extends Component {
   

    constructor(props) {

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


            Home: true,
            showEstimations: false,
            helperPay: false,
            Pay: false,
            Onway: false,
            showModalCancel: false,
            showModalCancelAcept: false,
            showModalLlegada:false, 
            location: null,

            distance: 0,
            duration: 0,

            Express_Estandar: {
                categoria_servicio: 0,
                nombre_categoria: "",
                out_costo_viaje: 0
            },
            Express_Lujo: {
                categoria_servicio: 0,
                nombre_categoria: "",
                out_costo_viaje: 0
            },
            Pool_Estandar: {
                categoria_servicio: 0,
                nombre_categoria: "",
                out_costo_viaje: 0
            },
            Pool_Lujo: {
                categoria_servicio: 0,
                nombre_categoria: "",
                out_costo_viaje: 0
            },
            isNextVehicles: true,
            routeParada1: true,
            routeChoferDestino: false,
            cashPay: true,
            creditPay: false,
            infoVehicleTipo: "",
            infoVehicleLlegada: "",
            infoVehicleTarifa: 0,
            timer_coordenadasUsuario: null,

        };
    
 

        // Socket para designar el punto de encuentro 
        keys.socket.on('puntoEncuentroUsuario', (num) => {

            this.setState({
                ConductorMapDirection:false,
                routeParada1:false,
                routeChoferDestino:true,
                showModalLlegada:true
            })
            

    
        })
    
        // Aqui se acepta el recorrido
        keys.socket.on('recorrido_id_usuario', num => {
            console.log('Llego respuesta: ', num);
            // this.state.id_recorrido = num;
            // this.setState({

            // });
            keys.id_servicio = num.servicio;
            keys.id_recorrido = num.recorrdio;

            console.log("idServicio", keys.id_servicio);
            console.log("idRecorrido", keys.id_recorrido);

            // alert('EL conductor acepto tu solicitud, espera a tu chofer ');
            // Desactivar animación 
        
        });
        // Recepción de la información del chofer cuando se acepta la solicitud
        keys.socket.on('conductor_sendInfo', num => {
            console.log('conductor_sendInfo');

            keys.datos_chofer={
                idChofer: num.datos_chofer.idChofer,
                nombreChofer: num.datos_chofer.nombreChofer,
                Estrellas: num.datos_chofer.Estrellas,
                Reconocimientos: num.datos_chofer.Reconocimientos
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
                Home: false
            })

      
          
        });

        // Socket para hacer el tracking del chofer
        keys.socket.on('seguimiento_chofer', num => {

            console.log(num.coordenadas_chofer);
   
            this.setState({
                positionChofer:{
                    latitude: num.coordenadas_chofer.latitude, 
                    longitude: num.coordenadas_chofer.longitude
                }
            })

            console.log("USUARIO: Posición del chófer", this.state.positionChofer);
        
        });
    

        // Socket para hacer el tracking del chofer
        keys.socket.on('ConductorDisponible', num => {
            alert(num.Msg);
        });

        // Socket para terminar el viaje
        keys.socket.on('terminarViajeUsuario', num => {
           

            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "terminarViaje" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);
        });

        keys.socket.on("cancelViajeUsuario", num =>{
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicioUsuario" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);
        })

        keys.socket.on('statusChofer', num => {

            alert(num.Msg);

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



    fleet_usuario_chofer = () => {
        let timer_2 = setInterval(() => {
            this.findCurrentLocationAsync();
            if(this.state.location!=null){

                keys.socket.emit('room_usuario_chofer', 
                    {id_socket_usuario: keys.id_usuario_socket, id_chofer_socket: keys.id_chofer_socket, 
                        coordenadas_usuario: { latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude } });
            }

        }, 5000);
        this.setState({ timer_2 });
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
                        }
                     
                    })
                }
                if (element["categoria_servicio"] == 2) {
                    
                    this.setState({
                        Express_Lujo: {
                            categoria_servicio: element["categoria_servicio"],
                            nombre_categoria: element["nombre_categoria"],
                            out_costo_viaje: parseInt(element["out_costo_viaje"]),
                        }
                    })
                }

                if (element["categoria_servicio"] == 3) {
                    
                    this.setState({
                        Pool_Estandar: {
                            categoria_servicio: element["categoria_servicio"],
                            nombre_categoria: element["nombre_categoria"],
                            out_costo_viaje: parseInt(element["out_costo_viaje"]),
                        }
                    })
                }

                if (element["categoria_servicio"] == 4) {
                   
                    this.setState({
                        Pool_Lujo: {
                            categoria_servicio: element["categoria_servicio"],
                            nombre_categoria: element["nombre_categoria"],
                            out_costo_viaje: parseInt(element["out_costo_viaje"]),
                        } 
                    })
                }
            });
        } catch (e) {
            console.log(e);
            alert("Servicio no disponible, Intente más tarde", "Error");
        }
    }

    generarSolicitud = () => {
        usuario_latitud = this.state.myPosition.latitude;
        usuario_longitud = this.state.myPosition.longitude;
        datos_usuario = keys.datos_usuario;
        infoTravel= keys.travelInfo;
        type= keys.type;
        keys.id_usuario_socket= keys.socket.id;
        Tarifa = this.state.infoVehicleTarifa;
        Distancia= this.state.distance,
        Tiempo= this.state.duration
        
        keys.Tarifa= Tarifa; 

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

        console.log("Travel Integrado");

        let primeraParada = await Location.geocodeAsync(keys.travelInfo.puntoPartida.addressInput);
        
        

        this.setState({
            myPosition: {

                latitude: primeraParada[0]["latitude"],
                longitude: primeraParada[0]["longitude"]

            },
            region: {
                latitude: primeraParada[0]["latitude"],
                longitude: primeraParada[0]["longitude"],
                longitudeDelta: 0.0105,
                latitudeDelta: 0.0105

            },

        });

        console.log(this.state.region);

      
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


    static navigationOptions = {
        title: "Viaje"
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

    onRegionChange = async region => {
        latitude = region.latitude;
        longitude = region.longitude;
        latitudeDelta = region.latitudeDelta;
        longitudeDelta = region.longitudeDelta;

        this.setState({
            region
        });


    } 

    cancelarServicio(){
        this.setState({
            
            showModalCancel: false,
            showModalCancelAcept: true
            
        })

        keys.socket.emit('cancelViajeUsuario',{id_chofer_socket: keys.id_chofer_socket});


        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicio" } })],
            key: undefined
        });

        this.props.navigation.dispatch(resetAction);
    }

 
    render() {
        return (

            <ScrollView>
                <View style={styles.container}>

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
                                            onPress={() => this.setState({
                                                showModalCancel: false
                                            })}


                                        ></Button>
                                      
                                    </View>

                                    <View style={{ flex:1, paddingLeft:5 }}>

                                        <Button
                                            title="Si"
                                            onPress={() => this.cancelarServicio()}
                                        ></Button>

                                   
                                    </View>
                                    <View style={{ flex: 2 }}></View>
                                </View>
                            </View>

        
                        </Modal>

                    </View>

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

                  
                    {this.state.region.latitude != 0 && this.state.region.longitude != 0 && this.state.region.latitudeDelta != 0 && this.state.region.longitudeDelta != 0 ?
                        
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
                            
                                {this.state.ConductorMapDirection ?
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

                                        this.state.routeParada1?
            
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

                                        this.state.routeChoferDestino ?

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
                        </View>

                    :
                        null
                    }

                    {this.state.showEstimations?
                        <View>

                            <View style={styles.areawrow}>
                            
                                <Icon name="car-side" color="#ff8834" size={30} style={{ alignSelf: "center", paddingTop:5 }}></Icon>
                            
                            </View>

                        

                            <View style={styles.area}>
                        
                                <View>
                                    <Text>{this.state.infoVehicleTipo} <Icon name="info-circle" color="#ff8834" size={18}
                                    onPress={() => this.props.navigation.navigate("DesgloseTarifa")}
                                    ></Icon> </Text>
                                    <Text> {this.state.infoVehicleLlegada}</Text>
                                </View>

                                <View style={{paddingLeft:120}}>
                                    <Text> MX$ {this.state.infoVehicleTarifa}</Text>
                                </View>
                            
                            </View>
                

                            <View style={styles.area}>
                                <Icon color="#ff8834" name={this.state.cashPay ? "money-bill-alt" :"credit-card"} size={30} onPress={() => this.showPay() }></Icon>

                                <Text color="#ff8834" style={{ fontWeight: "bold", paddingLeft: 10, paddingTop: 5 }}>{this.state.cashpay? "Efectivo" : "Tarjeta de Crédito / débito"}</Text>
                                
                                <Icon color="#ff8834" style={{ paddingLeft: 10, paddingTop: 5 }} name="chevron-down" size={20} onPress={() => this.showPay()}></Icon>

                            </View>
                            {!this.state.Pay?
                            
                                <View >
                                    <Button title={"Confirmar ",this.state.infoVehicleTipo }
                                        style={{ width: '100%' }}
                                        type="outline" 
                                        onPress={()=>this.generarSolicitud()}
                                        ></Button>
                                </View>
                            :
                                null
                            }
                            
                    
                        </View>
                        
                    :
                        null
                    }

                    {this.state.Home?



                    <View>

                        <View style={styles.area}>
                            <Text style={{fontWeight:"bold", fontSize:16}}>{
                                this.state.isNextVehicles?
                                    "YiMi Express"
                                :
                                "YiMi Pool"
                            }</Text>
                        </View>
                     
                        <View style={styles.area}>

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
                        


                            <View style={styles.area}>
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
                       
                            
                    
                    </View>
                    :
                        null
                    }


                    {this.state.Pay?
                        <View>
                            <View style={styles.area}>
                                <Text style={{fontSize:16, fontWeight:"bold"}}> Método de pago</Text>

                                {this.state.showEstimations?
                                
                                    <Icon color="#ff8834" style={{ paddingLeft: 135, paddingTop: 5 }} name="chevron-left" size={20} onPress={() => this.closePay()}></Icon>
                                :
                                    <Icon color="#ff8834" style={{ paddingLeft: 135, paddingTop: 5 }} name="chevron-left" size={20} onPress={() => this.closePay()}></Icon>
                                }

                                
                            </View>

                            <View style={styles.area}>

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



                            <View style={styles.area}>

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

                            <View style={styles.area}>
                                <Icon color="#ff8834" name="cc-visa" size={25} ></Icon>

                                <Text style={{ paddingLeft: 10 }}> **** **** **** 1254 </Text>

                                <Icon name="check-circle" color={this.state.creditPay ? "green" : "#ff8834"} size={25} style={{ paddingLeft: 45 }} onPress={() => this.setState({
                                    cashPay: false,
                                    creditPay: true
                                })}></Icon>


                            </View>

                            <View style={styles.area}>
                                <Text>Agregar método de pago</Text>
                            </View>

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
                                onPress={() => this.props.navigation.navigate("InfoTravel")}
                              
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
                                <Icon color="#ff8834" name="phone" size={30}></Icon>
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
                        null
                    }
                 
                    
                 

                

                </View>
            


            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
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
