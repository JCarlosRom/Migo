import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TextInput, Switch, ScrollView } from "react-native";
import { Divider, CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import BottomNavigation, {
    FullTab
} from 'react-native-material-bottom-navigation'




export default class viajeFinalizado extends Component {


    constructor(props) {
        super(props);
        this.state = {
            id_usuario: null,
            Tarifa: 0,
            nombreUsuario:""
     

        };


    }



    async componentDidMount() {

        try {
            const { navigation } = this.props;
            const flag = navigation.getParam("flag");
            const Tarifa = navigation.getParam("Tarifa");
            const id_usuario = navigation.getParam("idUsuario");
            const nombreUsuario = navigation.getParam("nombreUsuario");

            if (flag) {

                this.setState({
                    Tarifa: Tarifa,
                    id_usuario: id_usuario,
                    nombreUsuario:nombreUsuario
                })
            }


        } catch (error) {
            console.log(error)
        }

    }




    static navigationOptions = {
        title: "Viaje finalizado"
    };




    render() {
        return (
            <ScrollView style={{ backgroundColor: "white" }}>
                <View style={styles.container}>
                    <View style={styles.area}>
                        <View>
                            <Switch
                            />
                        </View>
                        <View>
                            <Text >Conectado</Text>
                        </View>
                        <View style={
                            {
                                paddingLeft: 120
                            }
                        }>
                            <Icon name="exclamation-circle"
                                size={30}></Icon>
                        </View>
                        <View style={
                            {
                                paddingLeft: 10
                            }
                        }>
                            <Icon name="question-circle"
                                size={30}></Icon>
                        </View>
                        <View style={
                            {
                                paddingLeft: 10
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
                        <View>
                            <Text style={{fontWeight:"bold"}}>{this.state.Tarifa}MN$</Text> 
                            <Text>La tarifa del servicio ha sido aplicada</Text>
                        </View>
                    </View>

                    <View style={styles.area}>
                        <View style={{flex:3}}>
                            <View style={{flexDirection:"row"}}>
                                <View>
                                    <Icon name="user-circle" size={30}></Icon>  
                                </View>
                                <View style={{ paddingLeft: 10 }}>
                                    <Text style={{ marginTop: 3, fontWeight: "bold"}}>{this.state.nombreUsuario}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flex:2}}></View>
                        <View style={{flex:3}}>
                            <View style={{flexDirection:"row"}}>
                                <View>
                                    <Text>Calificar</Text>
                                </View>
                                <View style={{paddingLeft:10}}>
                                    <Icon name="chevron-right" size={15} style={{ marginTop: 3 }}></Icon>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{paddingTop:220, backgroundColor:"white"}}>

                        <View style={{ alignSelf: "center", width:280 }}>

                            <Button title="Empezar el próximo viaje"></Button>

                        </View>

                        <View style={{ alignSelf: "center", paddingTop: 10, width: 280}}>

                            <Button title="No disponible"></Button>

                        </View>

                    </View>


                    <View style={{ paddingTop: 70, backgroundColor: "white" }}>

                        <View style={{ alignSelf: "center", width: 280 }}>

                            <Button title="Finalizar el viaje" onPress={() => this.props.navigation.navigate("Home")}></Button>

                        </View>


                    </View>


                   







                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f0f4f7",
        marginTop: 10,
        flexDirection: "column"
    },
    row: {
        height: 10,
        backgroundColor: "#f0f4f7"
    },


    area: {
        flexDirection: "row",
        paddingLeft: 10,
        backgroundColor: "#fff",
        paddingTop: 10
    },



});
