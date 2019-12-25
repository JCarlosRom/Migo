import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TextInput, Switch, ScrollView } from "react-native";
import { Divider, CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import MapView, { Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import BottomNavigation, {
    FullTab
} from 'react-native-material-bottom-navigation'




export default class Notificaciones extends Component {


    constructor(props) {
        super(props);
        this.state = {
            id_usuario: null,
            Notificaciones:null

        };


    }



    async componentDidMount() {

        try {
            const { navigation } = this.props;
            const id_chofer = navigation.getParam("id_chofer");
            const stateConductor = navigation.getParam("stateConductor");
       
            if (flag) {
                
                this.setState({
                    id_chofer:id_chofer,
                    stateConductor:stateConductor
                })
            }

            console.log(this.state.id_usuario);

            
        } catch (error) {
            console.log(error)
        }

    }




    static navigationOptions = {
        title: "Notificaciones"
    };

     realizaPago(){

           this.props.navigation.navigate("viajeFinalizado",{
            Tarifa: this.state.Tarifa,
            id_usuario: this.state.id_usuario,
            nombreUsuario: this.state.nombreUsuario,
            flag:true
        });
    }

    conectarConductor(){
        this.setState({
        stateConductor:!this.state.stateConductor
        })
    }



    render() {
        return (
            <ScrollView style={{backgroundColor:"white"}}>
                <View style={styles.container}>
                    <View style={styles.area}>
                        <View>
                            <Switch
                             value={this.state.stateConductor}
                                onChange={()=>this.conectarConductor()}
                            />
                        </View>
                        <View>
                            <Text >{this.state.stateConductor?"Conectado":"Desconectado"}</Text>
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
                        
                        <Text style={{ flex: 2 }}>Costo del viaje</Text>
                        <View style={{ flex: 4 }}></View>
                        <Text style={{ flex: 1 }}>${this.state.Tarifa}</Text>
                    </View>
                   
                    <View style={styles.area}>
                        <Text style={{flex:2}}>Peaje</Text>
                        <View style={{flex:4}}></View>
                        <Text style={{ flex:1 }}>${this.state.Peaje}</Text>
                    </View>


                    <View style={{paddingTop:260}}>

                        <Button
                            title="Iniciar pago con tarjeta"
                            type="clear"
                            
                            onPress={()=>this.realizaPago()}
                        />
                        
                    </View>


                   
                
        
                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        marginTop: 10,
        flexDirection:"column"
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
        paddingTop: 20
    },

  


});
