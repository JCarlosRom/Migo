// Importación de librerías
import React, { Component } from "react";
import { View, Text, StyleSheet, Button, ScrollView, Image } from "react-native";
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from "react-native-vector-icons/FontAwesome5";
import keys from "./global";
import Modal from "react-native-modal";
import call from 'react-native-phone-call'

// Clase principal de InfoTravel
export default class InfoTravel extends Component {

    /**
     *Creates an instance of InfoTravel.
     * Constructor de la clase InfoTravel
     * @param {*} props
     * @memberof InfoTravel
     */
    constructor(props) {
        super(props);
        this.state = {
            Destino:"",
            typePay:keys.typePay,
            timeArrival:null,
            time:null,
            Arrival: null,
            showModalCancel:false,
            showModal:false, 
            Descripcion:""
        };



    }


    /**
     * Función para llamar al chofer
     *
     * @memberof InfoTravel
     */
    callPhoneFunction() {
        const args = {
            number: keys.datos_chofer.Telefono, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
        }

        call(args).catch(console.error)
    }



    /**
     * Ciclo de vida para antes de que se monte el componente
     *
     * @memberof InfoTravel
     */
    async componentWillMount() {

        // Variables de navigation
        Type = this.props.navigation.getParam('typeTravel', 'No Address');
        timeArrival = this.props.navigation.getParam('timeArrival',null)
        Llegada = this.props.navigation.getParam('Arrival', null)
        
        // Tipo travel integrado
        if (Type =="Travel_Integrado"){
            
            var d = new Date(); // get current date
            d.setHours(d.getHours(), d.getMinutes() + timeArrival, 0, 0);
            
            this.setState({
                Destino: keys.travelInfo.Parada1,
                timeArrival: timeArrival,
                time: d.toLocaleTimeString(),
                Arrival: Llegada
            })


            
        }else{
            // Tipo de viaje Viaje sin destino
            if (Type =="Travel_SinDestino"){
                console.log(keys.travelInfo.Parada1)
                var d = new Date(); // get current date
                d.setHours(d.getHours(), d.getMinutes() + timeArrival, 0, 0);

                this.setState({
                    Destino: keys.travelInfo.Parada1,
                    timeArrival: timeArrival,
                    time: d.toLocaleTimeString(),
                    Arrival: Llegada
                })
            }else{
                // Tipo de viaje, Viaje multiples paradas 
                if (Type =="TravelMP"){
                    console.log(keys.travelInfo.Parada1)
                    var d = new Date(); // get current date
                    d.setHours(d.getHours(), d.getMinutes() + timeArrival, 0, 0);
                    this.setState({
                        Destino: keys.travelInfo.Parada3,
                        timeArrival: timeArrival,
                        time: d.toLocaleTimeString(),
                        Arrival: Llegada
                    })
                }else{
                    // Tipo de viaje, Viaje multiples 2
                    if (keys.type == "Multiple 2 paradas") { 
                    
                        var d = new Date(); // get current date
                        d.setHours(d.getHours(), d.getMinutes() + timeArrival, 0, 0);
                        this.setState({
                            Destino: keys.travelInfo.Parada2,
                            timeArrival: timeArrival,
                            time: d.toLocaleTimeString(),
                            Arrival: Llegada
                        })
                    }
                }
            }
        }
    }

    /**
     * Barra de navegación de InfoTravel
     *
     * @static
     * @memberof InfoTravel
     */
    static navigationOptions = {
        title: "Información"
    };

    /**
     * Función para cambiar el tipo de pago
     *
     * @memberof InfoTravel
     */
    changePay(){

        if(keys.typePay==1){
            keys.typePay=2;
        }else{
            if(keys.typePay==2){
                keys.typePay=1;
            }
        }

        this.setState({
            typePay:keys.typePay
        })
    }

    /**
     * Función para el chat
     *
     * @memberof InfoTravel
     */
    Chat() {

        keys.socket.removeAllListeners("chat_usuario");
        this.props.navigation.navigate("Chat")
    }

    /**
     * Función para cancelar el servicio
     *
     * @memberof InfoTravel
     */
    cancelarServicio() {
        // Generar la hora actual
        var d = new Date(); // get current date
        d.setHours(d.getHours(), d.getMinutes(), 0, 0);
        horaActual = d.toLocaleTimeString()
        // Verificar si la hora actual es menor a la hora limite
        if (horaActual < keys.HoraServicio) {
            // Se vacia el array de chat
            keys.Chat = [];
            // Transacción de cancelación 
            keys.socket.emit("cancelaUsuario", { id: keys.id_servicio })
            // Se envia el mensaje de cancelación al usuario
            keys.socket.emit('cancelViajeUsuario', { id_chofer_socket: keys.id_chofer_socket });
            // Se navega al componente de Inicio 
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Inicio', params: { Flag: "CancelarServicio" } })],
                key: undefined
            });

            this.props.navigation.dispatch(resetAction);
        } else {
            // Mensaje de cancelación
            this.setState({
                showModalCancel:false,
                showModal: true,
                Descripcion: "No se puede cancelar servicio después de 3 minutos de iniciar el servicio"
            })
        }

    }

    /**
     * Función para cambiar los destinos
     *
     * @memberof InfoTravel
     */
    goChangeDestino(){

        var d = new Date(); // get current date
        d.setHours(d.getHours(), d.getMinutes(), 0, 0);
        horaActual = d.toLocaleTimeString()

        console.log("Hora Actual", horaActual);
        console.log("Hora Servicio", keys.HoraServicio);
        // Validación de 3 minutos
        if (horaActual < keys.HoraServicio) {

            this.props.navigation.navigate("changeDestinoView", { type: keys.type })

        }else{
            this.setState({
      
                showModal: true,
                Descripcion: "No se puede cambiar de destino después de 3 minutos de iniciar el servicio"
            })
        }

    }






    /**
     * Render principal del componente 
     *
     * @returns
     * @memberof InfoTravel
     */
    render() {
        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View>
                    {/* Modal para mensajes */}
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

                {/* Modal para la cancelación del servicio */}
                <View >

                    <Modal
                        isVisible={this.state.showModalCancel}

                    >
                        <View style={{ marginTop: 22, backgroundColor: "#fff" }}>
                            <View>
                                <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 16 }}>Cancelación de servicio</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10 }}>¿Está seguro de cancelar el servicio de taxi?</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10, textAlign: "justify" }}>Recuerde que si supera x minutos después de haber</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 10, marginRight: 10, textAlign: "justify" }}>Solicitado</Text>
                                <Text style={{ alignSelf: "center", fontSize: 12, marginLeft: 15, marginRight: 10, paddingTop: 5 }}> su servicio, se le cobrará la tarifa de cancelación</Text>
                                <Icon name="clock" size={35} style={{ alignSelf: "center", marginTop: 15 }}></Icon>

                            </View>
                            <View style={{
                                flexDirection: "row",
                                paddingTop: 5,
                                marginBottom: 5

                            }}>
                                <View style={{ flex: 2 }}></View>
                                <View style={{ flex: 1, paddingRight: 5 }}>
                                    <Button
                                        buttonStyle={{
                                            backgroundColor: "#ff8834"
                                        }}
                                        title="No"
                                        onPress={() => this.setState({
                                            showModalCancel: false
                                        })}


                                    ></Button>

                                </View>

                                <View style={{ flex: 1, paddingLeft: 5 }}>

                                    <Button
                                        buttonStyle={{
                                            backgroundColor: "#ff8834"
                                        }}
                                        title="Si"
                                        onPress={() => this.cancelarServicio()}
                                    ></Button>


                                </View>
                                <View style={{ flex: 2 }}></View>
                            </View>
                        </View>


                    </Modal>

                </View>
                {/* Información de llegada de conductor */}
                <View style={styles.area}>
                    <View style={{flex:3}}>
                        {this.state.Arrival?
                            <Text style={{ fontWeight: "bold", fontSize: 14 }}>El conductor ha arrivado</Text>
                        :
                            <View>

                                <Text style={{ fontWeight: "bold", fontSize: 14 }}>A {this.state.timeArrival} min.</Text>
                                <Text style={{ fontWeight: "bold", fontSize: 14 }}>Llegada: {this.state.time}</Text>
                            
                            </View>
                        }
                    </View>
                    <View style={{flex:1}}></View>
                    <View style={{flex:2, marginRight:5}}>
                        <Button title="Ayuda" color="#ff8834"></Button>
                    </View>
                </View>
                <View
                    style={
                        {
                            backgroundColor: "black",
                        }}
                >
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 14, alignSelf: "center" }}>Verifica la matricula y los detalles del auto</Text>
                </View>
                {/* Información del chófer */}
                <View style={styles.area}>
                    <Image
                        style={{ width: 50, height: 50 }}
                        source={require("./../assets/user.png")}
                    ></Image>
                    <Image
                        style={{ width: 50, height: 50 }}
                        source={require("./../assets/Auto.png")}
                    ></Image>
                    <View style={{ paddingLeft: 120 }}>
                        <Text>{this.state.ModeloChofer}</Text>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{keys.datos_vehiculo.Matricula}</Text>
                   

                    </View>
                </View>
                {/* Nombre y reconocimientos */}
                <View style={{ alignSelf: "center", backgroundColor: "white" }}>
                    <Text >{keys.datos_chofer.nombreChofer}<Text>*{keys.datos_chofer.Estrellas}</Text> <Icon name="star"></Icon> <Text>* {keys.datos_chofer.Reconocimientos}</Text></Text>
                </View>
                {/* Telefono y cancelación */}
                <View style={styles.area}>
                    <Icon name = "phone" onPress={()=>this.callPhoneFunction()} color="#ff8834" size={30} onPress={()=>this.callPhoneFunction()}></Icon>
                    <View style={{ paddingLeft: 10 }}></View>
                    <Icon name="comment-dots"
                        color="#ff8834"
                        style={{ paddingLeft: 40 }}
                        size={25}
                        onPress={() => this.Chat()}
                    ></Icon>
                </View>
                <View >
                    <Button color="#ff8834" title="Cancelar"
                        onPress={() => this.setState({
                            showModalCancel:true
                        })}
                    ></Button>
                </View>
                {/* Cambio de destino */}
                <View style={{
                    flexDirection: "row",
                    paddingBottom: 10,
                    paddingLeft: 20,
                    backgroundColor: "#fff",
                    paddingTop: 10
                }}> 
                    <View style={{flex:1}}>
                        <Icon name="map-marker-alt" color="#ff8834" size={25}></Icon>
                    </View>
                    <View style={{flex:2}}>
                        <Text style={{ marginTop:2}}>{this.state.Destino}</Text>
                    </View>
                    <View style={{flex:1}}>

                    </View>
                    <View style={{flex:2}}>
                        <Text style={{ paddingLeft: 40, marginTop: 2, color: "blue" }} onPress={() => this.goChangeDestino()}>Agregar o cambiar</Text>
                    </View>
                </View>
                <View style={styles.line}></View>
                {/* Cambio de tipo de pago */}
                <View style={{
                    flexDirection: "row",
                    paddingBottom: 10,
                    paddingLeft: 20,
                    backgroundColor: "#fff",
                    paddingTop:10
        
                }}>
                    <View style={{flex:1}}>
                        <Icon name={this.state.typePay == 1 ? "credit-card" : "money-bill-alt"} color="#ff8834" size={25}></Icon>
                    </View>
                    <View style={{flex:2}}>
                        <Text style={{ marginTop: 2 }}>{(this.state.typePay==1? "Credito": "Efectivo")}</Text>
                    </View>
                    <View style={{flex:1}}>

                    </View>
                    <View style={{flex:2}}>

                        <Text style={{ paddingLeft: 40, marginTop: 2, color:"blue" }} onPress={()=> this.changePay()}>Cambiar</Text>

                    </View>

                </View>

                <View style={styles.line}></View>
                {/* Compartir el destino */}
                <View style={{
                    flexDirection: "row",
                    paddingBottom: 10,
                    paddingLeft: 20,
                    backgroundColor: "#fff",
                    paddingTop: 10
              
                }}>
                    <View style={{flex:1}}>

                        <Icon name="share" color="#ff8834" size={25}></Icon>

                    </View>
                    <View style={{flex:2}}>

                        <Text style={{ marginTop: 2 }}>Compartir estado del viaje</Text>

                    </View>
                    <View style={{flex:1}}></View>

                    <View style={{flex:2}}>

                        <Text style={{ paddingLeft: 40, marginTop: 2, color:"blue" }}>Compartir</Text>

                    </View>
                </View>
                <View style={styles.line}></View>

                <View style={styles.area}>
                    <View style={{ width: 300 }}>
                        <Text style={{marginTop:5}}>Guardar el destino</Text>
                        <Text style={{ marginTop: 5 }}>{this.state.Destino}</Text>
                        <Text style={{ marginTop: 5, color:"blue" }}>Agregar a mis ubicaciones guardadas</Text>
                    </View>
                </View>
                <View style={styles.line}></View>

                <View style={styles.area}>
                    <View style={{width:280}}>
                        <Text>Conduce la app de Migo</Text>
                        <Text>Únete a miles de usuarios que también conducen con Migo</Text>
                    </View>
                    <View style={{paddingTop:10}}>
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={require("./../assets/Auto.png")}
                        ></Image>
                    </View>
                </View>

                <View style={styles.line}></View>

                <View style={styles.area}>
                    <View style={{ width: 280, marginTop:5 }}>
                        <Text style={{color:"blue"}}>Pruebalo y conduce</Text>
                    </View>
                </View>




            </ScrollView>



        );
    }
}

// Estilo de InfoTravel
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f0f4f7",
        paddingBottom: 10
    },
    row: {
        height: 10,
        backgroundColor: "#f0f4f7"
    },
    line: {
        height: 2,
        backgroundColor: "#f0f4f7"
    },
    area: {
        flexDirection: "row",
        paddingBottom: 20,
        paddingLeft: 20,
        backgroundColor: "#fff"
    },

    contentContainer: {
        paddingVertical: 20
    },




});
