import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { ScrollView } from "react-native-gesture-handler";
import axios from 'axios';


export default class DesgloseTarifa extends Component {
    constructor(props) {
        super(props);
        this.state = {
          


        };



    }

    static navigationOptions = {
        title: "Desglose tarifa"
    };



    render() {
        return (

            <ScrollView>
                <View style={styles.area}>
                    <Text>Tu tarifa será el precio indicado antes del viaje o se basará en las tarifas mostradas abajo y otros recargos y ajustes aplicados</Text>

                </View>
           
                <View style={styles.area}>
                    <View>
                        <Text>Tarifa Base</Text>

                    </View>
                    <View style={{ paddingLeft: 215 }}>
                        <Text>$8.50</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View>
                        <Text>Tarifa Mínima</Text>

                    </View>
                    <View style={{ paddingLeft: 200 }}>
                        <Text>$32.26</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View>
                        <Text>+ Minuto</Text>

                    </View>
                    <View style={{ paddingLeft: 230 }}>
                        <Text>$1.90</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View>
                        <Text>+ Kilometro</Text>

                    </View>
                    <View style={{ paddingLeft: 212 }}>
                        <Text>$4.50</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View>
                        <Text>Peajes Estimados</Text>

                    </View>
                    <View style={{ paddingLeft: 170 }}>
                        <Text>$0.00</Text>

                    </View>
                </View>

                <View style={styles.area}>
                    <View>
                        <Text>Recargos Estimados</Text>

                    </View>
                    <View style={{marginLeft:150}} >
                        <Text>$9.99</Text>

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
