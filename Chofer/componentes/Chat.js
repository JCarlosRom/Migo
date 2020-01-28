// Importaciones de librerías 
import React, { Component } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Keyboard } from "react-native";
import { Input } from "react-native-elements";
import keys from "./global";
import Icon from "react-native-vector-icons/FontAwesome5";



export default class Chat extends Component {

    /**
     *Creates an instance of Chat.
     * @param {*} props
     * @memberof Chat
     */
  
    constructor(props) {

        keys.socket.on('isConnected', () => {})

        super(props);

        this.state = {

            // Array de mensajes del chat 
            Chat:[],
            // Mensaje volatil para guardarlo en el array
            Mensaje: "",
            // estado para detectar cuando el teclado se esté mostrando
            onFocus:false,
            // Estado para monstrar la vista inicial dentro del campo de chat
            initChat:true

        };
        // Evento para detectar si se muestra el teclado
        this._keyboardDidShow = this._keyboardDidShow.bind(this);

        // Evento para detectar si se oculta el teclado 
        this._keyboardDidHide = this._keyboardDidHide.bind(this);

        // Socket para remover todos los sockets de "LlegoMensaje"
        keys.socket.removeAllListeners("LlegoMensaje");

        // Socket para recibir el mensaje del conductor
        keys.socket.on('chat_chofer', (num) => {

            // Verificación de que el chat no tenga mas de 5 mensajes 
            if (keys.Chat.length >= 5) {
                keys.Chat.splice(0, 1);
            }

            // Anexo de mensaje al array de chat
            keys.Chat.push(num.Mensaje);

            // Se agrega al state de Chat
            this.setState({
                Chat: keys.Chat
            })

        })







    }

    /**
     *
     * Ciclo de vida para despúes de que se monta el componente
     * @memberof Chat
     */
    componentDidMount() {

        // Verificación de que el chat no tenga mas de 5 mensajes 
        if (keys.Chat.length >= 5) {
            keys.Chat.splice(0, 1);
        }

        // Se asigna el array al state de Chat
        this.setState({
            Chat:keys.Chat
        })
                
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
    sendMessage() {
        // Verifica que el mensaje sea diferente de vacio
        if(this.state.Mensaje!=""){

            // Formato del mensaje que se envía al socket de usuario 
            var infoMessage ={
                Usuario:"Conductor",
                nombreUsuario: keys.datos_chofer.nombreChofer,
                Mensaje: this.state.Mensaje
                
            }
            // El state del mensaje se inicializa en vacio 
            this.setState({
                Mensaje:""
            })
            
            // Se emite el mensaje al usuario
            keys.socket.emit('room_chofer_usuario_chat',
            {
                id_socket_usuario: keys.id_usuario_socket, id_chofer_socket: keys.id_chofer_socket,
                infoMessage: infoMessage
            });
    
            // Verifica que el array de chat tenga un tamaño menor a 5, en casi de que si, se elimina el mensaje más viejo
            if (keys.Chat.length >= 5) {
                keys.Chat.splice(0, 1);
            }
    
            // Se agrega al array de chat
            keys.Chat.push(infoMessage);
    
            // Se asigna el array global de chat, al state, para mejor manipulación 
            this.setState({
                Chat: keys.Chat
            })

        }

    }



    /**
     * Render principal del componente
     *
     * @returns
     * @memberof Chat
     */
    render() {
        return (

            <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" enabled >
                {/* Barra superior con datos del usuario */}
                <View style={{ flex: this.state.onFocus ? 4 : 5 }}>

              
                    <View style={styles.area}>
                        <View style={{flex:2}}></View>

                        <View style={{ flex: 2 }}>
                           
                            <Text style={{fontSize:9, alignContent:"center"}}>{keys.datos_usuario.nombreUsuario}</Text>
                        
                        </View>
                       
                    </View>

                

                    {/* Espacio para la visualización de los mensajes del chat */}
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
                {/* Bloque para el input de texto y el botón de envio */}
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
