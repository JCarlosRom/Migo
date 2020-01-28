// Importación de librerías 
import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Switch, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Button } from "react-native-elements";
import { StackActions, NavigationActions } from 'react-navigation';

// Clase principal de viajeFinalizado
export default class viajeFinalizado extends Component {


    /**
     *Creates an instance of viajeFinalizado.
     * Constructor de la clase viajeFinalizado
     * @param {*} props
     * @memberof viajeFinalizado
     */
    constructor(props) {
        // keys.socket.on('isConnected', () => { })
        super(props);
        this.state = {
            id_usuario: null,
            Tarifa: 0,
            nombreUsuario:""
     

        };


    }


    /**
     *Función para finalizar el viaje
     *
     * @memberof viajeFinalizado
     */
    finalizarViaje(){

        // Socket para quitar al chófer de la cola
        keys.socket.emit('popChofer', {
            id_chofer_socket: keys.id_chofer_socket,
            id_usuario_socket: keys.id_usuario_socket, Msg: "Viaje Finalizado"
        });
        // Limpia el intervalo de transmisión de coordenadas de chofer a usuario
        clearInterval(keys.intervalBroadcastCoordinates);

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home', params: { Flag: "finalizarViaje" } })],
            key: undefined
        });

        this.props.navigation.dispatch(resetAction);
    }




    /**
     * Barra de navegación
     *
     * @static
     * @memberof viajeFinalizado
     */
    static navigationOptions = {
        title: "Viaje finalizado"
    };




    /**
     * Render principal del componente
     *
     * @returns
     * @memberof viajeFinalizado
     */
    render() {
        return (
            <ScrollView style={{ backgroundColor: "white" }}>
                <View style={styles.container}>
                    {/* Barra superior del componente */}
                    <View style={styles.area}>
                        <View>
                            <Switch
                                value={keys.stateConductor}
                     
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
                                color="#ff8834"
                                size={30}></Icon>
                        </View>
                        <View style={
                            {
                                paddingLeft: 10,
                                paddingBottom: 5
                            }
                        }>
                            <Icon name="cog"
                                color="#ff8834"
                                size={30}></Icon>
                        </View>
                    </View>
                    <View style={styles.area}>
                        <Text>Pago con tarjeta</Text>
                    </View>
                    
                    <View style={styles.area}>
                        <View>
                            <Text style={{fontWeight:"bold"}}>{keys.Tarifa}MN$</Text> 
                            <Text>La tarifa del servicio ha sido aplicada</Text>
                        </View>
                    </View>

                    <View style={styles.area}>
                        <View style={{flex:3}}>
                            <View style={{flexDirection:"row"}}>
                                <View>
                                    <Image
                                        style={{ width: 50, height: 50 }}
                                        source={require("./../assets/user.png")}
                                    ></Image>  
                                </View>
                                <View style={{ paddingLeft: 10 }}>
                                    <Text style={{ marginTop: 3, fontWeight: "bold"}}>{keys.nombreUsuario}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flex:2}}></View>
                        <View style={{flex:3}}>
                            <View style={{flexDirection:"row"}}>
                                <View>
                                    <Text>Calificar</Text>
                                </View>
                                <View style={{paddingLeft:10}}>
                                    <Icon name="chevron-right" size={15} style={{ marginTop: 3 }} color="#ff8834"></Icon>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* Botones */}
                    <View style={{ paddingTop: 30, backgroundColor:"white"}}>

                        <View style={{ alignSelf: "center", width:280 }}>

                            <Button buttonStyle={{
                                backgroundColor: "#ff8834"
                            }} title="Empezar el próximo viaje"></Button>

                        </View>

                        <View style={{ alignSelf: "center", paddingTop: 10, width: 280}}>

                            <Button buttonStyle={{
                                backgroundColor: "#ff8834"
                            }} title="No disponible"></Button>

                        </View>

                    </View>


                    <View style={{ paddingTop: 10, backgroundColor: "white" }}>

                        <View style={{ alignSelf: "center", width: 280 }}>

                            <Button buttonStyle={{
                                backgroundColor: "#ff8834"
                            }} title="Finalizar el viaje" onPress={() => this.finalizarViaje()}></Button>

                        </View>


                    </View>

                </View>

            </ScrollView>
        );
    }
}
// Estilos de viajeFinalizado
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f0f4f7",
        marginTop: 10,
        flexDirection: "column"
    },
    row: {
        height: 10,
        backgroundColor: "#f0f4f7"
    },


    area: {
        flexDirection: "row",
        paddingLeft: 10,
        backgroundColor: "#fff",
        paddingTop: 10
    },



});
