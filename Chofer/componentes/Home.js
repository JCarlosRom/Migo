// Importaciones de librerías 
import React, { Component } from "react";
import Modal from "react-native-modal";
import { StackActions, NavigationActions } from 'react-navigation';
import { View, Text, StyleSheet, Switch, Image } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {
    FullTab
} from 'react-native-material-bottom-navigation'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import SocketIOClient from 'socket.io-client/dist/socket.io.js'
import keys from './global';



export default class Home extends Component {

    /**
     *Clase principal para el componente de Home
     *
     * @memberof Home
     */
    // Estados del componente de Chófer 
    state = {
        errorMessage: null,
        location: null,
        nuevaSolicitud: false,
        travelType:keys.travelType,
        showModal:false,
        Description:""
        
   

    };

    /** Constructor de la clase
     *Creates an instance of Home.
     * @param {*} props
     * @memberof Home
     */
    constructor(props) {
        // alert("Actualizada")

        super(props);
        // Verificación de si se hace una conexión por socket 
        if(keys.socket==null){
            // En caso de que sea null, se crea una nueva conexión 
            keys.socket = SocketIOClient(keys.socketUrl);
  
        }

        // Socket receptor para verificar que el usuario siga On-Line
        keys.socket.on('isConnected', () => { })

        // Socket receptor en caso de que se lleve a cabo una transacción del usuario, es decir 
        // Pago de viaje 
        keys.socket.on("TransaccionSatisfactoria", (num) => {

     
            if (num.isPropina == true) {

                this.setState({
                    showModal: true,
                    Description: "Pago realizado correctamente, has recibido $" + num.Propina+".00 de propina"
                })
            } else {
                if (num.isPropina == false) {
                    this.setState({
                        showModal: true,
                        Description: "Pago realizado correctamente"
                    })
                }
            }
            keys.socket.removeAllListeners("TransaccionSatisfactoria");

        })
  
    
        // Socket para escuchar nueva solicitud de usuario a conductor y guardado de información 
        keys.socket.on('conductor_request', num => {
    
            // Verifica que la información que recepta sea diferente null
            if(num!=null){

                // Asigna la información que manda el usuario a la información de conductor para iniciar el viaje 
                keys.datos_usuario={
                    id_usuario: num.datos_usuario.id_usuario,
                    nombreUsuario: num.datos_usuario.nombreUsuario,
                    CURP: num.datos_usuario.CURP,
                    numeroTelefono: num.datos_usuario.numeroTelefono,
                    correoElectronico: num.datos_usuario.correoElectronico,
                    imgUsuario: num.datos_usuario.imgUsuario
                }

                console.log("CHOFER: datosUsuario", keys.datos_usuario);
                
                keys.type= num.type;

                if (keys.type !="SinDestino"){
    
    
                    keys.travelInfo={
                        puntoPartida: num.infoTravel.puntoPartida,
                        Parada1: num.Paradas[0],
                        Parada2: num.Paradas[1],
                        Parada3: num.Paradas[2],
                        Distancia: num.Distancia, 
                        Tiempo: num.Tiempo,
                        typePay: num.infoTravel.typePay

                        // Distancia: num.Distancia, 
                        // Tiempo: num.Tiempo
                    }

                }else{
                    keys.travelInfo = {
                        puntoPartida: num.infoTravel.puntoPartida,
                        typePay: num.infoTravel.typePay
                    }
                }

        
    
    
                keys.positionUser={
                    latitude:num.usuario_latitud,
                    longitude: num.usuario_longitud
                }

                keys.id_usuario_socket = num.id_usuario_socket
     
                keys.id_chofer_socket = keys.socket.id;

                keys.Tarifa = num.Tarifa;

                // Quita al chófer de la cola, para que no pueda recibir solicitudes mientras lleva a cabo el viaje
                keys.socket.emit("popChofer", { id_chofer_socket: keys.id_chofer_socket,});

                clearInterval(this.state.timer);
                clearInterval(keys.timerCoordenadas);

                // Navegación hacia pantallas, el valor Flag: en Acept sirve para señalar que es un viaje normal

                if (keys.type == "Unico" ) {

                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Travel_Integrado', params: { Flag: "Acept" } })],
                        key: undefined
                    });

                    this.props.navigation.dispatch(resetAction);

       

                } else {

                    if(keys.type=="Multiple"){

                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'TravelMP', params: { Flag: "Acept" } })],
                            key: undefined
                        });

                        this.props.navigation.dispatch(resetAction);
                        
                       

                    }else{
                       
                        if(keys.type=="Multiple 2 paradas"){

                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'TravelMP2', params: { Flag: "Acept" } })],
                                key: undefined
                            });

                            this.props.navigation.dispatch(resetAction);

                         
                        }else{
                            if(keys.type=="SinDestino"){

                                const resetAction = StackActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({ routeName: 'TravelNoDestination', params: { Flag: "Acept" } })],
                                    key: undefined
                                });

                                this.props.navigation.dispatch(resetAction);

                           
                            }
                        }
                        
                    }


                }

            }
            
        });


    }

    /**
     *
     *
     * @memberof Home
     */
    setTravel(){
        keys.travelType = !keys.travelInfo

        this.setState({
            travelType: !this.state.travelType
        })
    }

 

    /**
     *Ciclo de vida para antes de que se monte el componente
     *
     * @memberof Home
     */
    async componentWillMount() {
        // Limpia de intervals de los cronometros de tiempo de viaje, y el tiempo de espera de usario
        clearInterval(keys.intervalTimeTravel)
        clearInterval(keys.intervalEsperaUsuario)

        // Limpia el array de chat
        keys.Chat=[]

        // Remueve el socket de recorrido_id_conductor
        keys.socket.removeAllListeners("recorrido_id_conductor");

        keys.socket.removeAllListeners("LlegoMensaje");

        // Toma el valor mandado por la navegación y lo asigna a Flag
        Flag = this.props.navigation.getParam('Flag', false);

        // En caso de que sea true, es decir que anteriormente hubo un viaje, transmite coordenadas del chófer,
        // Y se agrega como activo
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

        // Si la bandera es cancelar servicio, se canceló anteriormente un viaje, muestra un modal con el mensaje
        // "Viaje cancelado por usuarr"
        if (Flag == "CancelarServicio") {

     
            
            this.setState({
                showModal: true,
                Description: "Viaje cancelado por usuario",
                stateConductor: keys.stateConductor
            })

        }else{
            // Condición en caso de detectar finalización del viaje 
            if (Flag =="finalizarViaje"){
                this.setState({
                    stateConductor: keys.stateConductor
                })
            }else{
                // Condición para cancelar el servicio del chófer
                if (Flag =="CancelarServicioChofer"){
                   
                    this.setState({
                        showModal: true,
                        Description: "El viaje se ha cancelado correctamente",
                        stateConductor: keys.stateConductor
                    })
                }else{
                    // Condición en caso de cancelación automaticamente
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


        // Bloque para los permisos de acceder al gps del dispositivo
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
            }

            let location = await Location.getCurrentPositionAsync({});

            // Asignación de coordenadas al estado myPosition
            this.setState({ 
                myPosition:{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                }

             });


   
    }


    /**
     *Render de los tabs de Inicio 
     *
     * @memberof Home
     */
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

        <Icon size={24} color="#ff8834" name={icon} />
    )

    /**
     *
     * Configuración de los tabs del menú 
     * @param {*} { tab, isActive }
     */
    renderTab = ({ tab, isActive }) => (
        <FullTab
            isActive={isActive}
            key={tab.key}
            label={tab.label}
            renderIcon={this.renderIcon(tab.icon)}
        />
    )

  
    
    /**
     * Barra de navegación
     *
     * @static
     * @memberof Home
     */
    static navigationOptions = {
        title: "Inicio"
    };

    /**
     * Función para conectar chófer 
     *
     * @memberof Home
     */
    // Iniciar funciones de chófer, envio de coordenadas del chofer al ws o desconexión del chófer
    conectChofer (){

        // Cambiar la vairiable global del estado del chofer 
        keys.stateConductor=!keys.stateConductor
        // Asignación al estado del chófer
        this.setState({
            stateConductor: keys.stateConductor
        })
        
        // Validación de estado del conductor
        if(keys.stateConductor==true){

            if(keys.id_chofer!=null){
                // Función para generar las coordenadas del usuario
                this.findCurrentLocationAsync();

                if (this.state.location != null) {

                    this.findCurrentLocationAsync();
                    // Socket para emitir las coordenadas al ws
                    keys.socket.emit('coordenadas', {
                        coordenadas: this.state.location.coords, id_chofer: keys.id_chofer,
                        datos_chofer: keys.datos_chofer, datos_vehiculo: keys.datos_vehiculo
                    });

                }
                // Interval para emitir coordenadas cada 10 segundos al ws, se duplica del mismo código de arriba 
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

                // Modal en caso de que el usuario no sea el correcto, o no haya login 
                this.setState({
                    showModal: true,
                    Description: "Ingrese un id para poder acceder a buscar pasajeros",
                })
     
            }

        }else{
            // Saca al conductor de la lista de conductores en linea
            keys.socket.emit("popChofer", { id_chofer_socket: keys.id_chofer_socket, });
            // Se deja de transmitir 
            clearInterval(keys.timerCoordenadas);
      
        }
    }

    /*
    *Función para generar las coordenadas del dispositivo móvil
    * 
    *@memberof Home
    */
    findCurrentLocationAsync = async () => {
        // Variable para solicitar permisos de gps del dispositivo
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
     *Render principal del componente 
     *
     * @returns
     * @memberof Home
     */
    render() {
        return (
            <View style={{flex:1}}>
                {/* Modal Genérico para monstrar mensajes de la app  */}
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
                
                {/*MAPA*/}
                <MapView

                    style={{ top:"-20%", height:"120%"}}
                        // Región del mapa que se muestra, se to posición actual 
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
                {/* Barra superior: Switch de conexión o desconexión, botón de ayuda y configuración */}
                <View style={{
                    flexDirection: "row",
                    position: "absolute", //use absolute position to show button on top of the map
                    left: "2%",
                    top: "2%",
                }}>
                   <View style={{flex:1}}>
                        <Switch 
                        value={this.state.stateConductor}
                        onChange={()=>this.conectChofer()}
                        />
                  </View>
                  <View style={{flex:2.5}}>
                    <Text  >{this.state.stateConductor?"Conectado":"Desconectado"}</Text>
                  </View>

                  <View style={{flex:0.5}}></View>

                    <View style={
                        {
                            flex:1
                        }
                    }>
                        <Icon name="question-circle"
                            size={30}
                            color="#ff8834"></Icon>
                    </View>
                    <View style={
                        {
                            flex:1
                    }}>
                        <Icon name="cog"
                                color="#ff8834"
                            size={30}></Icon>
                    </View>
                </View>

                <View style={{ flexDirection:"row", position:"absolute", left:"80%", top:"65%"}}>
                    
                    <Image
                        style={{ width: 50, height: 50 }}
                        source={require("./../assets/botonPanico.png")}
                    >

                    </Image>

                </View>
                {/* Banner promocional */}
                <View style={{ flexDirection: "row", position: "absolute", left: "6%", top:"74%"}}>
                   
                   <Text style={{alignSelf:"center", paddingTop:5, paddingBottom:5}}>Banner promocional de referidos</Text>

               </View>
                {/* Vista para acceder a notificaciones, esa funcionalidad es de otro módulo */}
                <View style={{ flexDirection: "row", position:"absolute", left: "6%", top:"82%"}}>

                    <View style={{flex:1}}>
                        <Icon name="bell"
                        color="#ff8834"
                        size={25}></Icon>
                    </View>
                    <View style={{ flex: 2 }}>

                        <Text>Última notificación</Text>

                    </View>

                    <View style={{flex:2}}>

                        <Text>Ver todas</Text>

                    </View>
                    <View style={{flex:1}}>

                        <Icon name="chevron-right"
                            color="#ff8834"
                    
                        size={15}
                        
                        ></Icon>
                    </View>
                 
                </View>

                <View style={{flexDirection:"row", position:"absolute", top:"90%"}}>
                    <View style={{ flex: 1 }}>
                        <Switch
                        value={this.state.travelType}
                        onChange={() => this.setTravel()}
                        />
                    </View>
                    <View style={{flex:5}}></View>

                </View>

            
            </View>
        // <ScrollView contentContainerStyle={styles.contentContainer}>
        //   <View style={styles.container}>

    
              
      
                
     
                    
                    

  
        //             <View
        //                 style={
        //                     {
        //                         paddingBottom:90
        //                     }
        //                 }
        //             ></View>
        
        //             <BottomNavigation
                
        //                 onTabPress={newTab => this.setState({ activeTab: newTab.key })}
        //                 renderTab={this.renderTab}
        //                 tabs={this.tabs}
        //             />
        //         </View>
        //   </ScrollView>
        );
    }
}
// Estilos de Home.js App Chófer
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
        width: "100%",
        justifyContent: 'flex-end',
        alignItems: 'center',

    },
    map: {
        ...StyleSheet.absoluteFillObject,
      
    },
 
});
