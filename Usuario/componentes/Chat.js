import React, { Component } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Keyboard } from "react-native";
import { Input, Button } from "react-native-elements";
import keys from "./global";
import Icon from "react-native-vector-icons/FontAwesome5";


export default class Chat extends Component {

    constructor(props) {

        super(props);

        this.state = {
            Chat:[],
            Mensaje: "",
            onFocus: false,
            initChat: true,
            Atajo: true
        };
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);

        // Función para recibir el mensaje del conductor
        keys.socket.on('chat_usuario', (num) => {
            // console.log("chat_usuario",num)

            if (keys.Chat.length >= 5) {
                keys.Chat.splice(0, 1);
            }

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

        if (keys.Chat.length >= 5) {
            keys.Chat.splice(0, 1);
        }
        
        if(keys.Chat.length>0){
            this.setState({
                initChat:false,
                Atajo:false
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

    sendMessage(Mensaje) {

        this.setState({
            Atajo: false
            
        })

        if (this.state.initChat == true) {
            this.setState({
                initChat: false
            })
        }


        if(Mensaje==""){
        
        
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

            if(keys.Chat.length>=5){
                keys.Chat.splice(0,1);
            }
    
            keys.Chat.push(infoMessage);
    
            this.setState({
                Chat: keys.Chat
            })
        }else{
         


            var infoMessage = {
                Usuario: "Usuario",
                nombreUsuario: keys.datos_usuario.nombreUsuario,
                Mensaje: Mensaje
            }

            this.setState({
                Mensaje: ""
            })

            keys.socket.emit('room_usuario_chofer_chat',{
                id_socket_usuario: keys.id_usuario_socket, id_chofer_socket: keys.id_chofer_socket,
                infoMessage: infoMessage
            });


            if (keys.Chat.length >= 5) {
                keys.Chat.splice(0, 1);
            }

            keys.Chat.push(infoMessage);

            this.setState({
                Chat: keys.Chat
            })
        }

        console.log(infoMessage)

        


      

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
                                name = "phone" onPress={()=>this.callPhoneFunction()}
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

                <View style={{ flex: this.state.Atajo ? this.state.onFocus ? 3 : 2 : this.state.onFocus ? 2 : 1 }}>

                    {this.state.Atajo?
             
                        <View style={styles.area}>
                            <View style={{flex:1}}>
                                <Button title="Estoy aquí"
                                    buttonStyle={{
                                        backgroundColor: "#ff8834",
                                    }}
                                    titleStyle={{ fontSize: 9 }}
                                    onPress={() => this.sendMessage("Estoy aquí")}
                                ></Button>
                            </View>
                            <View style={{flex:1}}></View>
                            <View style={{ flex: 1 }}>
                                <Button title="Llego enseguida"
                                    buttonStyle={{
                                        backgroundColor: "#ff8834",
                                      
                                    }}
                                    titleStyle={{ fontSize: 9 }}
                                    onPress={()=>this.sendMessage("Llego Enseguida")}
                                ></Button>
                            </View>
                            <View style={{ flex: 1 }}></View>
                            <View style={{ flex: 1 }}>
                                <Button title="Te estoy buscando"
                                    buttonStyle={{
                                        backgroundColor: "#ff8834",
                                        
                                    }}
                                    titleStyle={{ fontSize: 9 }}
                                    onPress={() => this.sendMessage("Te estoy buscando")}
                                ></Button>
                            </View>

                        </View>
                    
                    :
                        null
                    }

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
                                    onPress={()=>this.sendMessage("")}
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
