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
            actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: true } })],
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
                        <Text>$8.50</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View style={{flex:2}}>
                        <Text>Tiempo</Text>

                    </View>
                    
                    <View style={{flex:3}}></View>

                    <View style={{ flex:1 }}>
                        <Text>$32.26</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View style={{flex:2}}>
                        <Text>Distancia</Text>

                    </View>

                    <View style={{flex:3}}></View>

                    <View style={{ flex: 1 }}>
                        <Text>$1.90</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View style={{flex:2}}>

                        <Text>Subtotal</Text>

                    </View>

                    <View style={{flex:3}} ></View>

                    <View style={{ flex: 1 }}>
                        <Text>$4.50</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View style={{flex:3}}>
                        <Text>Contribución Gubernamental: 15%</Text>

                    </View>

                    <View style={{flex:2}}></View>

                    <View style={{ flex: 1 }}>
                        <Text>$0.00</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View style={{flex:2}}>

                        <Text>Cuota de Solicitud</Text>

                    </View>

                    <View style={{flex:3}}></View>

                    <View style={{flex:1}} >
                        <Text>$9.99</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View style={{flex:1}}>

                        <Text>Total</Text>

                    </View>

                    <View style={{flex:4}}></View>

                    <View style={{ flex: 1 }} >
                        <Text>${keys.Tarifa}</Text>

                    </View>
                </View>
                <View style={styles.area}>
                    <View style={{flex:2}}>

                        <Text>Propina al Conductor</Text>

                    </View>

                    <View style={{flex:3}}></View>

                    <View style={{ flex: 1 }} >
                        <Text>$0.00</Text>

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
                        <Text>${keys.Tarifa}</Text>

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
