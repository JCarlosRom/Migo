import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TextInput, Switch, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import keys from './global';





export default class Pago extends Component {


    constructor(props) {
        keys.socket.on('isConnected', () => { })
        super(props);
        this.state = {
          
        };


    }



    async componentDidMount() {

    

    }




    static navigationOptions = {
        title: "Viaje finalizado"
    };

     realizaPago(){

        this.props.navigation.navigate("viajeFinalizado");
    }



    render() {
        return (
            <ScrollView style={{backgroundColor:"white"}}>
                <View style={styles.container}>
                    <View style={styles.area}>
                        <View>
                            <Switch
                                value={keys.stateConductor}
                                onChange={() => this.conectChofer()}
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
                                size={30}></Icon>
                        </View>
                        <View style={
                            {
                                paddingLeft: 10,
                                paddingBottom: 5
                            }
                        }>
                            <Icon name="cog"
                                size={30}></Icon>
                        </View>
                    </View>
                   
                    <View style={styles.area}>
                        <Text>Pago con tarjeta</Text>
                    </View>
                   
                    <View style={styles.area}>
                        
                        <Text style={{ flex: 2 }}>Costo del viaje</Text>
                        <View style={{ flex: 4 }}></View>
                        <Text style={{ flex: 1 }}>${keys.Tarifa}</Text>
                    </View>
                   
                    <View style={styles.area}>
                        <Text style={{flex:2}}>Peaje</Text>
                        <View style={{flex:4}}></View>
                        <Text style={{ flex:1 }}>${keys.Peaje}</Text>
                    </View>


                    <View style={{paddingTop:260}}>

                        <Button
                            title="Iniciar pago con tarjeta"
                            type="clear"
                            
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
