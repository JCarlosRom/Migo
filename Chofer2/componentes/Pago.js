// Importación de librerías 
import React, { Component } from "react";
import { View, Text, StyleSheet, Switch, ScrollView, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import keys from './global';
import { Button } from "react-native-elements";
import Modal from "react-native-modal";
import { StackActions, NavigationActions } from 'react-navigation';


/**
 *Clase principal de Pago.js
 *
 * @export
 * @class Pago
 * @extends {Component}
 */
export default class Pago extends Component {


    /** 
     * Constructor de la clase Pago
     * @param {*} props
     * @memberof Pago
     */
    constructor(props) {
        // keys.socket.on('isConnected', () => { })
        super(props);
        this.state = {
          Peaje:0,
          showModal:false,
          Descripcion:"",
          intervalPeaje:null,
          timerPeaje:30
        }


    }



    /**
     *Ciclo de vida para despúes de que se monta el componente
     *
     * @memberof Pago
     */
    async componentDidMount() {

        // Interval para cronometro de ingreso de peaje: 15 segundos
        let intervalPeaje = setInterval(() => {

            this.setState({ intervalPeaje });

            console.log(this.state.timerPeaje);

            // Condición cuando el cronómetro llega a 0 
            if (this.state.timerPeaje == 0) {

                if (this.state.Peaje!="" && !isNaN(this.state.Peaje)) {

                    keys.Peaje = this.state.Peaje;

                    if (this.state.Peaje != 0) {
                        keys.Tarifa = parseInt(keys.Tarifa) + parseInt(this.state.Peaje);
                    }

                    // Socket de emisión, terminación de viaje 
                    keys.socket.emit("terminarViajeChofer", {
                        id_usuario_socket: keys.id_usuario_socket,
                        Tarifa: keys.Tarifa
                    });
                    // Envío a la pantalla de viajefinalizado 
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'viajeFinalizado'})],
                        key: undefined
                    });
    
                    this.props.navigation.dispatch(resetAction);
                }else{
                    // Socket de emisión, terminación de viaje 
                    keys.socket.emit("terminarViajeChofer", {
                        id_usuario_socket: keys.id_usuario_socket,
                        Tarifa: keys.Tarifa
                    });
                    // Envío a la pantalla de viajefinalizado 
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'viajeFinalizado' })],
                        key: undefined
                    });

                    this.props.navigation.dispatch(resetAction);
                }

                clearInterval(this.state.intervalPeaje)





            } else {
                // Restar un segundo al cronometro, cuando sea mayor a 0 y no se confirme el pago
                this.setState({
                    timerPeaje: this.state.timerPeaje - 1
                })
            }


        }, 1000);
    }

    // Barra de navegación del Pago
    static navigationOptions = {
        title: "Viaje finalizado"
    };

     /**
      *Función para realizar el pago 
      *
      * @memberof Pago
      */
     realizaPago(){
        // Condici+on para verificar si el peaje es un valor númerico  
        if(!isNaN(this.state.Peaje)){

     
            keys.Peaje= this.state.Peaje;
    
            if(this.state.Peaje!=0){
                keys.Tarifa = parseInt(keys.Tarifa) + parseInt(this.state.Peaje); 
            }

            // Socket de emisión de termino de viaje 
            
            keys.socket.emit("terminarViajeChofer", {
                id_usuario_socket: keys.id_usuario_socket,
                Tarifa: keys.Tarifa
            });
            // Limpiar el intervalo de cronometro de peaje 
            clearInterval(this.state.intervalPeaje);
            // Envio a la vista de viajeFinalizado
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'viajeFinalizado' })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);

        }else{
            // En caso de que no sea númerico muestra mensaje "Favor de agregar un valor númerico"
            this.setState({
                showModal:true, 
                Descripcion:"Favor de agregar un valor númerico"
            })
        }
    }



    /**
     * Render principal del componente Chófer
     *
     * @returns
     * @memberof Pago
     */
    render() {
        return (
            <ScrollView style={{backgroundColor:"white"}}>
                <View style={styles.container}>
                    {/* Modal genérico de mensajes */}
                    <View>

                        <Modal
                            isVisible={this.state.showModal}

                        >
                            <View style={{ marginTop: 22, backgroundColor: "#fff" }}>
                                <View>

                                    <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}>{this.state.Descripcion}</Text>

                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    paddingTop: 5,
                                    marginBottom: 5

                                }}>
                                    <View style={{ flex: 2 }}></View>


                                    <View style={{ flex: 2, paddingBottom: 5 }}>

                                        <Button
                                            title="Ok"
                                            buttonStyle={{
                                                backgroundColor: "#ff8834"
                                            }}
                                            onPress={() => this.setState({
                                                showModal: false
                                            })}
                                        ></Button>


                                    </View>
                                    <View style={{ flex: 2 }}></View>
                                </View>
                            </View>


                        </Modal>

                    </View>
                    {/* Barra superior switch de conexión de chófer, ayuda y configuración */}
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
                                size={30}
                                color="#ff8834"
                                ></Icon>
                        </View>
                        <View style={
                            {
                                paddingLeft: 10,
                                paddingBottom: 5
                            }
                        }>
                            <Icon name="cog" color="#ff8834"
                                size={30}></Icon>
                        </View>
                    </View>
                   
                    <View style={styles.area}>
                        <Text>Pago con tarjeta</Text>
                    </View>
                   {/* Costo del viaje  */}
                    <View style={styles.area}>
                        
                        <Text style={{ flex: 2 }}>Costo del viaje:</Text>
                        <View style={{ flex: 4 }}></View>
                        <Text style={{ flex: 1 }}>${keys.Tarifa}</Text>
                    </View>
                   {/* Input de ingreso de Peaje */}
                    <View style={styles.area}>
                        <Text style={{flex:2}}>Peaje:</Text>
                        <View style={{flex:4}}></View>
                        <Text>$</Text>
                        <TextInput style={{ flex:1, borderBottomWidth:1 }}
                            onChangeText={(Peaje) => this.setState({ Peaje })}
                            value={this.state.Peaje}
                            keyboardType='numeric'

                        >
                        </TextInput>
                    </View>


                    <View style={{paddingTop:260}}>

                        <Button
                            title="Iniciar pago con tarjeta."
                            buttonStyle={{
                                backgroundColor: "#ff8834"
                            }}
                            
                            onPress={()=>this.realizaPago()}
                        />
                        
                    </View>


                   
                
        
                </View>

            </ScrollView>
        );
    }
}
// Estilos de componente Pago 
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        marginTop: 10,
        flexDirection:"column"
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
        paddingTop: 20
    },

  


});
