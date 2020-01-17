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
        title: "Detalles de Tarifa de Cancelación "
    };

    backToInicio() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicio" } })],
            key: undefined
        });

        this.props.navigation.dispatch(resetAction);
    }


    render() {
        return (

            <ScrollView>
                <View style={styles.area}>
                    <View style={{ flex: 1 }}>
                        <Icon
                            name="arrow-left"
                            color="#ff8834"
                            size={25}
                            onPress={() => this.backToInicio()}
                        ></Icon>
                    </View>

                </View>

                <View style={styles.area}>
                    <Text style={{ fontWeight: "bold", fontSize: 12 }}>Tarifa de Cancelación</Text>

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
        paddingRight: 20
    },


});
