import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TextInput, ScrollView, Slider } from "react-native";
import { Divider, CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
    createAppContainer,
    StackActions,
    NavigationActions
} from "react-navigation"; // Version can be specified in package.json
import { createStackNavigator } from "react-navigation-stack";
import { stringify } from "qs";
import MapView from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps


export default class Travel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideDistance:0,
            standarSelected:false,
            luxeSelected:false,
            VanSelected:false,
            TruckSelected:false,
            showLeftCars:false

        };

        
        
    }

    setSelectedVehicle(name){
        if (name == "Car standar"){
            

            this.setState({
                standarSelected: true,
                luxeSelected: false,
                VanSelected: false,
                TruckSelected: false,
                showLeftCars:true

            })

            console.log(this.state.standarSelected);

     

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

    
         



    static navigationOptions = {
        title: "Viaje"
    };





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
                    onPress={() => this.reinitializeComponents()}
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
                        placeholder=" Plaza galerías"
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
                    ></TextInput>
                        <Icon name="plus" onPress={() => this.showArrival()} size={30} style={{ paddingLeft: 15 }}></Icon>
                    
                </View>

                <View style={styles.containerMap}>
                    <MapView

                        style={styles.map}
                        region={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }}
                    >
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
                            maximumValue={10}
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
        width: 400,
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
