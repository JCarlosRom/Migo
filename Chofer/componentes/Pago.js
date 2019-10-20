import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TextInput, Switch, ScrollView } from "react-native";
import { Divider, CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import BottomNavigation, {
    FullTab
} from 'react-native-material-bottom-navigation'




export default class Pago extends Component {


    constructor(props) {
        super(props);
        this.state = {
            id_usuario: "2",
            Tarifa:0,
            Peaje:0

        };


    }



    async componentDidMount() {

        try {
            const { navigation } = this.props;
            const flag = navigation.getParam("flag");
            const Tarifa = navigation.getParam("Tarifa");
            const id_usuario = navigation.getParam("idUsuarior");
            if (flag) {
                
                this.setState({
                    Tarifa:Tarifa,
                    id_usuario:id_usuario
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
            <ScrollView contentContainerStyle={styles.contentContainer}>
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
                        
                        <Text style={{ flex: 1 }}>Costo del viaje</Text>
                        <View style={{ flex: 4 }}></View>
                        <Text style={{ flex: 1 }}>${this.state.Tarifa}</Text>
                    </View>
                   
                    <View style={styles.area}>
                        <Text style={{flex:1}}>Peaje</Text>
                        <View style={{flex:4}}></View>
                        <Text style={{ flex:1 }}>${this.state.Peaje}</Text>
                    </View>



                    
                
                    <Button style={styles.finalButton}
                        title="Iniciar pago con tarjeta"
                        type="clear"
                        
                    />


                   
                
        
                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f0f4f7",
        marginTop: 10,
        height: 
    },
    row: {
        height: 10,
        backgroundColor: "#f0f4f7"
    },
    line: {
        height: 2,
        backgroundColor: "#f0f4f7"
    },
    block: {
        backgroundColor: "#f0f4f7",
        height: 190
    },
    title: {
        fontSize: 20,
        paddingBottom: 10
    },
    subtitle: {
        fontSize: 15,
        paddingLeft: 15
    },
    land: {
        flex: 1,
        paddingBottom: 30,
        flexDirection: "row"
    },
    icon_close: {
        paddingBottom: 10,
        paddingTop: 10
    },
    area: {
        flexDirection: "row",
        paddingLeft: 10,
        backgroundColor: "#fff",
        paddingTop: 10
    },
    text: {
        paddingLeft: 15,
        fontSize: 16
    },
    rightArrow: {
        paddingLeft: 190
    },
    containerMap: {
        // ...StyleSheet.absoluteFillObject,
        height: 300,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10
    },
    map: {
        ...StyleSheet.absoluteFillObject,

    },
    finalButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
    }

});
