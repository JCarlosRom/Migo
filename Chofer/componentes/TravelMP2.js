import React, { Component } from "react";
import { View, Text, StyleSheet, Switch, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { Button  } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker, AnimatedRegion } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import axios from 'axios';
import { StackActions, NavigationEvents, NavigationActions } from 'react-navigation';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions';
import keys from './global';
import * as Location from "expo-location";
import * as Permissions from 'expo-permissions';

export default class TravelMP2 extends Component {
    constructor(props) {

        keys.socket.on('isConnected', () => { })
        
        super(props);
         this.state = {
            id_usuario: "2",
            puntoEncuentro:false,
            HomeTravel:true,
            aceptViaje:false,
            initravel:false,
            Travel: false,
            showMapDirections:false,
            positionUser: null,
        
            latitude: 19.273247,
            longitude: -103.715795,
            myPosition:null,
            distance:0,
            duration:0,
            routeInitial: true,
            routeParada1: false,
            routeParada2: false,
            routeParada3: false,
            location:null,
             region: {
                 latitude: 0,
                 longitude: 0,
                 longitudeDelta: 0,
                 latitudeDelta: 0

             },
            timerAceptViaje: 15,
            intervaltimerAceptViaje: null,
    

        };

        keys.socket.on('chat_chofer', (num) => {

            console.log("chat_chofer", num)

            keys.Chat.push(num.Mensaje);

            alert("Te llegó un mensaje");

        })

        keys.socket.on('cancelViajeChofer', () => {

            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home', params: { Flag: "CancelarServicio" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);

        })
        // Bloque de cuenta regresiva de aceptar viaje de chófer 
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
        
    };

    
    



    async componentWillMount() {
        
        console.log(keys.travelInfo);

        // Check my current position
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permisos denegados por el usuario'
            });
        }

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
                    longitudeDelta: 0.0105,
                    latitudeDelta: 0.0105

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
            alert("No hay conexión al web service", "Error");
        }

        


        Paradas =[];


        Paradas.push(keys.travelInfo.Parada1)

        this.setState({
            Paradas
        })

        // this.chofer_setPosition();

        console.log('Paradas',Paradas);
        
        
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


    Go = () => {

        coordinates = {
            latitude: 0,
            longitude: 0
        }

        if(this.state.aceptViaje==true){

            coordinates = {
                latitude: this.state.positionUser.latitude,
                longitude: this.state.positionUser.longitude
            }
            
        }

        if(this.state.Travel==true && this.state.routeParada2==false){
            coordinates={
                latitude: keys.travelInfo.Parada1.latitude,
                longitude: keys.travelInfo.Parada1.longitude,
            }
        }
        
        if (this.state.routeParada2==true){
            coordinates = {
                latitude: keys.travelInfo.Parada2.latitude,
                longitude: keys.travelInfo.Parada2.longitude,
            }
        }
            
       




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
    }

    static navigationOptions = {
        title: "Viaje"
    };

    puntoEncuentro(){
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


    }


   
    terminarViaje(){

        this.props.navigation.navigate("Pago");

        // Socket de punto de encuentro, socket puntoEncuentroUsuario
        keys.socket.emit("terminarViajeChofer", {
            id_usuario_socket: keys.id_usuario_socket
        });

    }

    cancelViaje() {

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

    onRegionChange = async region => {


        this.setState({
            region
        });


    } 

    primeraParada(){
        this.setState({
            routeInitial: false,
            routeParada1: true,
            routeParada2: false,
            routeParada2: false
        })


    }

    segundaParada(){


        Paradas = [];


        Paradas.push(keys.travelInfo.Parada2)

        this.setState({
            Paradas
        })

        this.setState({
            routeInitial: false,
            routeParada1: false,
            routeParada2: true,
 
        })

           // Socket de segunda parada
        keys.socket.emit("segundaParada", {
            id_socket_usuario: keys.id_usuario_socket
        });
    }


 
  

    render() {
        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.container}>
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

                                <View style={{ flex: 2, marginBottom: 5 }}>
                                    <Button
                                        title="No Cancelar"
                                        type="outline"
                                        titleStyle={{ color: "black", fontSize: 6 }}
                                        onPress={() => this.setState({
                                            showModalCancel: false
                                        })}

                                    ></Button>

                                </View>
                                <View style={{ flex: 2, marginBottom: 5, marginRight: 5 }}>

                                    <Button
                                        title="Cancelar"
                                        type="outline"
                                        titleStyle={{ color: "black", fontSize: 6 }}
                                        onPress={() => this.cancelViaje()}

                                    ></Button>

                                </View>
                            </View>


                        </Modal>

                    </View>
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
                                    <Text>{keys.nombreUsuario}</Text>
                                </View>
                                <View >
                                    <Text style={{ fontWeight: "bold", marginLeft: 100 }}>{this.state.duration}<Text style={{ fontWeight: "normal" }}> min</Text></Text>

                                    <Text style={{ marginLeft: 70 }}>{this.state.distance} km de ti</Text>
                                </View>


                            </View>
                            <View style={styles.area}>

                                <Icon name="chevron-right" color="green" size={15}></Icon>

                                <Text style={{ marginLeft: 10 }}>
                                    {(this.state.routeInitial == true) ? keys.travelInfo.puntoPartida.addressInput : (this.state.routeParada1==true) ? keys.travelInfo.Parada1.Direccion : (this.state.routeParada2==true) ? keys.travelInfo.Parada2.Direccion : (this.state.routeParada3==true) ? keys.travelInfo.Parada3.Direccion : "Test" }
                                </Text>
                            </View>
                        </View>
                    :
                       null
                    }
                    {/* Barra superior para aceptar el viaje  */}

                    {this.state.aceptViaje || this.state.Travel?


                        <View >

                            <View style={styles.area}>

                                <Icon name="chevron-right" color="green" size={15}></Icon>

                                <View  style={{width:280}}>
                                    <Text style={{ marginLeft: 10 }}> {(this.state.routeInitial == true) ? keys.travelInfo.puntoPartida.addressInput : (this.state.routeParada1 == true) ? keys.travelInfo.Parada1.Direccion : (this.state.routeParada2 == true) ? keys.travelInfo.Parada2.Direccion : (this.state.routeParada3 == true) ? keys.travelInfo.Parada3.Direccion : "Test"}</Text>
                                    <Text style={{marginLeft:10}}>{this.state.duration} min ({this.state.distance} km)</Text>
                                </View>
                                <View>
                                    <Icon name="chevron-up" size={30} onPress={this.Go}></Icon>
                                    <Text style={{paddingLeft:4}}>Go</Text>
                                </View>
                            </View>
                        </View>
                    :
                        null
                    }
    
                  
    
                        </View>
                    <View style={styles.containerMap}>
                    {this.state.region.latitude != 0 && this.state.region.longitude != 0 && this.state.region.latitudeDelta != 0 && this.state.region.longitudeDelta != 0 && this.state.positionUser != null?

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
                            this.state.Paradas!=null?

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
                        {this.state.routeInitial && this.state.myPosition!=null && this.state.positionUser !=null?
                        
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
                                    if(result!=null){

                            
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
                        
                      { this.state.routeParada1?

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
                      {
                        this.state.routeParada2?

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
                    
                     

                     
                                
                                
                    </MapView>

                    :
                    
                        null
                    
                    }

                        <View>

                        <View style={{paddingLeft:210, paddingBottom:20}}>

                                    <Icon name="exclamation-circle"
                                        size={30}
                                        onPress={()=>this.alert()}    
                                    ></Icon>

                                </View>

                        </View>

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
                                    }>{keys.nombreUsuario}</Text>

                                <Icon name="times"
                                style={{ paddingLeft:10}}
                                color="red"
                                size={25}
                                onPress={() => this.setState({
                                    showModalCancel: true
                                })}
                                ></Icon>  
                                
                                <Icon name="angle-double-right"
                                style={{paddingLeft:10}}
                                color="red"
                                size={25}
                                onPress={() => this.setState({
                                    showModalCancel: true
                                })}
                                ></Icon>
                               
                                <Icon name="comment-dots"
                                    style={{ paddingLeft: 40 }}
                                    size={25}></Icon>
                             

                                <Icon name="phone"
                                    style={{ paddingLeft: 15 }}
                                    size={25}></Icon>

                            </View>
                            <View style={styles.area}>
                                
                                <View style={{paddingLeft:120}}>
                                    <Text style={{ paddingLeft: 20 }}>{keys.usuarioTelefono}</Text>
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
                                onPress={() => this.aceptViaje()}
                            />
                            <Text style={
                                {
                                    paddingLeft: 45
                                }
                            }>{this.state.timerAceptViaje} s</Text>
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
                            }>{keys.nombreUsuario}</Text>

                            <Icon name="times"
                                style={{ paddingLeft: 10 }}
                                color="red"
                                size={25}
                                onPress={() => this.setState({
                                    showModalCancel: true
                                })}
                            ></Icon>

                            <Icon name="angle-double-right"
                                style={{ paddingLeft: 10 }}
                                color="red"
                                size={25}
                                onPress={() => this.setState({
                                    showModalCancel: true
                                })}
                                ></Icon>

                            <Icon name="comment-dots"
                                style={{ paddingLeft: 40 }}
                                size={25}></Icon>


                            <Icon name="phone"
                                style={{ paddingLeft: 15 }}
                                size={25}></Icon>

                        </View>
                        <View style={styles.area}>

                            <View style={{ paddingLeft: 120 }}>
                                <Text style={{ paddingLeft: 20 }}>{keys.usuarioTelefono}</Text>
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
                                        this.setState({
                                            HomeTravel: false,
                                            aceptViaje: false,
                                            initravel: false,
                                            Travel: true,

                                        })
                                    }}
                                />

                            </View>


                        </View>

                    </View>
                    :
                    null

                }
                {this.state.Travel?
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
                            }>{keys.nombreUsuario}</Text>

                            <Icon name="times"
                                style={{ paddingLeft: 10 }}
                                color="red"
                                size={25}
                                onPress={() => this.setState({
                                    showModalCancel: true
                                })}
                            ></Icon>

                            <Icon name="angle-double-right"
                                style={{ paddingLeft: 10 }}
                                color="red"
                                size={25}
                                onPress={() => this.setState({
                                    showModalCancel: true
                                })}
                                ></Icon>

                            <Icon name="comment-dots"
                                style={{ paddingLeft: 40 }}
                                size={25}></Icon>


                            <Icon name="phone"
                                style={{ paddingLeft: 15 }}
                                size={25}></Icon>

                        </View>
                        <View style={styles.area}>

                            <View style={{ paddingLeft: 120 }}>
                                <Text style={{ paddingLeft: 20 }}>{keys.usuarioTelefono}</Text>
                                <Text>soporte@migo.com</Text>
                            </View>

                        </View>
                        <View>

                        </View>

                        {this.state.routeInitial?
                            <View style={styles.area}>

                                <Icon name="angle-double-right" size={20} style={{ paddingLeft: 10, paddingTop: 25 }}></Icon>
                                <View style={
                                    {
                                        paddingLeft: 90
                                    }
                                }>

                                    
                                    <Button

                                        title="Ir a primera parada"
                                        type="clear"
                                        onPress={() => this.primeraParada()}
                                    />
                                   

                                </View>


                            </View>
                        
                        :
                            null
                        }

                        {this.state.routeParada1 ?
                            <View style={styles.area}>

                                <Icon name="angle-double-right" size={20} style={{ paddingLeft: 10, paddingTop: 25 }}></Icon>
                                <View style={
                                    {
                                        paddingLeft: 90
                                    }
                                }>


                                    <Button

                                        title="Ir a segunda parada"
                                        type="clear"
                                        onPress={() => this.segundaParada()}
                                    />


                                </View>


                            </View>

                            :
                            null
                        }


                        {this.state.routeParada2 ?
                            <View style={styles.area}>

                                <Icon name="angle-double-right" size={20} style={{ paddingLeft: 10, paddingTop: 25 }}></Icon>
                                <View style={
                                    {
                                        paddingLeft: 90
                                    }
                                }>


                                    <Button

                                        title="Terminar Viaje"
                                        type="clear"
                                        onPress={() =>
                                            this.terminarViaje()
                                        }
                                    />


                                </View>


                            </View>

                            :
                            null
                        }


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
