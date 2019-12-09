import React, { Component } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Keyboard } from "react-native";
import { Input } from "react-native-elements";
import keys from "./global";
import Icon from "react-native-vector-icons/FontAwesome5";


export default class Chat extends Component {

    constructor(props) {

        super(props);

        this.state = {
            Chat:[],
            Mensaje: "",
            onFocus: false,
            initChat: true
        };
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);

        // Función para recibir el mensaje del conductor
        keys.socket.on('chat_usuario', (num) => {
            // console.log("chat_usuario",num)
            keys.Chat.push(num.Mensaje);
            this.setState({
                Chat: keys.Chat
            })
            if (this.state.initChat == true) {
                this.setState({
                    initChat: false
                })
            }
        })
    }

    componentDidMount() {        
        if(keys.Chat.length>0){
            this.setState({
                initChat:false
            })
        }

        this.setState({
            Chat: keys.Chat
        })
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
        this.setState({
            onFocus: true
        })
    }

    _keyboardDidHide() {
        this.setState({
            onFocus: false
        })
    }

    static navigationOptions = {
        title: "Chat"
    };

    sendMessage() {

        if (this.state.initChat == true) {
            this.setState({
                initChat: false
            })
        }

        var infoMessage = {
            Usuario: "Usuario",
            nombreUsuario: keys.datos_usuario.nombreUsuario,
            Mensaje: this.state.Mensaje
        }

        this.setState({
            Mensaje: ""
        })

        keys.socket.emit('room_usuario_chofer_chat',{
            id_socket_usuario: keys.id_usuario_socket, id_chofer_socket: keys.id_chofer_socket,
            infoMessage: infoMessage
        });

        keys.Chat.push(infoMessage);

        this.setState({
            Chat: keys.Chat
        })

    }



    render() {
        return (

            <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" enabled  >
                <View style={{ flex: this.state.onFocus ? 4 : 5 }}>

                    <View style={{ flexDirection: "row", paddingTop: 5 }}>

                        <View style={{ flex: 4 }}>

                        </View>
                        <View style={{ flex: 2, alignContent: "center" }}>
                            <Icon
                                name="phone"
                                color="#ff8834"
                                size={30}
                            ></Icon>
                        </View>
                    </View>
                    <View style={styles.area}>

                        <View style={{ flex: 2 }}>
                            <Text style={{ fontSize: 9 }}>{keys.datos_chofer.nombreChofer}</Text>
                        </View>

                        <View style={{ flex: 2 }}></View>
                        
                        <View style={{ flex: 2 }}>
                            <Text style={{ fontSize: 9, alignContent: "center" }}>{keys.datos_vehiculo.modelo} * {keys.datos_vehiculo.Matricula}</Text>
                            {/* <Text style={{ fontSize: 9 }}></Text> */}
                        </View>
                    </View>

                    {this.state.initChat ?

                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>

                            <Icon
                                name="comment-dots"
                                size={65}
                                color="#ff8834"
                            />
                            <Text style={{ alignContent: "center" }}>¿Necesitas contactar al solo conductor?</Text>
                            <Text style={{ alignContent: "center" }}>Enviale un mensaje aquí</Text>

                        </View>
                        :
                        null
                    }

                    {this.state.Chat!=[]?
                        this.state.Chat.map(element => (

                            element.Usuario == "Usuario" ?

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
                                            <Text style={{ fontWeight: "bold" }}>{element.nombreUsuario}</Text>
                                            <Text>{element.Mensaje}</Text>
                                        </View>
                                    </View>




                        ))

                        : 

                        null

                    }



                </View>

                <View style={{ flex: this.state.onFocus ? 2 : 1 }}>

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
