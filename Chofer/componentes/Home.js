import React, { Component } from "react";
import Modal from "react-native-modal";
import { View, Text, StyleSheet, Switch, ScrollView, Image } from "react-native";
import { Button, Input } from "react-native-elements";
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
        errorMessage: null,
        location: null,
        nuevaSolicitud: false,
        travelType:keys.travelType,
        showModal:false,
        Description:""
        
   

    };

    constructor(props) {


        super(props);

        if(keys.socket==null){

            keys.socket = SocketIOClient(keys.socketUrl);
            // keys.socket = SocketIOClient('http://35.203.42.33:3001/');
            
        }


        keys.socket.on('isConnected', () => { })


        keys.socket.on("TransacciónSatisfactoria", (num) => {

            console.log("Transaccion Satisfactoria")

            this.setState({
                showModal: true,
                Description: "Pago realizado correctamente"
            })

        })
  
        console.log('APP CONDUCTOR');

        // Socket para escuchar nueva solicitud de usuario a conductor y guardado de información 
        keys.socket.on('conductor_request', num => {
    
            // this.state.datos_solicitud = num;

            console.log("Datos Solicitud",num);

            if(num!=null){
    
                keys.datos_usuario={
                    id_usuario: num.datos_usuario.id_usuario,
                    nombreUsuario: num.datos_usuario.nombreUsuario,
                    CURP: num.datos_usuario.CURP,
                    numeroTelefono: num.datos_usuario.numeroTelefono,
                    correoElectronico: num.datos_usuario.correoElectronico
                }
                
                keys.type= num.type;

                if (keys.type !="SinDestino"){
    
    
                    keys.travelInfo={
                        puntoPartida: num.infoTravel.puntoPartida,
                        Parada1: num.Paradas[0],
                        Parada2: num.Paradas[1],
                        Parada3: num.Paradas[2],
                        Distancia: num.Distancia, 
                        Tiempo: num.Tiempo,

                        // Distancia: num.Distancia, 
                        // Tiempo: num.Tiempo
                    }

                }else{
                    keys.travelInfo = {
                        puntoPartida: num.infoTravel.puntoPartida,
                    }
                }
    
    
                keys.positionUser={
                    latitude:num.usuario_latitud,
                    longitude: num.usuario_longitud
                }

                keys.id_usuario_socket = num.id_usuario_socket
     
                keys.id_chofer_socket = keys.socket.id;

                keys.Tarifa = num.Tarifa;

                keys.socket.emit("popChofer", { id_chofer_socket: keys.id_chofer_socket,});

                
                // console.log("Socket del chofer", keys.id_chofer_socket)



                clearInterval(this.state.timer);
                clearInterval(keys.timerCoordenadas);

                if (keys.type == "Unico" ) {

                    this.props.navigation.navigate("Travel_Integrado", { Flag: "Acept" });

                } else {

                    if(keys.type=="Multiple"){
                        
                        this.props.navigation.navigate("TravelMP", { Flag: "Acept" });

                    }else{
                       
                        if(keys.type=="Multiple 2 paradas"){
                            this.props.navigation.navigate("TravelMP2", { Flag: "Acept" });
                        }else{
                            if(keys.type=="SinDestino"){
                                this.props.navigation.navigate("TravelNoDestination", {Flag:"Acept"});
                            }
                        }
                        
                    }


                }

            }
            
        });

        keys.socket.on('recorrido_id_conductor', num => {
            // console.log('Llego respuesta: ', num);
            keys.id_recorrido = num;
            this.state.datos_solicitud=num;
            // console.log(this.state.datos_solicitud);
            this.fleet_chofer_usuario();
        });



    }

    setTravel(){
        keys.travelType = !keys.travelInfo

        this.setState({
            travelType: !this.state.travelType
        })
    }

    // Función para transmitir las coordenadas de chofer a usuario
    fleet_chofer_usuario = () => {
        let timer_2 = setInterval(() => {
            this.findCurrentLocationAsync();
            if (this.state.location != null) {

                // console.log('Envia datos de chofer a usuario');
                keys.socket.emit('room_chofer_usuario', { id_usuario_socket: keys.id_usuario_socket  , id_chofer_socket: keys.id_chofer_socket, coordenadas_chofer: this.state.location.coords });
            }

        }, 10000);
        this.setState({ timer_2 });
    }

    async componentWillMount() {

        keys.Chat=[]

        Flag = this.props.navigation.getParam('Flag', false);

        console.log(Flag);

        if(Flag!=false){

            if (keys.id_chofer != null) {

                let timerCoordenadas = setInterval(() => {

                    this.findCurrentLocationAsync();

                    if (this.state.location != null) {


                        this.findCurrentLocationAsync();
                        keys.socket.emit('coordenadas', {
                            coordenadas: this.state.location.coords, id_chofer: keys.id_chofer,
                            datos_chofer: keys.datos_chofer, datos_vehiculo: keys.datos_vehiculo
                        });



                    }

                }, 10000);
                keys.timerCoordenadas = timerCoordenadas;

            } else {

                this.setState({
                    showModal: true,
                    Description: "Ingrese un id para poder acceder a buscar pasajeros"
                })

          
            }
        }


        if (Flag == "CancelarServicio") {

     
            
            this.setState({
                showModal: true,
                Description: "Viaje cancelado por usuario",
                stateConductor: keys.stateConductor
            })

        }else{
            if (Flag =="finalizarViaje"){
                this.setState({
                    stateConductor: keys.stateConductor
                })
            }else{
                if (Flag =="CancelarServicioChofer"){
                   
                    this.setState({
                        showModal: true,
                        Description: "El viaje se ha cancelado correctamente",
                        stateConductor: keys.stateConductor
                    })
                }else{
                    if(Flag=="CancelarServicioAutomatico"){
                        
                        this.setState({
                            showModal: true,
                            Description: "Viaje cancelado",
                            stateConductor: keys.stateConductor
                        })
                    }
                }
            }
        }



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

    // Iniciar funciones de chófer, envio de coordenadas del chofer al ws
    conectChofer (){

   
        keys.stateConductor=!keys.stateConductor

        this.setState({
            stateConductor: keys.stateConductor
        })
        
        console.log(keys.stateConductor)

        console.log(keys.id_chofer)

        if(keys.stateConductor==true){

            if(keys.id_chofer!=null){

                this.findCurrentLocationAsync();

                if (this.state.location != null) {


                    this.findCurrentLocationAsync();
                    keys.socket.emit('coordenadas', {
                        coordenadas: this.state.location.coords, id_chofer: keys.id_chofer,
                        datos_chofer: keys.datos_chofer, datos_vehiculo: keys.datos_vehiculo
                    });



                }
    
                let timerCoordenadas = setInterval(() => {
                    
                    this.findCurrentLocationAsync();
                    
                    if(this.state.location!=null){

    
                        this.findCurrentLocationAsync();
                        keys.socket.emit('coordenadas', {
                            coordenadas: this.state.location.coords, id_chofer: keys.id_chofer,
                            datos_chofer: keys.datos_chofer, datos_vehiculo: keys.datos_vehiculo
                        });

                        
                   
                    }
    
                }, 10000);
                keys.timerCoordenadas = timerCoordenadas;

            }else{


                this.setState({
                    showModal: true,
                    Description: "Ingrese un id para poder acceder a buscar pasajeros",
                })
     
            }

        }else{
            clearInterval(keys.timerCoordenadas);

            console.log("timerCoordenadasHome", keys.timerCoordenadas)
            keys.socket.emit('Exit', 'exit0');
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

                                    <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}>{this.state.Description}</Text>

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
              <View style={styles.area}>
                  <View>
                    <Switch 
                    value={this.state.stateConductor}
                    onChange={()=>this.conectChofer()}
                    />
                  </View>
                  <View>
                    <Text style={{width:100}} >{this.state.stateConductor?"Conectado":"Desconectado"}</Text>
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
                                          longitudeDelta: 0.060,
                                          latitudeDelta: 0.060
                                    }
                                  :
                                     {
                            
                                        latitude: 19.14391,
                                        longitude: -103.3297,
                                          longitudeDelta: 0.060,
                                          latitudeDelta: 0.060
                                    }
                                  
                              }


                            showsUserLocation={true}
                            followsUserLocation={true}
                        
                        >
                           
                        

                      
                        </MapView>

                        <View >

                            <View style={{paddingLeft:210, paddingBottom:20}}>

                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require("./../assets/botonPanico.png")}
                                >

                                </Image>

                            </View>

                           
                        </View>



                    </View>
                
                    <View style={{backgroundColor:"white"}}>
                        <Text style={{alignSelf:"center", paddingTop:5, paddingBottom:5}}>Banner promocional de referidos</Text>

                    </View>
                    
                    
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
                            // onPress={() => this.props.navigation.navigate("Notificaciones",
                            // {
                            //     id_chofer:this.state.id_chofer,
                            //     stateConductor:this.state.stateConductor
                            // })} 
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
                    <View style={styles.area}>
                        <View style={{ flex: 1 }}>
                            <Switch
                                value={this.state.travelType}
                                onChange={() => this.setTravel()}
                            />
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
