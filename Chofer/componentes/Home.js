import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TextInput, Switch, ScrollView  } from "react-native";
import { Divider, CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, {Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import BottomNavigation, {
    FullTab
} from 'react-native-material-bottom-navigation'
import axios from 'axios';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import SocketIOClient from 'socket.io-client/dist/socket.io.js'
import keys from './global';



export default class Home extends Component {

    state = {
    timer: null,
    errorMessage: null,
    location: null,
    datos_solicitud: null,

    };

    constructor(props) {
        super(props);

        this.socket = SocketIOClient('http://34.95.33.177:3001/');
        console.log('APP CONDUCTOR');

        this.socket.on('conductor_request', num => {
            console.log('Datos emitidos por el cliente', num);
            this.state.datos_solicitud = num;
            console.log(this.state.datos_solicitud);
            alert('Te llego una solicitud');
        });

        this.socket.on('recorrido_id_conductor', num => {
            console.log('Llego respuesta: ', num);
            keys.id_recorrido = num;
            this.state.datos_solicitud=num;
            console.log(this.state.datos_solicitud);
            this.fleet_chofer_usuario();
        });

        this.socket.on('seguimiento_usuario', num => {
            console.log('Coordenadas_usuario: ', num);
            this.state.id_recorrido = num;
            //this.state.datos_solicitud=num;
            //console.log(this.state.datos_solicitud);
        });

    
    

    }

    fleet_chofer_usuario = () => {
        let timer_2 = setInterval(() => {
            this.findCurrentLocationAsync();
            if (this.state.location != null) {

                console.log('Envia datos xd');
                console.log(this.socket.id);
                this.socket.emit('room_chofer_usuario', { id_socket_usuario: this.socket.id, id_socket_chofer: this.state.id_socket_chofer, coordenadas_chofer: this.state.location.coords });
            }

        }, 10000);
        this.setState({ timer_2 });
    }



    async componentDidMount() {


        let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
            }

            let location = await Location.getCurrentPositionAsync({});

        
            this.setState({ 
                myPosition:{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                }

             });


   
    }


    tabs = [
        {
            key: 'Inicio',
            icon: 'car',
            label: 'Inicio',
            barColor: 'white',
            pressColor: 'rgba(255, 255, 255, 0.16)'
        },


        {
            key: 'Mi billetera',
            icon: 'wallet',
            label: 'Mi billetera',
            barColor: 'white',
            pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
            key: 'Perfil',
            icon: 'user-alt',
            label: 'Mi perfil',
            barColor: 'white',
            pressColor: 'rgba(255, 255, 255, 0.16)'
        }
    ]

    renderIcon = icon => ({ isActive }) => (
        <Icon size={24} color="black" name={icon} />
    )

    renderTab = ({ tab, isActive }) => (
        <FullTab
            isActive={isActive}
            key={tab.key}
            label={tab.label}
            renderIcon={this.renderIcon(tab.icon)}
        />
    )

  
    
    static navigationOptions = {
        title: "Inicio"
    };

    // Iniciar funciones de chófer
    conectChofer (){

       
        keys.stateConductor=!keys.stateConductor
      

        if(keys.stateConductor==true){

            if(keys.id_chofer!=null){
    
                let timer = setInterval(() => {
                    
                    this.findCurrentLocationAsync();
                    
                    if(this.state.location!=null){
    
                        this.findCurrentLocationAsync();
                        this.socket.emit('coordenadas', {
                            coordenadas: this.state.location.coords, id_chofer: keys.id_chofer,
                            datos_chofer: keys.datos_chofer, datos_vehiculo: keys.datos_vehiculo, estrellas: keys.estrellas, reconocimientos: keys.reconocimientos
                        });

                        
                        console.log(this.state.location)
                    }
    
                }, 10000);
                this.setState({ timer });
    
                this.setState({ startDisable: true })

            }else{
                alert("Ingrese un id para poder acceder a buscar pasajeros")
            }

        }else{
            clearInterval(this.state.timer);
            this.setState({ startDisable: false })
            this.state.text = '';
            this.socket.emit('Exit', 'exit0');
        }
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

    aceptarViaje = () => {
        console.log(this.state.datos_solicitud);
        if (this.state.datos_solicitud.length <= 0) {
            console.log('ERROR- NO HAZ RECIBIDO SOLICITUDES PAPU XD');
            alert('No tienes solicitudes, no puedes aceptar. :c');
        } else {
            var latitud_usuario = this.state.datos_solicitud.latitud;
            var longitud_usuario = this.state.datos_solicitud.longitud;
            var id_usuario = this.state.datos_solicitud.usuario;
            var id_socket_usuario = this.state.datos_solicitud.id_socket;
            var latitud_conductor = this.state.location.coords.latitude;
            var longitud_conductor = this.state.location.coords.longitude;
            var id_conductor = this.state.username;
            var id_socket_conductor = this.socket.id;
            var latitud_usuario_destino = this.state.datos_solicitud.longitud_usuario_destino;
            var longitud_usuario_destino = this.state.datos_solicitud.latitud_usuario_destino;
            var distancia_destino_usuario = this.state.datos_solicitud.distancia_destino_usuario;
            var tiempo_viaje_destino = (distancia_destino_usuario / 30) * 60;
            var datos_vehiculo = this.state.datos_vehiculo;
            var datos_chofer = this.state.datos_chofer;
            var estrellas = this.state.estrellas;
            var reconocimientos = this.state.reconocimientos;
            var datos_usuario = this.state.datos_solicitud.datos_usuario;
            var estrellas_usuario = this.state.datos_solicitud.estrellas;
            var geocoder_destino = this.state.datos_solicitud.origen_geocoder;
            var geocoder_origen = this.state.datos_solicitud.destino_geocoder;
            var id_unidad = this.state.id_unidad;
            //var distancia_destino_usuario

            this.socket.emit('generar_servicio', {
                id_usuario, id_socket_usuario, latitud_usuario, longitud_usuario, id_conductor, id_socket_conductor, latitud_conductor,
                longitud_conductor, latitud_usuario_destino, longitud_usuario_destino, distancia_destino_usuario, tiempo_viaje_destino,
                datos_vehiculo, datos_chofer, estrellas, reconocimientos, datos_usuario, estrellas_usuario, geocoder_origen, geocoder_destino, id_unidad
            });

            this.fleet_chofer_usuario();
        }

    }
   
    

    render() {
        return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.container}>
              <View style={styles.area}>
                  <View>
                    <Switch 
                    value={keys.stateConductor}
                    onChange={()=>this.conectChofer()}
                    />
                  </View>
                  <View>
                    <Text style={{width:100}} >{keys.stateConductor?"Conectado":"Desconectado"}</Text>
                  </View>
                
                    <View style={
                        {
                            paddingLeft: 130,
                            paddingBottom:5
                        }
                    }>
                        <Icon name="question-circle"
                            size={30}></Icon>
                    </View>
                    <View style={
                        {
                            paddingLeft: 10,
                            paddingBottom:5
                        }
                    }>
                        <Icon name="cog"
                            size={30}></Icon>
                    </View>
              </View>
              
                    <View style={styles.containerMap}>

                        

                        <MapView

                            style={styles.map}

                              region={
                                  this.state.myPosition!=null?
                                    {
                            
                                        latitude: this.state.myPosition.latitude,
                                        longitude: this.state.myPosition.longitude,
                                        latitudeDelta: 0.0105,
                                        longitudeDelta: 0.0105,
                                    }
                                  :
                                     {
                            
                                        latitude: 19.14391,
                                        longitude: -103.3297,
                                        latitudeDelta: 0.0105,
                                        longitudeDelta: 0.0105,
                                    }
                                  
                              }
                        
                        >
                           
                        

                      
                        </MapView>

                        <View >

                            <View style={{paddingLeft:210, paddingBottom:20}}>

                                <Icon name="exclamation-circle"
                                    size={30}></Icon>

                            </View>

                            <View style={{paddingLeft:90}}>

                                <View style={{width:160}}>

                                  <Button title="Múltiples paradas" 
                                    onPress={() => this.props.navigation.navigate("TravelMP")} 
                                    ></Button>
                                
                                </View>

                            </View>


                            <View style={{
                                flexDirection: "row",
                                paddingLeft: 10,
                                paddingTop: 10}}>
                                    
                                <View>

                                    <Button title="Viaje integrado"
                                        onPress={() => this.props.navigation.navigate("Travel_Integrado")}
                                    ></Button>

                                </View>

                                <View style={{ paddingLeft: 5 }}>

                                    <Button title="Viaje Waze"
                                        onPress={() => this.props.navigation.navigate("Travel_Waze")}
                                    ></Button>

                                </View>



                            </View>

                        </View>



                    </View>
                    {this.state.datos_solicitud!=null?

                        <View>
                        
                            <View style={
                                styles.area
                            }>
                                <Text style={
                                    {
                                        textAlign: 'center'
                                    }
                                }>Solicitud de coolaboración</Text>

                            </View>
                            <View style={styles.area}>
                                
                                <View style={{paddingTop:3}}>
                                    <Icon name="user-circle" size={25}></Icon>
                                </View>

                                <View style={{paddingLeft:5}}>
                                    <Text>{this.state.datos_solicitud.datos_usuario}</Text>
                                    <Text>{this.state.datos_solicitud.estrellas}</Text>
                                </View>

                                <View style={{paddingLeft:20}}> 
                                    <Button title="Aceptar"
                                    onPress={()=>this.aceptarViaje()}
                                    ></Button>
                                </View>

                                
                                <View style={{paddingLeft:10}}>
                                    <Button title="Rechazar"></Button>
                                </View>
                            </View>




                        </View>
                    
                
                
                    :
                        <View style={{backgroundColor:"white"}}>
                            <Text style={{alignSelf:"center", paddingTop:5, paddingBottom:5}}>Banner promocional de referidos</Text>

                        </View>
                    }
                    
                    <View style={
                        styles.area
                    }>
                        <View>
                            <Icon name="bell"
                            size={25}></Icon>
                        </View>
                        <View style={
                            {
                                paddingLeft:20
                            }
                        }>
                            <Text>Última notificación</Text>
                        </View>

                        <View style={
                            {
                                paddingLeft: 80,
                                flexDirection:"row"
                            }
                        }>
                            <Text>Ver todas</Text>
                            <Icon name="chevron-right"
                            onPress={() => this.props.navigation.navigate("Notificaciones",
                            {
                                id_chofer:this.state.id_chofer,
                                stateConductor:this.state.stateConductor
                            })} 
                            size={15}
                            style={
                                {
                                    paddingLeft:10,
                                    paddingTop:2
                                }
                            }
                            ></Icon>
                        </View>

                    </View>
                    <View
                        style={
                            {
                                paddingBottom:90
                            }
                        }
                    ></View>
        
                    <BottomNavigation
                
                        onTabPress={newTab => this.setState({ activeTab: newTab.key })}
                        renderTab={this.renderTab}
                        tabs={this.tabs}
                    />
                </View>
          </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#f0f4f7",
        marginTop:10
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
        paddingTop:10
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
        height: 450,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop:10
    },
    map: {
        ...StyleSheet.absoluteFillObject,
      
    },
 
});
