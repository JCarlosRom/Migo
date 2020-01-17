import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { createStackNavigator } from "react-navigation-stack";
import { ScrollView } from "react-native-gesture-handler";
import { StackActions, NavigationActions } from 'react-navigation';
import axios from 'axios';
import keys from "./global";


export default class DesgloseTarifa extends Component {
    constructor(props) {
        super(props);
        this.state = {
          


        };



    }

    static navigationOptions = {
        title: "Desglose tarifa"
    };

    backToInicio(){
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "terminarViaje" } })],
            key: undefined
        });

        this.props.navigation.dispatch(resetAction);
    }


    render() {
        return (

            <ScrollView>
                <View style={styles.area}>
                    <View style={{flex:1}}>
                        <Icon
                            name="arrow-left"
                            color="#ff8834"
                            size={25}
                            onPress={()=>this.backToInicio()}
                        ></Icon>
                    </View>

                </View>

                <View style={styles.area}>
                    <Text style={{fontWeight:"bold", fontSize:1}}>Recibo de MiGo</Text>

                </View>
           
                <View style={styles.area}>
                    <View style={{flex:2}}>
                        <Text>Tarifa Base</Text>

                    </View>
                    
                    <View style={{flex:3}}></View>

                    <View style={{ flex: 1 }}>
                        <Text>${keys.Tarifa.tarifaBase}</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View style={{flex:2}}>
                        <Text>Tiempo</Text>

                    </View>
                    
                    <View style={{flex:3}}></View>

                    <View style={{ flex:1 }}>
                        <Text>${keys.Tarifa.porMinuto}</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View style={{flex:2}}>
                        <Text>Distancia</Text>

                    </View>

                    <View style={{flex:3}}></View>

                    <View style={{ flex: 1 }}>
                        <Text>${keys.Tarifa.porKilometro}</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View style={{flex:2}}>

                        <Text>Subtotal</Text>

                    </View>

                    <View style={{flex:3}} ></View>

                    <View style={{ flex: 1 }}>
                        <Text>${keys.Tarifa.Total}</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View style={{flex:3}}>
                        <Text>Contribución Gubernamental: 15%</Text>

                    </View>

                    <View style={{flex:2}}></View>

                    <View style={{ flex: 1 }}>
                        <Text>${keys.Tarifa.Gob}</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View style={{flex:2}}>

                        <Text>Cuota de Solicitud</Text>

                    </View>

                    <View style={{flex:3}}></View>

                    <View style={{flex:1}} >
                        <Text>${keys.Tarifa.Solicitud}</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View style={{flex:1}}>

                        <Text>Total</Text>

                    </View>

                    <View style={{flex:4}}></View>

                    <View style={{ flex: 1 }} >
                        <Text>${keys.Tarifa.Total}</Text>

                    </View>
                </View>
                <View style={styles.area}>
                    <View style={{flex:2}}>

                        <Text>Propina al Conductor</Text>

                    </View>

                    <View style={{flex:3}}></View>

                    <View style={{ flex: 1 }} >
                        <Text>${keys.Tarifa.Propina}</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View style={{flex:3}}>
                        
                        <View style={{flexDirection:"row"}}>
                            <View style={{marginRight:10}}>

                                <Icon
                                    name="money-bill-alt"
                                    size={20}
                                ></Icon>

                            </View>
                            <Text>Pagado en efectivo</Text>
                            
                        </View>

                    </View>

                    <View style={{flex:2}}></View>

                    <View style={{ flex: 1 }} >
                        <Text>${keys.Tarifa.Total+keys.Tarifa.Propina}</Text>

                    </View>
                </View>

             
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
 
    area: {
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        backgroundColor: "#fff",
        paddingRight:20
    },

 
});
