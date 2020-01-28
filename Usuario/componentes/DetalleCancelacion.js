// Importación de librerías 
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { ScrollView } from "react-native-gesture-handler";
import { StackActions, NavigationActions } from 'react-navigation';
// Clase principal del componente
export default class DesgloseTarifa extends Component {
    /**
     *Creates an instance of DesgloseTarifa.
     * Constructor de DesgloseTarifa
     * @param {*} props
     * @memberof DesgloseTarifa
     */
    constructor(props) {
        super(props);
        this.state = {



        };



    }

    /**
     * Barra de navegación de DesgloseTarifa
     *
     * @static
     * @memberof DesgloseTarifa
     */
    static navigationOptions = {
        title: "Detalles de Tarifa de Cancelación "
    };

    /**
     * Función para regresa a la vista de CancelarServicii
     *
     * @memberof DesgloseTarifa
     */
    backToInicio() {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicio" } })],
            key: undefined
        });

        this.props.navigation.dispatch(resetAction);
    }


    /**
     * Render principal del componente
     *
     * @returns
     * @memberof DesgloseTarifa
     */
    render() {
        return (

            <ScrollView>
                {/* Botón para regresar a pantalla anterior */}
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
// Estilos de DetalleCancelación
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
