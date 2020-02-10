// Importaciones de librería 
import React, { Component } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Keyboard, BackHandler } from "react-native";
import { Input, Button } from "react-native-elements";
import keys from "./global";
import Icon from "react-native-vector-icons/FontAwesome5";
import call from 'react-native-phone-call'
// Clase principal del componente
export default class Chat extends Component {

    /**
     *Creates an instance of Chat.
     * Constructor de la clase principal Chat
     * @param {*} props
     * @memberof Chat
     */
    constructor(props) {

        super(props);

        this.state = {
            // Array de mensajes del chat 
            Chat:[],
            // Mensaje volatil para guardarlo en el array
            Mensaje: "",
            // estado para detectar cuando el teclado se esté mostrando
            onFocus: false,
            // Estado para monstrar la vista inicial dentro del campo de chat
            initChat: true,
            // Mensajes automaticos
            Atajo: true
        };
        // Evento para detectar si se muestra el teclado
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        // Evento para detectar si se oculta el teclado 
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        // Socket para remover todos los sockets de "LlegoMensaje"
        keys.socket.removeAllListeners("LlegoMensaje");

        // Función para recibir el mensaje del conductor
        keys.socket.on('chat_usuario', (num) => {
            
            // Verificación de que el chat no tenga mas de 5 mensajes 
            if (keys.Chat.length >= 5) {
                keys.Chat.splice(0, 1);
            }
            // Anexo de mensaje al array de chat
            keys.Chat.push(num.Mensaje);
            this.setState({
                Chat: keys.Chat
            })
            // Se agrega al state de Chat
            if (this.state.initChat == true) {
                this.setState({
                    initChat: false
                })
            }
        })
    }

    /**
     * Función para llamar al usuario
     *
     * @memberof Chat
     */
    callPhoneFunction() {
        const args = {
            number: keys.datos_chofer.Telefono, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
        }

        call(args).catch(console.error)
    }

    

    /**
    *
    * Ciclo de vida para despúes de que se monta el componente
    * @memberof Chat
    */
    componentDidMount() {    

        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton)
        // Verificación de que el chat no tenga mas de 5 mensajes 
        if (keys.Chat.length >= 5) {
            keys.Chat.splice(0, 1);
        }
        // Se quitan el mensaje inicial en el chat y los mensajes automaticos
        if(keys.Chat.length>0){
            this.setState({
                initChat:false,
                Atajo:false
            })
        }
        // Se asigna el array al state de Chat
        this.setState({
            Chat: keys.Chat
        })
    }


    handleBackButton() {
        console.log("Chat");

        return true;
    }


    /**
    *
    *Ciclo de vida para antes de que se monte el componente
    * @memberof Chat
    */
    componentWillMount() {
        // Evento para agregar el listener del teclado, Mostrar teclado
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
         // Evento para agregar el listener del teclado, Ocultar teclado
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    /**
    * Función para detectar cuando el componete se va a desmontar
    *
    * @memberof Chat
    */
    componentWillUnmount() {
        // Remueve el evento que detecta cuando el teclado se muestra
        this.keyboardDidShowListener.remove();
        // Remueve el evento que detecta cuando el teclado se oculta
        this.keyboardDidHideListener.remove();
    }
    // Función que se dispara cuando el teclado se va a mostrar
    _keyboardDidShow() {
        // Se asigna valor true al state on focus, para acomodar el input de mensaje
        this.setState({
            onFocus: true
        })
    }
    // Función que se dispara cuando el teclado se va a ocultar 
    _keyboardDidHide() {
          // Se asigna valor false al state on focus, para acomodar el input de mensaje
        this.setState({
            onFocus: false
        })
    }
    // Barra de navegación del chat
    static navigationOptions = {
        title: "Chat"
    };

    /**
    *Función para enviar un mensaje de chat
    *
    * @memberof Chat
    */
    sendMessage(Mensaje) {
        // Verifica que el mensaje sea diferente de vacio
        if(this.state.Mensaje!=""){
            // Desactiva los mensajes automaticos 
            this.setState({
                Atajo: false
                
            })
            // Quitar el mensaje inicial del chat
            if (this.state.initChat == true) {
                this.setState({
                    initChat: false
                })
            }
    
    
            if(Mensaje==""){
            
                // Formato del mensaje que se envía al socket de usuario 
                var infoMessage = {
                    Usuario: "Usuario",
                    nombreUsuario: keys.datos_usuario.nombreUsuario,
                    Mensaje: this.state.Mensaje
                }
                // El state del mensaje se inicializa en vacio 
                this.setState({
                    Mensaje: ""
                })
                // Se emite el mensaje al usuario
                keys.socket.emit('room_usuario_chofer_chat',{
                    id_socket_usuario: keys.id_usuario_socket, id_chofer_socket: keys.id_chofer_socket,
                    infoMessage: infoMessage
                });
                // Verifica que el array de chat tenga un tamaño menor a 5, en casi de que si, se elimina el mensaje más viejo
                if(keys.Chat.length>=5){
                    keys.Chat.splice(0,1);
                }
                // Se agrega al array de chat
                keys.Chat.push(infoMessage);
                // Se asigna el array global de chat, al state, para mejor manipulación 
                this.setState({
                    Chat: keys.Chat
                })
            }else{
             

                // Formato del mensaje que se envía al socket de usuario 
                var infoMessage = {
                    Usuario: "Usuario",
                    nombreUsuario: keys.datos_usuario.nombreUsuario,
                    Mensaje: Mensaje
                }
                // El state del mensaje se inicializa en vacio 
                this.setState({
                    Mensaje: ""
                })
                // Se emite el mensaje al usuario
                keys.socket.emit('room_usuario_chofer_chat',{
                    id_socket_usuario: keys.id_usuario_socket, id_chofer_socket: keys.id_chofer_socket,
                    infoMessage: infoMessage
                });
    
                // Verifica que el array de chat tenga un tamaño menor a 5, en casi de que si, se elimina el mensaje más viejo
                if (keys.Chat.length >= 5) {
                    keys.Chat.splice(0, 1);
                }
    
                keys.Chat.push(infoMessage);
    
                this.setState({
                    Chat: keys.Chat
                })
            }
    
        }

    }

    /**
     * Mensaje que envia el mensaje automatico al chófer
     *
     * @param {*} Mensaje
     * @memberof Chat
     */
    sendMessageAtajo(Mensaje){
        // Formato de mensaje 
        var infoMessage = {
            Usuario: "Usuario",
            nombreUsuario: keys.datos_usuario.nombreUsuario,
            Mensaje: Mensaje
        }
        // Se inicializa el Mensaje a Vacio 
        this.setState({
            Mensaje: ""
        })
        // Se emite el mensaje al chófer
        keys.socket.emit('room_usuario_chofer_chat', {
            id_socket_usuario: keys.id_usuario_socket, id_chofer_socket: keys.id_chofer_socket,
            infoMessage: infoMessage
        });

        // Se valida que el array sea menor a 5, en caso de que si, se elimina el más viejo
        if (keys.Chat.length >= 5) {
            keys.Chat.splice(0, 1);
        }
        // Se agrega el formato del mensaje al array
        keys.Chat.push(infoMessage);
        // Se asigna al state
        this.setState({
            Chat: keys.Chat
        })
        // Se quita el state
        this.setState({
            Atajo: false

        })
        // Se quita el mensaje inicial del chat 
        if (this.state.initChat == true) {
            this.setState({
                initChat: false
            })
        }
    }



    /**
     * Render principañ del componente
     *
     * @returns
     * @memberof Chat
     */
    render() {
        return (

            <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" enabled  >
                <View style={{ flex: this.state.onFocus ? 4 : 5 }}>
                    {/* Barra superior del chat */}

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
                    {/* Datos del vehículo y nombre del chófer */}
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
                    {/* Mensaje inicial en el chat */}
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
                    {/* Vista de los mensajes del chat */}
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
                {/* Mensajes automaticos */}
                <View style={{ flex: this.state.Atajo ? this.state.onFocus ? 3 : 2 : this.state.onFocus ? 2 : 1 }}>

                    {this.state.Atajo?
             
                        <View style={styles.area}>
                            <View style={{flex:1}}>
                                <Button title="Estoy aquí"
                                    buttonStyle={{
                                        backgroundColor: "#ff8834",
                                    }}
                                    titleStyle={{ fontSize: 9 }}
                                    onPress={() => this.sendMessageAtajo("Estoy aquí")}
                                ></Button>
                            </View>
                            <View style={{flex:1}}></View>
                            <View style={{ flex: 1 }}>
                                <Button title="Llego enseguida"
                                    buttonStyle={{
                                        backgroundColor: "#ff8834",
                                      
                                    }}
                                    titleStyle={{ fontSize: 9 }}
                                    onPress={() => this.sendMessageAtajo("Llego Enseguida")}
                                ></Button>
                            </View>
                            <View style={{ flex: 1 }}></View>
                            <View style={{ flex: 1 }}>
                                <Button title="Te estoy buscando"
                                    buttonStyle={{
                                        backgroundColor: "#ff8834",
                                        
                                    }}
                                    titleStyle={{ fontSize: 9 }}
                                    onPress={() => this.sendMessageAtajo("Te estoy buscando")}
                                ></Button>
                            </View>

                        </View>
                    
                    :
                        null
                    }
                    {/* Input para envio de mensaje */}
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
// Estilos de Chat
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
