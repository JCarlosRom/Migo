import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TextInput, ScrollView, Slider } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, {Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import axios from 'axios';
import * as Location from "expo-location";


export default class Travel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id_usuario:"2",
            slideDistance:1,
            standarSelected:false,
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

        keys.socket.emit('vehiclesInit', {
            id_usuario_socket: keys.id_usuario_socket
        });


        // Intervalo para consultar todos los conductores conectados
        this.timer_Vehicles = setInterval(() => {

            keys.socket.emit('vehiclesInit', {
                id_usuario_socket: keys.id_usuario_socket
            });


        }, 10000);



        // Socket para escuchar el socket de vehículo
        keys.socket.on('vehiclesGet', (num) => {

            this.setState({
                Vehicles:num
            })
    
            // console.log("Vehiculos Travel 1",this.state.Vehicles, "-----");
          

        })

    
        
    }

 

  

    async componentDidMount() {

        const myLocation = await Location.getCurrentPositionAsync({});
        latitude = myLocation.coords.latitude;
        longitude = myLocation.coords.longitude;

  
        this.setState({
            myPosition: {

                latitude:latitude,
                longitude:longitude

            },
            region: {
                latitude: latitude,
                longitude: longitude,
                longitudeDelta: 0.0105,
                latitudeDelta: 0.0105

            },
        
        });

          try {
       
            var location = await Location.reverseGeocodeAsync({
                latitude: this.state.myPosition.latitude,
                longitude: this.state.myPosition.longitude
            });


            locationStr =location[0]["street"] + " #" +location[0]["name"] + " " +location[0]["city"] + " " +location[0]["region"];
            
            this.setState({ location:locationStr });
           
        } catch (e) {
            this.setState({ errorMessage: e });
        }
        console.log("Error: " + this.state.errorMessage);

    

        
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

    
    async getVehicles(categoriaVehiculo, tipoVehiculo ) {
        
 

        clearInterval(this.timer_Vehicles);

        clearInterval(this.timer_VehiclesConsult);

        keys.socket.emit('vehiclesConsult', {
            categoriaVehiculo: categoriaVehiculo, tipoVehiculo: tipoVehiculo,id_usuario_socket: keys.id_usuario_socket
        });
        
        this.timer_VehiclesConsult = setInterval(() => {
 
            keys.socket.emit('vehiclesConsult', {
                categoriaVehiculo: categoriaVehiculo, tipoVehiculo: tipoVehiculo, id_usuario_socket: keys.id_usuario_socket
            });


        }, 10000);

        keys.categoriaVehiculo = categoriaVehiculo;
        
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



        clearInterval(this.timer_Vehicles);

        clearInterval(this.timer_VehiclesConsult);

        this.props.navigation.navigate("Home", {
            Address: this.state.location
        })
    }


    render() {

   
        
        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
            
            <View style={styles.container}>
               
                <View style={{
                    flexDirection: "row",
                    backgroundColor: "#fff", paddingLeft: 10,
     
                }}>
                <Icon
                    color="#ff8834"
                    name="times-circle"
                    size={30}
                    // onPress={() => this.reinitializeComponents()}
                    style={{

                        paddingLeft: 15,
                        paddingBottom:10,
                        paddingTop:10
                    }
                    }
                />
            </View>
            <View style={styles.area}>

                <View>
                    <TextInput
                  
                        style={{ height: 40, width: 270, borderColor: 'gray', borderWidth: 1, backgroundColor: '#DCDCDC' }}
                        value={this.state.location}
                        placeholderTextColor="gray"
                    ></TextInput>
                </View>
            </View>

               <View style={{
                    flexDirection: "row",
                    backgroundColor: "#fff", paddingLeft: 20,
                    paddingBottom: 20
                }}>
                    <TextInput
                        style={{ height: 40, width: 270, borderColor: 'gray', borderWidth: 1, backgroundColor: '#DCDCDC' }}
                        placeholder=" ¿A dónde vamos?"
                        placeholderTextColor="gray"
                            onFocus={() => this.saveConfiguration()}
                    ></TextInput>
                        <Icon name="plus"
                        color="#ff8834"
                        onPress={() => this.saveConfiguration()} 
                         size={30} style={{ paddingLeft: 15 }}></Icon>
                    
                </View>
                

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
                </View>
             
                <View
                    style={
                        styles.area
                    }
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
                        paddingBottom: 20,
                        backgroundColor: "#fff"
                    }
                    }>
                    
                    <View style={{flex:1}}></View>

                    <View style={{flex:1}}>
                            <Icon
                                color="#ff8834"
                                name="car-side"
                                size={35}
                                color={this.state.standarSelected ? "green" : "#ff8834"}
                                onPress={() => this.setSelectedVehicle(1,1)}
                                style={
                                    {
                                        marginRight: 15
                                    }
                                }
                            ></Icon>

                            <Text style={{ fontSize: 9 }}> Estandar</Text>

                    </View>

                    <View style={{ flex: 1 }}>

                        <Icon
                            color="#ff8834"
                            name="car"
                            size={35}
                            color={this.state.luxeSelected ? "green" : "#ff8834"}
                            onPress={() => this.setSelectedVehicle(1,2)}
                            style={
                                {
                                    marginRight: 15
                                }
                            }
                        ></Icon>
                        
                        <Text style={{ fontSize: 9 }}>De Lujo</Text>
                    </View>


                    <View style={{ flex: 1 }}>

                        <Icon
                            color="#ff8834"
                            name="shuttle-van"
                            size={35}
                            color={this.state.VanSelected ? "green" : "#ff8834"}
                            onPress={() => this.setSelectedVehicle(2)}
                            style={
                                {
                                    marginRight: 15
                                }
                            }
                        ></Icon>

                        <Text style={{ fontSize: 9 }}>Van</Text>

                    </View>

                    <View style={{ flex: 1 }}>
                        <Icon
            
                            name="truck-pickup"
                            color={this.state.TruckSelected ? "green" : "#ff8834"}
                            size={35}
                            onPress={() => this.setSelectedVehicle(3)}
                            style={
                                {
                                    marginRight: 15
                                }
                            }
                        ></Icon>

                        <Text style={{fontSize:9}}>Camioneta</Text>
                        
                    </View>

                    <View style={{ flex: 1 }}></View>

              
                    
                

                </View>

                <View
                    style={
                       styles.area
                    }
                >
                    <Text style={
                        {
                            fontWeight: "bold",
                            fontSize: 14
                        }
                    }>
                        Radar de visualización
                    </Text>
                
                </View>

                <View style={ styles.Slider}>

                        <Slider
                            value={this.state.slideDistance}
                            minimumValue={1}
                            maximumValue={10}
                            step={5}
                            onValueChange={value => this.setState({ slideDistance:parseInt((value==6)? 5: value) })}
                        />
                        <View style={styles.area}>

                            <View style={{flex:3}}>

                                <Text>1 Km</Text>
                            
                            </View>


                            <View style={{ flex: 3 }}>

                                <Text>5 Km</Text>

                            </View>

                            <View style={{ flex: 1 }}>

                                <Text>10 Km</Text>

                            </View>
                        

                        </View>
                        <Text>Distancia: {this.state.slideDistance}</Text>
        
                </View>

                    
            </View>
            </ScrollView>
       
      
   
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

        paddingBottom: 20,
        paddingLeft: 20,
        backgroundColor: "#fff",
        flex: 1, alignItems: 'stretch', justifyContent: 'center'
    },


 
});
