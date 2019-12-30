import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput, Button } from "react-native";
import Modal from "react-native-modal";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/FontAwesome5";
import keys from "./global";
import MapView from 'react-native-maps';
import { StackActions, NavigationActions } from 'react-navigation';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';


export default class Inicio extends Component {


    constructor(props) {

        if (keys.socket == null) {

            keys.socket = SocketIOClient(keys.urlSocket);
            

        }



        super(props);
        this.state = {
            myPosition:{
                latitude:null,
                longitude:null
            },
            Comida: false,
            Flete: false,
            Taxi: true,
            showModalPay:false,
            showModalCancel:false,
            tarifaFinal:0,
            Propina:1
        };


    }

    static navigationOptions = {
        title: "Inicio"
    };




    async componentWillMount () {
        
        Flag = this.props.navigation.getParam('Flag', false);

        console.log(Flag);


        if (Flag =="terminarViaje") {

            this.setState({
                showModalPay:true
            })

        } else{
            if (Flag =="CancelarServicio"){
                this.setState({
                    showModalCancel: true
                })
            }else{
                if (Flag =="CancelarServicioUsuario"){
                    alert("Viaje cancelado por el chófer");
                }
            }
        }


        const myLocation = await Location.getCurrentPositionAsync({});
        latitude = myLocation.coords.latitude;
        longitude = myLocation.coords.longitude;


        this.setState({
            myPosition: {

                latitude: latitude,
                longitude: longitude

            },
            tarifaFinal:keys.Tarifa
       

        });

     

    }




    setPropina(tipoPropina){
        if(tipoPropina==1){
            this.setState({
                tarifaFinal: keys.Tarifa,
                Propina: tipoPropina
            })
        }else{
            if(tipoPropina==2){

                this.setState({
                    tarifaFinal: parseInt(keys.Tarifa + keys.Tarifa * .10),
                    Propina: tipoPropina
                })
            }else{
                if(tipoPropina==3){
                    this.setState({
                        tarifaFinal: parseInt(keys.Tarifa + keys.Tarifa * .15),
                        Propina: tipoPropina
                    })
                }else{
                    if(tipoPropina==4){
                        this.setState({
                            tarifaFinal: parseInt(keys.Tarifa+ keys.Tarifa + .20),
                            Propina: tipoPropina
                        })
                    }
                }
            }
        }

        console.log("Tarifa final",this.state.tarifaFinal);
        console.log("Propina", this.state.Propina);
    }

    detallesCosto(){
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'DesgloseTarifa' })],
            key: undefined
        });

        this.props.navigation.dispatch(resetAction);
    }

    render() {

        return (
            <View>

                <View  >
                    {/* Modal de cobro final */}
                    <Modal 

                        isVisible={this.state.showModalPay}
                      

                    >
                        <View style={{ marginTop: 22, backgroundColor: "#fff" }}>
                            <View>
                                <Text style={{ fontWeight: "bold", fontSize: 16, marginLeft:10 }}>Pagar al conductor</Text>
                                <View style={{paddingTop:20}}>
                                    <Text style={{ alignSelf: "center", marginLeft: 10, marginRight: 10 }}>MX${keys.Tarifa}</Text>
                                    <Text onPress={() => this.detallesCosto()} style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10, color:"blue" }}>Detalles del costo</Text>
                                </View>

                            </View>
                            {/* Cupón  */}
                            <View style={styles.area}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{flex: 1 }}>
                                    <Text>Cupón</Text>
                                </View>
                                <View style={{ flex: 2 }}></View>
                                <View style={{ flex: 2 }}>
                                    <Text>-MX$0.00</Text>
                                </View>
                    
                            </View>

                            {/* Método de pago  */}
                            <View style={styles.area}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{ flex: 2 }}>
                                    <Text>Método de pago</Text>
                                </View>
                                <View style={{ flex:  1}}></View>
                                <View style={{ flex: 2 }}>
                                    <Text>Efectivo</Text>
                                </View>
                            </View>
                            {/* Titulo de propina */}
                            <View style={styles.area}>
                                <Text style={{fontWeight:"bold"}}>Propina</Text>
                            </View>
                            {/* Mensaje de propina */}
                            <View style={{paddingTop:20, paddingLeft:20}}>
                                <View style={{ alignSelf:"center" }}>
                                    <Text >¡Da propina si lo deseas!</Text>
                                </View>
                            </View>
                            <View style={{ paddingTop: 10, paddingLeft: 20 }}>
                                <View style={{ alignSelf: "center" }}>
                                    <Text >Si deseas otorgar un extra al socio conductor</Text>
                                </View>
                            </View>
                            <View style={{ paddingTop: 10, paddingLeft: 20 }}>
                                <View style={{ alignSelf: "center" }}>
                                    <Text >siéntete en la libertad de hacerlo</Text>
                                </View>
                            </View>

                            <View style={{
                                flexDirection: "row",
                                paddingTop: 20,
                                paddingLeft: 20,
                                paddingRight:20,
                                backgroundColor: "#fff"
                            }}>
                                <View style={{flex:1.5}}>
                                    <Button
                                        title="$0.00"
                                        color={(this.state.Propina == 1) ? "#32CD32" : "#DCDCDC"}
                                        onPress={() => this.setPropina(1)}
                                    ></Button>
                           
                                </View>
                                <View style={{ flex: 1.5 }}>
                                    <Button
                                        title={"$"+String( parseInt(keys.Tarifa*.1))+".00"}
                                        color={(this.state.Propina == 2) ? "#32CD32" : "#DCDCDC" }
                                        onPress={() => this.setPropina(2)}
                                    ></Button>
                                </View>
                                <View style={{ flex: 1.5 }}>
                                    <Button
                                        title={"$"+String(parseInt(keys.Tarifa * .15))+".00"}
                                        color={(this.state.Propina == 3) ? "#32CD32" : "#DCDCDC"}
                                        onPress={() => this.setPropina(3)}
                                    ></Button>
                                </View>
                                <View style={{ flex: 1.5 }}>
                                    <Button
                                        title={"$"+String(parseInt(keys.Tarifa * .2))+".00"}
                                        color={(this.state.Propina == 4) ? "#32CD32" : "#DCDCDC"}
                                        onPress={() => this.setPropina(4)}
                                    ></Button>
                                </View>
                            </View>
                            
                            {/* Total a pagar */}

                            <View style={styles.area}>
                                <Text>Total a pagar:</Text>
                            </View>
                            <View style={{ paddingLeft: 20 }}>
                                <View style={{ alignSelf: "center" }}>
                                    <View style={{flexDirection:"row"}}>
                                        <Text>MX$</Text>
                                        <Text style={{fontWeight:"bold"}}>{this.state.tarifaFinal}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{ paddingLeft: 20, marginBottom:40 }}>
                                <View style={{ alignSelf: "center", paddingLeft: 10, paddingRight: 10, width: "100%" }}>
                                   <Button
                                   style={{width:"100%"}}
                                   title="Confirmar pago"
                                   onPress={()=>this.setState({
                                    showModalPay:false
                                   })}></Button>
                                </View>
                            </View>

                          
                        </View>


                    </Modal>

                </View>

                <View>

                    <Modal
                        isVisible={this.state.showModalCancel}

                    >
                        <View style={{ marginTop: 22, backgroundColor: "#fff" }}>
                            <View>
                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}>CANCELACIÓN REALIZADA</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10 }}>Se canceló su servicio de taxi</Text>

                            </View>
                            <View style={{
                                flexDirection: "row",
                                paddingTop: 10,
                                paddingBottom: 10,
                                paddingLeft: 20,
                                backgroundColor: "#fff",
                                alignSelf: "center"
                            }}>

                                <View style={{ marginRight: 10, width: 120 }}>

                                    <Button
                                        title="Ok"
                                        onPress={() => this.setState({
                                            showModalCancel: false,
                                          
                                        })}
                                    ></Button>
                                </View>


                            </View>
                        </View>
                    </Modal>

                </View>
                
                <View style={{ flexDirection: "row", position:"relative", paddingTop:10 }}>
                    <View style={{ flex: 1, alignContent: "center", marginLeft:10 }}>
                        <Icon name="bars" color="#ff8834" size={35}></Icon>

                    </View>

                    <View style={{ flex: 4 }}>
                        <View style={{flexDirection:"row"}}>
                    
                         
                            <View style={{ flex: 4 }}>
                                <View style={{flexDirection:"row"}}>

                                    <View style={{flex:2}}>
                                        <Text style={{color: this.state.Taxi ? "green" : "#ff8834", alignSelf:"center"}}
                                            onPress={() => this.setState({
                                                Comida: false,
                                                Flete: false,
                                                Taxi: true
                                            })}
                                        >Taxi</Text>
                                        
                                    </View>

                                    <View style={{flex:2}}>

                                        <Text style={{ color: this.state.Flete ? "green" : "#ff8834", alignSelf: "center" }}
                                            onPress={() => this.setState({
                                                Comida: false,
                                                Flete: true,
                                                Taxi: false
                                            })}
                                        >Flete</Text>

                                    </View>

                                    <View style={{flex:2}}>

                                        <Text style={{ color: this.state.Comida ? "green" : "#ff8834", alignSelf: "center" }}
                                            onPress={() => this.setState({
                                                Comida: true,
                                                Flete: false,
                                                Taxi: false
                                            })}
                                        >Comida</Text>

                                    </View>

                                </View>

                            </View>
                            <View style={{ flex: 1 }}>
                          
                            </View>

                        </View>
                    </View>
                    <View style={{ flex: 1, alignContent: "center" }}>
                        <Icon name="comment-dots" size={35} color="#ff8834"></Icon>
                    </View>

                </View>
                <View style={{flexDirection:"row", paddingTop:10, paddingLeft:10}}>
                    <View style={{ flex: 4 }}>

                        <TextInput
                            style={{ height: 40, width: "100%", borderColor: 'gray', borderWidth: 1, backgroundColor: '#DCDCDC' }}
                            placeholder=" ¿A dónde vamos?"
                            placeholderTextColor="gray"
                            onFocus={() => this.props.navigation.navigate("Travel")}
                        ></TextInput>
                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
                <View style={styles.containerMap}>

                  
                    
                    <MapView

                        style={styles.map}
                        region={{
                            latitude: this.state.myPosition.latitude,
                            longitude: this.state.myPosition.longitude,
                            latitudeDelta: 0.0105,
                            longitudeDelta: 0.0105
                        }}

                        showsUserLocation={true}
                        followsUserLocation={true}
                        showsMyLocationButton={false}


                    >
                    </MapView>
                  
                
                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        backgroundColor: "#f0f4f7",
        paddingBottom: 50
    },
    area: {
        flexDirection: "row",
        paddingTop: 20,
        paddingLeft: 20,
        backgroundColor: "#fff"
    },

    containerMap: {
        // ...StyleSheet.absoluteFillObject,
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },

});