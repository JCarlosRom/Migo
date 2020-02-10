import BackgroundTimer from 'react-native-background-timer';
import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TextInput, ScrollView, Slider, TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, {Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import axios from 'axios';
import * as Location from "expo-location";
import * as Permissions from 'expo-permissions';
import { StackActions, NavigationActions } from 'react-navigation';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';
import keys from "./global";


export default class Travel extends Component {
    constructor(props) {


        if (keys.socket == null) {

            keys.socket = SocketIOClient(keys.urlSocket);

            console.log("Usuario",keys.urlSocket);

            keys.id_usuario_socket = keys.socket.id;

            keys.socket.on('getIdSocket', (num) => {

                // console.log(num);

                keys.id_usuario_socket = num.id;


            })

        
        }

        super(props);
        this.state = {
            slideDistance:1,
            standarSelected:true,
            luxeSelected:false,
            VanSelected:false,
            TruckSelected:false,
            showLeftCars:false,
            showFavoritePlaces: false,
            myPosition: {
                latitude: 0,
                longitude: 0,
            },
            region: {  
                latitude: 0,
                longitude: 0,
                longitudeDelta:0,
                latitudeDelta:0

            },
            Vehicles:null,
            location:null, 
            leftVehicles:0,

     
        
        };

     


        keys.id_usuario_socket = keys.socket.id;



        if(keys.categoriaVehiculo==null || keys.tipoVehiculo==null){

            this.getVehicles(1, 1);
            
        }else{
            
            this.getVehicles(keys.categoriaVehiculo, keys.tipoVehiculo);

        }


        // Socket para escuchar el socket de vehículo
        keys.socket.on('vehiclesGet', (num) => {

            this.setState({
                Vehicles:num
            })
    
            // console.log("Vehiculos Travel 1",this.state.Vehicles, "-----");
          

        })

    
        
    }

    async componentDidMount(){

        const intervalId = BackgroundTimer.setInterval(() => {
            // this will be executed every 200 ms
            // even when app is the the background
            console.log('tic');
        }, 1000);

        const myLocation = await Location.getCurrentPositionAsync({});
        latitude = myLocation.coords.latitude;
        longitude = myLocation.coords.longitude;

        this.setState({
            region: {
                latitude: latitude,
                longitude: longitude,
                longitudeDelta: 0.0105,
                latitudeDelta: 0.0105

            },
        })



    }

  

  

    async componentWillMount() {

        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        // console.log("componentWillMount Categoria Vehiculo");
        // console.log(keys.categoriaVehiculo);
        // console.log("componentWillMount tipo de Vehiculo");
        // console.log(keys.tipoVehiculo);
        

        
        if (keys.categoriaVehiculo != null) {


            if (keys.categoriaVehiculo == 1 && keys.tipoVehiculo == 1) {

                this.setState({
                    standarSelected: true,
                    luxeSelected: false,
                    VanSelected: false,
                    TruckSelected: false,
                    showLeftCars: true

                })

                // console.log(keys.categoriaVehiculo, keys.tipoVehiculo);
                


            } else {
                if (keys.categoriaVehiculo == 1 && keys.tipoVehiculo == 2) {

                    this.setState({

                        standarSelected: false,
                        luxeSelected: true,
                        VanSelected: false,
                        TruckSelected: false,
                        showLeftCars: true

                    });

                    // console.log(keys.categoriaVehiculo, keys.tipoVehiculo);

                } else {
                    if (keys.categoriaVehiculo == 3) {


                        this.setState({

                            standarSelected: false,
                            luxeSelected: false,
                            VanSelected: true,
                            TruckSelected: false,
                            showLeftCars: true
                        });

                        
                        // console.log(keys.categoriaVehiculo, keys.tipoVehiculo);

                    } else {

                        if (keys.categoriaVehiculo == 4) {

                            this.setState({

                                standarSelected: false,
                                luxeSelected: false,
                                VanSelected: false,
                                TruckSelected: true,
                                showLeftCars: true

                            });

                            // console.log(keys.categoriaVehiculo, keys.tipoVehiculo);

                        }
                    }
                }

            }

        }



          try {

            Address = this.props.navigation.getParam('Address', 'No Address');
            Latitude = this.props.navigation.getParam('Latitude', 'No Latitude');
            Longitude = this.props.navigation.getParam('Longitude', 'No Longitude');

 

            if(Address!='No Address' && Address!=""){

                locationStr = Address;

                console.log(locationStr);
                this.setState({ location: locationStr });

                console.log(this.state.location);
                console.log(Latitude);
                console.log(Longitude);

                this.setState({
                    myPosition:{
                        latitude: Latitude,
                        longitude: Longitude
                    }
                })

            }else{

                const myLocation = await Location.getCurrentPositionAsync({});
                latitude = myLocation.coords.latitude;
                longitude = myLocation.coords.longitude;


                this.setState({
                    myPosition: {

                        latitude: latitude,
                        longitude: longitude

                    },
                    region: {
                        latitude: latitude,
                        longitude: longitude,
                        longitudeDelta: 0.0105,
                        latitudeDelta: 0.0105

                    },

                });

                var location = await Location.reverseGeocodeAsync({
                    latitude: this.state.myPosition.latitude,
                    longitude: this.state.myPosition.longitude
                });
    
    
                locationStr =location[0]["street"] + " #" +location[0]["name"] + " " +location[0]["city"] + " " +location[0]["region"];
                
                this.setState({ location:locationStr });


           
            }
       
           
        } catch (e) {
            this.setState({ errorMessage: e });
            console.log("Error: " + this.state.errorMessage);
        }



    

        
    }

   


    functionShowFavoritePlaces(){
        this.setState({
            showFavoritePlaces: true
        });

        this.props.navigation.navigate("Home",{
            direction: this.state.location,
            coordinates: this.state.myPosition,
            flag:true
        });
        
    }

    setSelectedVehicle(categoriaVehiculo, tipoVehiculo){

   
        if (categoriaVehiculo == 1 && tipoVehiculo==1 ){
            
            this.setState({
                standarSelected: true,
                luxeSelected: false,
                VanSelected: false,
                TruckSelected: false,
                showLeftCars:true
                
            })
            this.getVehicles(categoriaVehiculo, tipoVehiculo);

         
        }else{
            if (categoriaVehiculo == 1 && tipoVehiculo ==2){

                this.setState({

                    standarSelected: false,
                    luxeSelected: true,
                    VanSelected: false,
                    TruckSelected: false,
                    showLeftCars: true

                });

                this.getVehicles(categoriaVehiculo, tipoVehiculo);

            }else{
                if (categoriaVehiculo == 3){


                    this.setState({

                        standarSelected: false,
                        luxeSelected: false,
                        VanSelected: true,
                        TruckSelected: false,
                        showLeftCars: true
                    });

                    this.getVehicles(categoriaVehiculo, tipoVehiculo);

                
                }else{

                    if (categoriaVehiculo == 4){

                        this.setState({

                            standarSelected: false,
                            luxeSelected: false,
                            VanSelected: false,
                            TruckSelected: true,
                            showLeftCars: true

                        });

                        this.getVehicles(categoriaVehiculo, tipoVehiculo);

                    }
                }
            }
           
        }

       
    }

    
    async getVehicles(categoriaVehiculo, tipoVehiculo  ) {
        
 

        clearInterval(this.timer_Vehicles);

        clearInterval(this.timer_VehiclesConsult);

        keys.socket.emit('vehiclesConsult', {
            categoriaVehiculo: categoriaVehiculo, tipoVehiculo: tipoVehiculo,id_usuario_socket: keys.id_usuario_socket
        });
        
        this.timer_VehiclesConsult = setInterval(() => {

            if(keys.id_usuario_socket!=null){

                keys.socket.emit('vehiclesConsult', {
                    categoriaVehiculo: categoriaVehiculo, tipoVehiculo: tipoVehiculo, id_usuario_socket: keys.id_usuario_socket
                });
            }
 

        }, 10000);

        keys.categoriaVehiculo = categoriaVehiculo;

        keys.tipoVehiculo = tipoVehiculo; 

        console.log("Categoria vehiculo get");
        console.log(keys.categoriaVehiculo);
        console.log("Tipo Vehiculo Get");
        console.log(keys.tipoVehiculo);
        
    }
    



    static navigationOptions = {
        title: "Viaje"
    };

    onMapPress = async e => {
        latitudePress=e.nativeEvent.coordinate.latitude;
        longitudePress=e.nativeEvent.coordinate.longitude;
        try {
            let result = await Location.reverseGeocodeAsync({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude
            });
            locationStr = result[0]["street"] + " #" + result[0]["name"] + " " + result[0]["city"] + " " + result[0]["region"];

            this.setState({ location: locationStr });

            this.setState({
                myPosition: {

                    latitude: latitudePress,
                    longitude: longitudePress

                },
                error: null,
            });
        } catch (e) {
            this.setState({ errorMessage: e });
        }
        console.log(this.state.result);
    
      
    };


    onRegionChange =  async region =>{
        latitude= region.latitude;
        longitude = region.longitude;
        latitudeDelta = region.latitudeDelta;
        longitudeDelta = region.longitudeDelta;

       this.setState({
           region
       });


    } 

    saveConfiguration(){

        if(this.state.location!=""){

            
            clearInterval(this.timer_Vehicles);
    
            clearInterval(this.timer_VehiclesConsult);
    
            keys.socket.removeAllListeners("getIdSocket");
    
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home', params:{Address:this.state.location} })],
                key: undefined
            });
    
            this.props.navigation.dispatch(resetAction);
        }

    }


    render() {

   
        
        return (

            <View style={{ flex: 1 }}>

                {this.state.region.latitude!=0 && this.state.region.longitude && this.state.region.latitudeDelta!=0 && this.state.region.longitudeDelta?
                
                    <MapView

                        style={{ flex: 1 }}
                        region={{
                            latitude: this.state.region.latitude,
                            longitude: this.state.region.longitude,
                            latitudeDelta: this.state.region.latitudeDelta,
                            longitudeDelta: this.state.region.longitudeDelta
                        }}

                        onRegionChangeComplete={this.onRegionChange}

                        showsUserLocation={true}
                        followsUserLocation={true}
                        showsMyLocationButton={false}


                        onLongPress={this.onMapPress.bind(this)}
                    >
                        <Marker
                        coordinate={{
                            latitude: this.state.myPosition.latitude,
                            longitude: this.state.myPosition.longitude,
                        }}

                            >
                                <Icon name="map-pin" color="#ff8834" size={20} color="orange"></Icon> 
                        </Marker> 

                            {this.state.Vehicles != null ?


                                this.state.Vehicles.map(marker => (

                                    <Marker
                                        key={"key"}
                                        coordinate={{
                                            latitude: marker.latitud,
                                            longitude: marker.longitud
                                        }}

                                    >
                                        <Icon name={(marker.tipoVehiculo == 1) ? "car-side" : (marker.tipoVehiculo == 2) ? "car" : (marker.tipoVehiculo == 3) ? "shuttle-van" : (marker.tipoVehiculo == 4) ? "truck-pickup" :"car-side"} size={20} color="orange"></Icon>

                                    </Marker>
                                ))


                                :
                                    null

                            }



                    </MapView>
                    :
                    null
                }
             
                <View style={{
                    flexDirection:"row",
                    position: "absolute", //use absolute position to show button on top of the map
                    width: 300,
                    left: "9%",
                    top: "2%",
                    backgroundColor: "#fff"}}>

                    <View>
                        <TextInput
                    
                            style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1, backgroundColor: '#DCDCDC' }}
                            value={this.state.location}
                            placeholderTextColor="gray"
                        ></TextInput>
                    </View>
                </View>

                <View style={{
                    flexDirection: "row",
                    position: "absolute", //use absolute position to show button on top of the map
                    width: 300,
                    left: "9%",
                    top: "10%",
                    backgroundColor: "#fff"
                }}>
                    <TextInput
                        style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1, backgroundColor: '#DCDCDC' }}
                        placeholder=" ¿A dónde vamos?"
                        placeholderTextColor="gray"
                            onFocus={() => this.saveConfiguration()}
                    ></TextInput>


                </View>

                <View
                    style={{
                        flexDirection: "row",
                        position: "absolute", //use absolute position to show button on top of the map
                        width: 300,
                        left: "7%",
                        top: "65%",
                        // backgroundColor: "#fff"
                    }}
                    >
                    <Text style={
                        {
                            fontWeight:"bold",
                            fontSize:14,
                            paddingTop:20
                        }
                    }>
                        Tipo de vehículo
                    </Text>

                    {this.state.showLeftCars?

                        <Text style={
                            {
                                fontWeight: "bold",
                                fontSize: 12,
                                paddingTop: 20,
                                paddingLeft:70
                            }
                        }>
                                Vehículos disponibles: {(this.state.Vehicles!=null)?this.state.Vehicles.length: 0}
                    </Text>
                    :
                        null
                    }

                </View>

                <View
                    style={{

                        flexDirection: "row",
                        position: "absolute", //use absolute position to show button on top of the map
                        // width: 300,
                        // left: "7%",
                        top: "70%",
                        // backgroundColor: "#fff"
                    }
                    }>



                    <View style={{flex:1, marginRight:35, paddingLeft:25}}>
                        <View style={{height:55}}>

                            <TouchableWithoutFeedback  onPress={() => this.setSelectedVehicle(1, 1)}>

                                <Image
                                    source={this.state.standarSelected ? require("./../assets/TipoVehiculos/SELECCIONADO-ESTANDAR-41.png")
                                    :require("./../assets/TipoVehiculos/ESTANDAR-37.png")}

                                >
                                </Image>

                            </TouchableWithoutFeedback>

                        </View>
                        <Text style={{ fontSize: 9, alignSelf:"center" }}> Estandar</Text>


                    </View>

                        <View style={{ flex: 1, marginRight: 35 }}>

                            <View style={{ height: 55 }}>

                                <TouchableWithoutFeedback onPress={() => this.setSelectedVehicle(1, 2)}>

                                    <Image
                                        source={this.state.luxeSelected ? require("./../assets/TipoVehiculos/SELECCIONADO-DE-LUJO-42.png")
                                            : require("./../assets/TipoVehiculos/DE-LUJO-38.png")}

                                    >
                                    </Image>

                                </TouchableWithoutFeedback>

                            </View>


                            <Text style={{ fontSize: 9, alignSelf: "center" }}>De Lujo</Text>
                    </View>


                        <View style={{ flex: 1, marginRight: 35 }}>

                            <View style={{ height: 55 }}>

                                <TouchableWithoutFeedback onPress={() => this.setSelectedVehicle(3)}>

                                    <Image
                                        source={this.state.VanSelected ? require("./../assets/TipoVehiculos/SELECCIONADO-VANS-43.png")
                                            : require("./../assets/TipoVehiculos/VANS-39.png")}

                                    >

                                    </Image>

                                </TouchableWithoutFeedback>

                            </View>


                            <Text style={{ fontSize: 9, alignSelf: "center" }}>Van</Text>

                    </View>

                    <View style={{ flex: 1 }}>

                            <View style={{ height: 55 }}>

                                <TouchableWithoutFeedback onPress={() => this.setSelectedVehicle(4)}>

                                    <Image
                                        source={this.state.TruckSelected ? require("./../assets/TipoVehiculos/SELECCIONADO-CAMIONETA-44.png")
                                            : require("./../assets/TipoVehiculos/CAMIONETA-40.png")}

                                    >

                                    </Image>

                                </TouchableWithoutFeedback>

                            </View>



                            <Text style={{ fontSize: 8, alignSelf: "center"}}>Camioneta</Text>

                    </View>

                    <View style={{ flex: 1 }}></View>

                </View>

                <View
                    style={{
                        flexDirection: "row",
                        position: "absolute", //use absolute position to show button on top of the map
                        // width: 300,
                        left: "7%",
                        top: "82%",
                
                    }}
                >
                    <Text style={
                        {
                            fontWeight: "bold",
                            fontSize: 14,
                            flex:3
                        }
                    }>
                        Radar de visualización
                    </Text>

                </View>

                <View
                    style={{
                        flexDirection: "row",
                        position: "absolute", //use absolute position to show button on top of the map
                        // width: 300,
                        // left: "5%",
                        top: "87%",

                    }}
                >
                    <Slider
                        style={styles.Slider}
                        value={this.state.slideDistance}
                        minimumValue={1}
                        maximumValue={10}
                        step={5}
                        onValueChange={value => this.setState({ slideDistance: parseInt((value == 6) ? 5 : value) })}
                    />

                </View>

                <View style={{
                    flexDirection: "row",
                    position: "absolute", //use absolute position to show button on top of the map
                    // width: 300,
                    left: "2%",
                    top: "90%",
                }}>

                    <View style={{ flex: 1 }}>

                        <Text 
                        style={{fontWeight: "bold" }}
                        >1 Km</Text>

                    </View>

                    <View style={{flex:2}}></View>

                    <View style={{ flex: 1 }}>

                        <Text style={{ fontWeight: "bold" }}>5 Km</Text>

                    </View>

                    <View style={{flex:2}}>

                    </View>

                    <View style={{ flex: 1 }}>

                        <Text style={{ fontWeight: "bold" }}>10 Km</Text>

                    </View>



                </View>
                <View style={{
                    flexDirection: "row",
                    position: "absolute", //use absolute position to show button on top of the map
                    // width: 300,
                    left: "5%",
                    top: "96%",
                }}>
                    <View style={{ flex: 4}}></View>

                    <View style={{flex:2}}>

                        <Text style={{ fontWeight: "bold" }}>Distancia: {this.state.slideDistance}</Text>
                    
                    </View>

                </View>

         
            </View>


       
        );
    }
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f0f4f7",
        paddingBottom: 10
    },
    row: {
        height: 10,
        backgroundColor: "#f0f4f7"
    },
    line: {
        height: 2,
        backgroundColor: "#f0f4f7"
    },
    area: {
        flexDirection: "row",
        paddingBottom: 20,
        paddingLeft: 20,
        backgroundColor: "#fff"
    },
    containerMap: {
        // ...StyleSheet.absoluteFillObject,
        height: 300,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    contentContainer: {
        paddingVertical: 20
    },
    Slider:{

        // paddingBottom: 20,
        // paddingLeft: 20,
        // backgroundColor: "#fff",
        flex: 1, 
        alignItems: 'stretch', justifyContent: 'center'
    },


 
});
