import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TextInput, Switch, ScrollView  } from "react-native";
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
import BottomNavigation, {
    FullTab
} from 'react-native-material-bottom-navigation'



export default class Home extends Component {


    constructor(props) {
        super(props);
        this.state = {
       
     
        };
    

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
                    />
                  </View>
                  <View>
                    <Text >Conectado</Text>
                  </View>
                  <View style={
                      {
                        paddingLeft:120
                      }
                  }>
                    <Icon name="exclamation-circle"
                    size={30}></Icon>
                  </View>
                    <View style={
                        {
                            paddingLeft: 10
                        }
                    }>
                        <Icon name="question-circle"
                            size={30}></Icon>
                    </View>
                    <View style={
                        {
                            paddingLeft: 10
                        }
                    }>
                        <Icon name="cog"
                            size={30}></Icon>
                    </View>
              </View>
              
                    <View style={styles.containerMap}>
                        <MapView

                            style={styles.map}
                            region={{
                                latitude: 19.2398017,
                                longitude: - 103.7546414,
                                latitudeDelta: 1,
                                longitudeDelta: 1,
                            }}
                        >
                        </MapView>
                    
                    </View>
                    <View
                        style={styles.area}
                    >
                        <View  style={
                            {
                                width:130
                               
                            }
                        }>
                            <Button title="Multiples paradas" onPress={() => this.props.navigation.navigate("TravelMP")} ></Button>
                        </View>
                        <View style={
                            {
                                width: 100,
                                marginLeft: 10
                            }
                        }> 
                            <Button title="Viaje integrado"
                            ></Button>
                        </View>
                        <View style={
                            {
                                width: 90,
                                marginLeft: 10
                            }
                        }>
                            <Button title="Viaje Waze" ></Button>
                        </View>
                    </View>
                    <View style={
                        styles.area
                    }>
                        <Text style={
                            {
                                textAlign: 'center'
                            }
                        }>Banner promocional de referidos</Text>

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
        height: 300,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop:10
    },
    map: {
        ...StyleSheet.absoluteFillObject,
      
    },
 
});
