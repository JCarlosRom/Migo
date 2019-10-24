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





export default class Home extends Component {


    constructor(props) {
        super(props);
        this.state = {
            id_chofer: "2",
            id_usuario:"1",
            nombreUsuario:"Leonel Ortega",
            numeroUsuario:"3121942513",
            myPosition:null,
            stateConductor:false
        
        };
    

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

   
    
    
  

    render() {
        return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.container}>
              <View style={styles.area}>
                  <View>
                    <Switch 
                    value={this.state.stateConductor}
                    onChange={()=>this.setState({
                        stateConductor:!this.state.stateConductor
                    })}
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
                    {this.state.stateConductor?

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
                                    <Text>{this.state.nombreUsuario}</Text>
                                    <Text>{this.state.numeroUsuario}</Text>
                                </View>

                                <View style={{paddingLeft:20}}> 
                                    <Button title="Aceptar"></Button>
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
