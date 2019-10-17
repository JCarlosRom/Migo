import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TextInput, ScrollView, Slider } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, {Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import axios from 'axios';
import * as Location from "expo-location";
import Home from "./Home";






export default class Travel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id_usuario:"2",
            slideDistance:0,
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
            Vehicles:null,
            location:null, 
     
            
        
      


        };

    
        
    }

    //  origin = { latitude: this.state.myPosition.latitude, longitude: this.state.myPosition.longitude };
    //  destination = { latitude: this.state.Destino.latitude, longitude: this.state.Destino.longitude };
    //  GOOGLE_MAPS_APIKEY = '…';

  

    async componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
          
                this.setState({
                    myPosition:{
                    
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    
                    },
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
        );

    
        try {
            //console.log(this.props.switchValue);
            const res = await axios.post('http://34.95.33.177:3003/webservice/interfaz204/MostrarDestinosFavoritos', {
                id_usuario: this.state.id_usuario
            });


            this.setState({
                Destino:{
                    latitude: parseFloat(res.data.datos[0]["coordenadas"].substring(0,9)),
                    longitude: parseFloat(res.data.datos[0]["coordenadas"].substring(10,22)),
                }

              
            })
            


        } catch (e) {
            console.log(e);
            alert("No hay conexión al web service", "Error");
        }

        try {
            //console.log(this.props.switchValue);
            const res = await axios.get('http://34.95.33.177:3004/get_conductores');

            this.state.Vehicles = res.data


        } catch (e) {
            console.log(e);
            alert("No hay conexión al web service", "Error");
        }

    

    
   
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
        // this.props.navigation.navigate("Save", {
        //     result: this.state.location,
        //     error: this.state.errorMessage,
        //     flag: true
        // });


        
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

    setSelectedVehicle(name){

        this.getVehicles();

        if (name == "Car standar"){
            

            this.setState({
                standarSelected: true,
                luxeSelected: false,
                VanSelected: false,
                TruckSelected: false,
                showLeftCars:true

            })

         

     

        }else{
            if (name =="Car luxe"){

                this.setState({

                    standarSelected: false,
                    luxeSelected: true,
                    VanSelected: false,
                    TruckSelected: false,
                    showLeftCars: true

                });

            }else{
                if (name =="Van car"){

                    this.setState({

                        standarSelected: false,
                        luxeSelected: false,
                        VanSelected: true,
                        TruckSelected: false,
                        showLeftCars: true
                    });


                
                }else{
                    if (name =="Pick up Car"){

                        this.setState({

                            standarSelected: false,
                            luxeSelected: false,
                            VanSelected: false,
                            TruckSelected: true,
                            showLeftCars: true

                        });

                    }
                }
            }
           
        }

       
    }

    
    
    async getVehicles() {
        try {
            //console.log(this.props.switchValue);
            const res = await axios.get('http://34.95.33.177:3004/get_conductores');

            this.state.Vehicles = res.data

            // console.log(this.state.vehicles);

        } catch (e) {
            console.log(e);
            alert("No hay conexión al web service", "Error");
        }


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

    _onMapReady = () => this.setState({ marginBottom: 0 })


    // Vehicles = setInterval(async function (){
    //     try {
    //         //console.log(this.props.switchValue);
    //         const res = await axios.get('http://34.95.33.177:3004/get_conductores');

    //         return res.data
           

    //     } catch (e) {
    //         console.log(e);
    //         alert("No hay conexión al web service", "Error");
    //     }
    // }, 3000);

    render() {

   
        
        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
            
            <View style={styles.container}>
               
                <View style={{
                    flexDirection: "row",
                    backgroundColor: "#fff", paddingLeft: 10,
     
                }}>
                <Icon
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
                        onFocus={() => this.functionShowFavoritePlaces()}
                    ></TextInput>
                        <Icon name="plus"
                        //  onPress={() => this.showArrival()} 
                         size={30} style={{ paddingLeft: 15 }}></Icon>
                    
                </View>

                <View style={styles.containerMap}>
                    <MapView

                        style={styles.map}
                        region={{
                            latitude: this.state.myPosition.latitude,
                            longitude: this.state.myPosition.longitude,
                            latitudeDelta: 0.0105,
                            longitudeDelta: 0.0105,
                        }}
                        
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
                                <Icon name="map-pin" size={20} color="orange"></Icon> 
                            </Marker>

                            {
                                this.state.Vehicles!=null?
                                this.state.Vehicles.map(marker => (
                            
                                    <Marker
                                        key={marker.id}
                                        coordinate={{
                                            latitude: marker.latitud,
                                            longitude: marker.longitud
                                        }}
                                        // title={marker.title}
                                        // description={marker.description}
                                    >
                                        <Icon name="car" size={20} color="black"></Icon> 

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
                            Vehículos disponibles: {this.props.carsLeftStandar}
                    </Text>
                    :
                        null
                    }

                </View>

          
                <View
                    style={{

                        flexDirection: "row",
                        paddingBottom: 20,
                        paddingLeft: 80,
                        backgroundColor: "#fff"
                    }
                    }
             
          >
                    <Icon
                        name="car-side"
                        size={40}
                        color={this.state.standarSelected? "green": "black"}
                        onPress={()=>this.setSelectedVehicle("Car standar")}
                        style={
                            {
                                marginRight:15
                            }
                        }
                    ></Icon>
                    <Icon
                        name="car"
                        size={35}
                        color={this.state.luxeSelected ? "green" : "black"}
                            onPress={() => this.setSelectedVehicle("Car luxe")}
                        style={
                            {
                                marginRight: 15
                            }
                        }
                    ></Icon>
                    <Icon
                        name="shuttle-van"
                        size={35}
                        color={this.state.VanSelected ? "green" : "black"}
                        onPress={() => this.setSelectedVehicle("Van car")}
                        style={
                            {
                                marginRight: 15
                            }
                        }
                    ></Icon>
                    <Icon
                        name="truck-pickup"
                        color={this.state.TruckSelected ? "green" : "black"}
                        size={35}
                        onPress={() => this.setSelectedVehicle("Pick up Car")}
                        style={
                            {
                                marginRight: 15
                            }
                        }
                    ></Icon>

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
                            step={4}
                            onValueChange={value => this.setState({ slideDistance:value })}
                        />
                        <Text>Distancia: {parseInt(this.state.slideDistance)}</Text>
        
                </View>
                    
            </View>
            </ScrollView>
       
      
   
        );
    }
}

Travel.defaultProps = {
    carsLeftStandar:5,
    luxeSelected:10,
    VanSelected:2,
    TruckSelected:7,
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
