import React, { Component } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Keyboard } from "react-native";
import { Input } from "react-native-elements";
import keys from "./global";
import Icon from "react-native-vector-icons/FontAwesome5";



export default class Chat extends Component {

    constructor(props) {

        keys.socket.on('isConnected', () => {})

        super(props);

        this.state = {

            
            Chat:[],
            Mensaje: "",
            onFocus:false,
            initChat:true

        };

        this._keyboardDidShow = this._keyboardDidShow.bind(this);

        this._keyboardDidHide = this._keyboardDidHide.bind(this);

        keys.socket.removeAllListeners("LlegoMensaje");

        // Función para recibir el mensaje del conductor
        keys.socket.on('chat_chofer', (num) => {

            if (keys.Chat.length >= 5) {
                keys.Chat.splice(0, 1);
            }
            // console.log("chat_chofer", num)
          
            keys.Chat.push(num.Mensaje);

            this.setState({
                Chat: keys.Chat
            })

            console.log(keys.Chat);
        })







    }

    componentDidMount() {


        if (keys.Chat.length >= 5) {
            keys.Chat.splice(0, 1);
        }

        this.setState({
            Chat:keys.Chat
        })
        

        console.log("Chat",this.state.Chat);
      
        
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }


    // componentWillUnmount() {
    //     console.log("componenwillunmountChofer")
    //     keys.socket.removeAllListeners("chat_chofer");
    // }

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

        if(this.state.Mensaje!=""){

    
            var infoMessage ={
                Usuario:"Conductor",
                nombreUsuario: keys.datos_chofer.nombreChofer,
                Mensaje: this.state.Mensaje
                
            }
    
            this.setState({
                Mensaje:""
            })
            
            keys.socket.emit('room_chofer_usuario_chat',
            {
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
            
    
            console.log("Chat Conductor", keys.Chat);
        }

    }



    render() {
        return (

            <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" enabled >
                <View style={{ flex: this.state.onFocus ? 4 : 5 }}>

              
                    <View style={styles.area}>
                        <View style={{flex:2}}></View>

                        <View style={{ flex: 2 }}>
                           
                            <Text style={{fontSize:9, alignContent:"center"}}>{keys.datos_usuario.nombreUsuario}</Text>
                        
                        </View>
                       
                    </View>

                


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
