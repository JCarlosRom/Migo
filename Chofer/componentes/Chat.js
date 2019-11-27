import React, { Component } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Input } from "react-native-elements";
import keys from "./global";
import { Icon } from "react-native-elements";


export default class Chat extends Component {

    constructor(props) {

        super(props);

        this.state = {

            
            Chat:[],
            Mensaje: "",

        };

        // Función para recibir el mensaje del conductor
        keys.socket.on('chat_chofer', (num) => {


            console.log("chat_chofer", num)

          
            keys.Chat.push(num.Mensaje);

            this.setState({
                Chat: keys.Chat
            })

            console.log(keys.Chat);
        })







    }

    componentDidMount() {

        this.setState({
            Chat:keys.Chat
        })
        
    }



    static navigationOptions = {
        title: "Chat"
    };

    sendMessage() {

        var infoMessage ={
            Usuario:"Conductor",
            nombreUsuario: keys.datos_chofer.nombreChofer,
            Mensaje: this.state.Mensaje
            
        }

        
        keys.socket.emit('room_chofer_usuario_chat',
        {
            id_socket_usuario: keys.id_usuario_socket, id_chofer_socket: keys.id_chofer_socket,
            infoMessage: infoMessage
        });

             
        keys.Chat.push(infoMessage);

        this.setState({
            Chat: keys.Chat
        })
        

        console.log("Chat Conductor", keys.Chat);
    }



    render() {
        return (

            <KeyboardAvoidingView style={{ flex: 1 }} >
                <View style={{ flex: 5 }}>

                    {this.state.Chat!=[]?

                        this.state.Chat.map(element => (

                            element.Usuario == "Conductor" ?

                                <View style={styles.area}>
                                    <View style={{ flex: 3 }}></View>
                                    <View style={{ flex: 3 }}>
                                        <Text style={{ fontWeight: "bold" }}>{element.nombreUsuario}</Text>
                                        <Text>{element.Mensaje}</Text>
                                    </View>
                                </View>

                                :
                                <View style={styles.area}>
                                    <View style={{ flex: 2 }}>
                                        
                                        <Text style={{fontWeight:"bold"}}>{element.nombreUsuario}</Text>
                                        <Text>{element.Mensaje}</Text>
                                    </View>
                                </View>

                        ))
                    :
                        null
                    }



                </View>

                <View style={{ flex: 1 }}>

                    <View style={styles.area}>

                        <Input
                            value={this.state.Mensaje}
                            placeholder="Ingresa tu mensaje aquí"
                            onChangeText={Mensaje => this.setState({
                                Mensaje: Mensaje
                            })}
                            rightIcon={
                                <Icon
                                    name="reply"
                                    onPress={()=>this.sendMessage()}
                                    size={24}
                                    color="#ff8834"
                                />

                            }
                            
                        />

                    </View>

                </View>


            </KeyboardAvoidingView >


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
