import React, { Component } from "react";
import { View, Text, StyleSheet, Switch, ScrollView, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import keys from './global';
import { Button } from "react-native-elements";
import Modal from "react-native-modal";
import { StackActions, NavigationActions } from 'react-navigation';





export default class Pago extends Component {


    constructor(props) {
        // keys.socket.on('isConnected', () => { })
        super(props);
        this.state = {
          Peaje:0,
          showModal:false,
          Descripcion:"",
          intervalPeaje:null,
          timerPeaje:15
        }


    }



    async componentDidMount() {

        let intervalPeaje = setInterval(() => {

            this.setState({ intervalPeaje });

            console.log(this.state.timerPeaje);

            if (this.state.timerPeaje == 0) {

                clearInterval(this.state.intervalPeaje)

                // Socket de punto de encuentro, socket puntoEncuentroUsuario
                keys.socket.emit("terminarViajeChofer", {
                    id_usuario_socket: keys.id_usuario_socket,
                    Tarifa: keys.Tarifa
                });

                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'viajeFinalizado'})],
                    key: undefined
                });

                this.props.navigation.dispatch(resetAction);




            } else {

                this.setState({
                    timerPeaje: this.state.timerPeaje - 1
                })
            }


        }, 1000);
    }

    




    static navigationOptions = {
        title: "Viaje finalizado"
    };

     realizaPago(){


         console.log("Tarifa", this.state.Peaje);
         console.log("Keys Tarifa", keys.Tarifa)


        if(!isNaN(this.state.Peaje)){

            console.log(this.state.Peaje);
    
            keys.Peaje= this.state.Peaje;
    
            if(this.state.Peaje!=0){
                keys.Tarifa = parseInt(keys.Tarifa) + parseInt(this.state.Peaje); 
            }

            console.log("Tarifa",this.state.Peaje);
            console.log("Keys Tarifa", keys.Tarifa)

            // Socket de punto de encuentro, socket puntoEncuentroUsuario
            keys.socket.emit("terminarViajeChofer", {
                id_usuario_socket: keys.id_usuario_socket,
                Tarifa: keys.Tarifa
            });
            
            clearInterval(this.state.intervalPeaje);
    
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'viajeFinalizado' })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);
        }else{
            this.setState({
                showModal:true, 
                Descripcion:"Favor de agregar un valor númerico"
            })
        }
    }



    render() {
        return (
            <ScrollView style={{backgroundColor:"white"}}>
                <View style={styles.container}>

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
                   
                    <View style={styles.area}>
                        
                        <Text style={{ flex: 2 }}>Costo del viaje:</Text>
                        <View style={{ flex: 4 }}></View>
                        <Text style={{ flex: 1 }}>${keys.Tarifa}</Text>
                    </View>
                   
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
