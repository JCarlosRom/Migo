import React, { Component } from "react";
import { View, Text, StyleSheet, Switch, ScrollView } from "react-native";
import { Button  } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker, AnimatedRegion } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import axios from 'axios';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions';
import keys from './global';
import * as Location from "expo-location";
import * as Permissions from 'expo-permissions';

export default class TravelMP extends Component {
    constructor(props) {
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
    

        };

        
        
    }

  
    async componentDidMount() {

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
           

          
            this.setState({
                positionUser: {
                    latitude: keys.travelInfo.puntoPartida.latitude,
                    longitude: keys.travelInfo.puntoPartida.longitude
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

        this.chofer_setPosition();

        console.log('Paradas',Paradas);
        
        
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
        const data = {
            source: {
                latitude: this.state.myPosition.latitude,
                longitude: this.state.myPosition.longitude
            },
            destination: {
                latitude: this.state.positionUser.latitude,
                longitude: this.state.positionUser.longitude
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

        if (this.state.Travel==true){
            data.waypoints = [
                {
                    latitude: this.state.parada1.latitude,
                    longitude: this.state.parada1.longitude,
                },
                {
                    latitude: this.state.parada2.latitude,
                    longitude: this.state.parada2.longitude,
                },
                {
                    latitude: this.state.parada3.latitude,
                    longitude: this.state.parada3.longitude,
                },


            ]
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
    }


   
    terminarViaje(){

        this.props.navigation.navigate("Pago");
    }
    onRegionChange = async region => {


        this.setState({
            region
        });


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
            routeParada3: false
        })
    }

    terceraParada(){


        Paradas = [];


        Paradas.push(keys.travelInfo.Parada3)

        this.setState({
            Paradas
        })

        this.state.routeParada2 = false;
        this.state.routeParada3 = true;


     

        console.log(this.state.routeInitial);
        console.log(this.state.routeParada1);
        console.log(this.state.routeParada2);
        console.log(this.state.routeParada3);


    }

 
  

    render() {
        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.container}>
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
                    {this.state.positionUser!=null?

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
                    
                     

                        {
                        this.state.routeParada3==true?


                            <MapViewDirections
                                origin={{
                                    latitude: this.state.myPosition.latitude,
                                    longitude: this.state.myPosition.longitude,
                                }}
                                destination={{
                                    latitude: keys.travelInfo.Parada3.latitude,
                                    longitude: keys.travelInfo.Parada3.longitude,
                                }}
                                apikey={keys.GOOGLE_MAPS_APIKEY}
                                strokeWidth={1}
                                strokeColor="green"
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
                                ></Icon>  
                                
                                <Icon name="angle-double-right"
                                style={{paddingLeft:10}}
                                color="red"
                                size={25}></Icon>
                               
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
                                onPress={() => {
                                    this.setState({
                                        HomeTravel: false,
                                        aceptViaje: true,
                                        showMapDirections:true,
                                    

                                    });
                                }}
                            />
                            <Text style={
                                {
                                    paddingLeft: 45
                                }
                            }>15 s</Text>
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
                            ></Icon>

                            <Icon name="angle-double-right"
                                style={{ paddingLeft: 10 }}
                                color="red"
                                size={25}></Icon>

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
                            ></Icon>

                            <Icon name="angle-double-right"
                                style={{ paddingLeft: 10 }}
                                color="red"
                                size={25}></Icon>

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
                                        onPress={() => this.setState({
                                            routeInitial: false,
                                            routeParada1: true,
                                            routeParada2: false,
                                            routeParada2: false
                                        })}
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

                                        title={(keys.type == "Multiple") ? "Ir a tercera parada" :  "Terminar Viaje"}
                                        type="clear"
                                        onPress={() =>
                                            
                                            keys.type=="Multiple"?

                                                this.terceraParada()

                                            :
                                                this.terminarViaje()
                                        }
                                    />


                                </View>


                            </View>

                            :
                            null
                        }

                        {this.state.routeParada3 ?
                            <View style={styles.area}>

                                <Icon name="angle-double-right" size={20} style={{ paddingLeft: 10, paddingTop: 25 }}></Icon>
                                <View style={
                                    {
                                        paddingLeft: 90
                                    }
                                }>


                                    <Button

                                        title="Terminar Viaje 3"
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
