import React, { Component } from "react";
import { View, Text, StyleSheet, Button, ScrollView, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";




export default class InfoTravel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Chofer info
            nombreChofer: "Leonel Guardado",
            ModeloChofer: "Dodge Attitude",
            matriculaChofer: "FRS408A",
            estrellasChofer: '4.1',
            cualidadesChofer: "Habla inglés y español",
         



        };



    }

    //  origin = { latitude: this.state.myPosition.latitude, longitude: this.state.myPosition.longitude };
    //  destination = { latitude: this.state.Destino.latitude, longitude: this.state.Destino.longitude };
    //  GOOGLE_MAPS_APIKEY = '…';





    async componentDidMount() {
       
    }







    static navigationOptions = {
        title: "Información"
    };






    render() {
        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.area}>
                    <View style={{flex:3}}>
                        <Text style={{ fontWeight: "bold", fontSize: 14 }}>A 15 min.</Text>
                        <Text style={{ fontWeight: "bold", fontSize: 14 }}>Llegada: 9:28 p.m.</Text>
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
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{this.state.matriculaChofer}</Text>
                   

                    </View>
                </View>

                <View style={{ alignSelf: "center", backgroundColor: "white" }}>
                    <Text >{this.state.nombreChofer}<Text>*{this.state.estrellasChofer}</Text> <Icon name="star"></Icon> <Text>* {this.state.cualidadesChofer}</Text></Text>
                </View>

                <View style={styles.area}>
                    <Icon name="phone" color="#ff8834" size={30}></Icon>
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
                        onPress={() => this.setModalCancel(!this.state.modalVisible)}
                    ></Button>
                </View>

                <View style={{
                    flexDirection: "row",
                    paddingBottom: 10,
                    paddingLeft: 20,
                    backgroundColor: "#fff",
                    paddingTop: 10
                }}>
                    <Icon name="map-marker-alt" color="#ff8834" size={25}></Icon>
                    <Text style={{paddingLeft:30, marginTop:2}}>Lomas del Centenario</Text>
                    <Text style={{ paddingLeft: 30, marginTop: 2, color:"blue" }}>Agregar o cambiar</Text>
                </View>
                <View style={styles.line}></View>

                <View style={{
                    flexDirection: "row",
                    paddingBottom: 10,
                    paddingLeft: 20,
                    backgroundColor: "#fff",
                    paddingTop:10
        
                }}>
                    <Icon name="money-bill-alt" color="#ff8834" size={25}></Icon>
                    <Text style={{ paddingLeft: 30, marginTop: 2 }}>Efectivo</Text>
                    <Text style={{ paddingLeft: 170, marginTop: 2, color:"blue" }}>Cambiar</Text>
                </View>

                <View style={styles.line}></View>
                
                <View style={{
                    flexDirection: "row",
                    paddingBottom: 10,
                    paddingLeft: 20,
                    backgroundColor: "#fff",
                    paddingTop: 10
              
                }}>
                    <Icon name="share" color="#ff8834" size={25}></Icon>
                    <Text style={{ paddingLeft: 30, marginTop: 2 }}>Compartir estado del viaje</Text>
                    <Text style={{ paddingLeft: 50, marginTop: 2, color:"blue" }}>Compartir</Text>
                </View>
                <View style={styles.line}></View>

                <View style={styles.area}>
                    <View style={{ width: 300 }}>
                        <Text style={{marginTop:5}}>Guardar el destino</Text>
                        <Text style={{ marginTop: 5 }}>Lomas del Centenario, Villa de Álvarez, Colima, México</Text>
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
