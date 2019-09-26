import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from "react-native";
import { Divider, CheckBox, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
    createAppContainer,
    StackActions,
    NavigationActions
} from "react-navigation"; // Version can be specified in package.json
import { createStackNavigator } from "react-navigation-stack";
import { stringify } from "qs";
import MapView, {Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { ScrollView } from "react-native-gesture-handler";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';


const GOOGLE_MAPS_APIKEY = 'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY';
export default class Travel2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id_usuario: "2",
            Home:true,
            showEstimations:false,
            Pay:false,
            Onway:false,
            ModalCancel:false,
            ModalAceptCancel:false,
            myPosition: {
                latitude: 0,
                longitude: 0,

            },
            Destino: {
                latitude: 0,
                longitude: 0
            },
            distance:0,
            duration:0,
    
            Express_Estandar:{
                categoria_servicio: 0,
                nombre_categoria: "",
                out_costo_viaje: 0
            },
            Express_Lujo:{
                categoria_servicio: 0,
                nombre_categoria: "",
                out_costo_viaje: 0
            },
            Pool_Estandar:{
                categoria_servicio: 0,
                nombre_categoria: "",
                out_costo_viaje: 0
            },
            Pool_Lujo:{
                categoria_servicio: 0,
                nombre_categoria: "",
                out_costo_viaje: 0
            },
            isNextVehicles:true
            

        };

   

    }

    
    async getTarifas(){
        try {
            //console.log(this.props.switchValue);
            const res = await axios.post('http://34.95.33.177:3003/webservice/interfaz164/UsuarioCalculoPrecios', {
                distancia_km: this.state.distance,
                tiempo_min: this.state.duration
            });
     
            
            res.data.datos.forEach(element => {

          

                if(element["categoria_servicio"]==1){
                   
                    this.setState({
                       
                        Express_Estandar: {
                            categoria_servicio: element["categoria_servicio"],
                            nombre_categoria: element["nombre_categoria"],
                            out_costo_viaje: element["out_costo_viaje"],
                        }
                     
                         
                    })
                }
                if (element["categoria_servicio"] == 2) {
                    
                    this.setState({
                   
                        Express_Lujo: {
                            categoria_servicio: element["categoria_servicio"],
                            nombre_categoria: element["nombre_categoria"],
                            out_costo_viaje: element["out_costo_viaje"],
                        }
                     
                    })
                }

                if (element["categoria_servicio"] == 3) {
                    
                    this.setState({
                    
                        Pool_Estandar: {
                            categoria_servicio: element["categoria_servicio"],
                            nombre_categoria: element["nombre_categoria"],
                            out_costo_viaje: element["out_costo_viaje"],
                        }
                        
                    })
                }

                if (element["categoria_servicio"] == 4) {
                   
                    this.setState({
                    
                        Pool_Lujo: {
                            categoria_servicio: element["categoria_servicio"],
                            nombre_categoria: element["nombre_categoria"],
                            out_costo_viaje: element["out_costo_viaje"],
                        }
                      
                    })
                }

               
            });
        
       



        } catch (e) {
            console.log(e);
            alert("No hay conexión al web service", "Error");
        }
    }

    async componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {

                this.setState({
                    myPosition: {

                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude

                    },
                    error: null,
                });
                
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 200000 },
        );


        try {
            //console.log(this.props.switchValue);
            const res = await axios.post('http://34.95.33.177:3003/webservice/interfaz204/MostrarDestinosFavoritos', {
                id_usuario: this.state.id_usuario
            });


            this.setState({
                Destino: {
                    latitude: parseFloat(res.data.datos[0]["coordenadas"].substring(0, 9)),
                    longitude: parseFloat(res.data.datos[0]["coordenadas"].substring(10, 22)),
                }


            })


            //console.log(res);


        } catch (e) {
            console.log(e);
            alert("No hay conexión al web service", "Error");
        }

    
    }


    static navigationOptions = {
        title: "Viaje"
    };


    setModalCancel(visible) {
        this.setState({ ModalCancel: visible });

        this.setState({ ModalAceptCancel: !visible });
    }


    setModalAceptCancel(visible) {

        this.setState({ ModalAceptCancel: visible });
        
        this.setState({ ModalCancel: !visible });

    }


 
    render() {
        return (

            <ScrollView>
                <View style={styles.container}>
               
                     
                    
                    <View style={styles.containerMap}>
                        <MapView

                            style={styles.map}
                            region={{
                                latitude: this.state.myPosition.latitude,
                                longitude: this.state.myPosition.longitude,
                                latitudeDelta: 0.0105,
                                longitudeDelta: 0.0105,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: this.state.myPosition.latitude,
                                    longitude: this.state.myPosition.longitude,
                                }}

                            >
                                <Icon name="map-pin" size={20} color="orange"></Icon>
                            </Marker>
                            <Marker
                                coordinate={{
                                    latitude: this.state.Destino.latitude,
                                    longitude: this.state.Destino.longitude,
                                }}

                            >
                                <Icon name="map-pin" size={20} color="green"></Icon>
                            </Marker>
                            <MapViewDirections
                                
                              
                                destination={{
                                    latitude: this.state.Destino.latitude,
                                    longitude: this.state.Destino.longitude,
                                }}
                                origin={{
                                    latitude: this.state.myPosition.latitude,
                                    longitude: this.state.myPosition.longitude,
                                }}
                                apikey={GOOGLE_MAPS_APIKEY}
                                strokeWidth={3}
                                strokeColor="blue"
                                onReady={result => {
                                    this.setState({
                                        distance:result.distance,
                                        duration:result.duration

                                    })

                                    this.getTarifas();

                                    
                                }}
                            />
                        </MapView>
                    </View>
                    {this.state.showEstimations?
                        <View>

                            <View style={styles.areawrow}>
                            
                                <Icon name="car-side" size={30} style={{ alignSelf: "center", paddingTop:5 }}></Icon>
                            
                            </View>

                        

                            <View style={styles.area}>
                        
                                <View>
                                    <Text>Migo Estándar <Icon name="info-circle" size={18}
                                    onPress={() => this.props.navigation.navigate("DesgloseTarifa")}
                                    ></Icon> </Text>
                                    <Text> Llegada: 9:46 p.m.</Text>
                                </View>

                                <View style={{paddingLeft:120}}>
                                    <Text> MX$ 163.30</Text>
                                </View>
                            
                            </View>
                

                            <View style={styles.area}>
                                <Icon name="money-bill-alt" size={30} onPress={() => this.setState({
                                    showEstimations: false,
                                    Home: false,
                                    Pay: true
                                })

                                }></Icon>
                                <Text style={{ fontWeight: "bold", paddingLeft: 10, paddingTop: 5 }}>Efectivo</Text>
                                <Icon style={{ paddingLeft: 10, paddingTop: 5 }} name="chevron-down" size={20} onPress={() => this.setState({
                                    showEstimations: false,
                                    Home: false,
                                    Pay: true
                                })}></Icon>
                            </View>
                            <View >
                                <Button title="Confirmar MiGo Express Estándar"
                                    style={{ width: '100%' }}
                                    type="outline" 
                                    onPress={()=>this.setState({
                                        Onway:true,
                                        showEstimations:false
                                      
                                    })}
                                    ></Button>
                            </View>
                            
                    
                        </View>
                        
                    :
                        null
                    }

                    {this.state.Home?



                    <View>

                        <View style={styles.area}>
                            <Text style={{fontWeight:"bold", fontSize:16}}>{
                                this.state.isNextVehicles?
                                    "Migo Express"
                                :
                                "Migo Pool"
                            }</Text>
                        </View>
                     
                        <View style={styles.area}>

                            {this.state.isNextVehicles ?
                                null
                                :
                                    <Icon name="chevron-left"
                                    size={25}
                                    onPress={() => this.setState({
                                        isNextVehicles: !this.state.isNextVehicles
                                    })}
                                ></Icon>
                            }
                            
                            <View style={{paddingLeft:30}}> 
                                <Icon name="car-side"
                                    size={25}
                                    style={{alignSelf:"center"}}
                                    onPress={()=>this.setState({
                                        showEstimations:true,
                                        Home:false
                                    })}
                                ></Icon>
                                <Text
                                style={{ alignSelf: "center",
                                fontSize: 12 }}
                                >{
                                    this.state.isNextVehicles?
                                        this.state.Express_Estandar.nombre_categoria
                                    :
                                        this.state.Pool_Estandar.nombre_categoria
                                    
                                    }</Text>
                                <Text
                                    style={{
                                        alignSelf: "center",
                                        fontSize: 12
                                    }}
                                >Aprox MX ${
                                    this.state.isNextVehicles ?
                                        this.state.Express_Estandar.out_costo_viaje
                                        :
                                        this.state.Pool_Estandar.out_costo_viaje

                                }</Text>
                            </View>
                            <View style={{ paddingLeft: 35 }}>
                                <Icon name="car-side"
                                    size={25}
                                    style={{ alignSelf: "center" }}
                                ></Icon>
                                <Text
                                    style={{
                                        alignSelf: "center",
                                        fontSize: 12
                                    }}
                                    >{
                                        this.state.isNextVehicles ?
                                            this.state.Express_Lujo.nombre_categoria
                                            :
                                            this.state.Pool_Lujo.nombre_categoria

                                        }</Text>
                                <Text
                                    style={{
                                        alignSelf: "center",
                                        fontSize: 12
                                    }}
                                    >Aprox MX ${
                                            this.state.isNextVehicles ?
                                                this.state.Express_Lujo.out_costo_viaje
                                                :
                                                this.state.Pool_Lujo.out_costo_viaje

                                        }</Text>
                            </View>
                            <View style={
                                {
                                    paddingLeft:30,
                                    paddingTop:12
                                }
                            }>

                            {this.state.isNextVehicles ?
                              
                                <Icon name="chevron-right"
                                    size={25}
                                    onPress={() => this.setState({
                                        isNextVehicles: !this.state.isNextVehicles
                                    })}
                                ></Icon>
                                :
                                null
                            }
                             
                            </View>
                        </View>
                        

                            <View style={styles.area}>
                                <Icon name="money-bill-alt" size={30} onPress={() => this.setState({
                                    showEstimations: false,
                                    Home: false,
                                    Pay: true
                                })

                                }></Icon>
                                <Text style={{ fontWeight: "bold", paddingLeft: 10, paddingTop: 5 }}>Efectivo</Text>
                                <Icon style={{ paddingLeft: 10, paddingTop: 5 }} name="chevron-down" size={20} onPress={() => this.setState({
                                    showEstimations: false,
                                    Home: false,
                                    Pay: true
                                })}></Icon>
                            </View>
                            <View >
                                <Button title="Confirmar MiGo Express Estándar"
                                    style={{ width: '100%' }}
                                    type="outline" ></Button>
                            </View>
                            
                    
                    </View>
                    :
                        null
                    }


                    {this.state.Pay?
                        <View>
                            <View style={styles.area}>
                                <Text style={{fontSize:16, fontWeight:"bold"}}> Método de pago</Text>
                            </View>

                            <View style={styles.area}>

                                <Icon name="money-bill-alt" size={25} style={{paddingLeft:10}}></Icon>

                                <Text style={{paddingLeft:10}}>Efectivo</Text>

                                <RadioForm
                                    style={{paddingLeft:153}}
                                    radio_props={[{ label: ''}]}
                                    initial={0}
                                    buttonColor={"#000000"}
                                    animation={true}
                                    onPress={(value) => {
                                        this.setState({
                                            showEstimations: true,
                                            Home: false,
                                            Pay: false
                                        })
                                    }}

                                />

                            </View>



                            <View style={styles.area}>

                                <Icon name="credit-card" size={25} style={{ paddingLeft: 10 }}></Icon>

                                <Text style={{paddingLeft:10}}>Tarjeta de crédito / débito </Text>

                                <RadioForm
                                    style={{ paddingLeft: 45 }}
                                    radio_props={[{ label: '' }]}
                                    initial={1}
                                    buttonColor={'#000000'}
                                    animation={true}
                                    onPress={(value) => {
                                        this.setState({
                                            showEstimations: true,
                                            Home: false,
                                            Pay: false }) 
                                    }}

                                />


                            </View>

                            <View style={styles.area}>
                                <Icon name="cc-visa" size={25} style={{ paddingLeft: 30 }}></Icon>

                                <Text style={{ paddingLeft: 10 }}> **** **** **** 1254 </Text>

                                <RadioForm
                                    style={{ paddingLeft: 65 }}
                                    radio_props={[{ label: '' }]}
                                    initial={1}
                                    buttonColor={'#000000'}
                                    animation={true}
                                    onPress={(value) => {
                                        this.setState({
                                            showEstimations: true,
                                            Home: false,
                                            Pay: false
                                        })
                                    }}
                                    

                                />

                            </View>

                            <View style={styles.area}>
                                <Text>Agregar método de pago</Text>
                            </View>

                        </View>
                    :
                        null
                    }

                    {this.state.Onway?
                        <View>
                            <View styles={styles.area}>
                                <Icon name="chevron-up"
                                style={{alignSelf:"center", paddingTop:5}}
                                size={30}
                                onPress={() => this.props.navigation.navigate("InfoTravel")}
                              
                                ></Icon>

                            </View>
                            <View styles={styles.area}>
                                <Text style={{fontWeight:"bold", fontSize:14, alignSelf:"center"}}>Tu conductor está en camino, espera un momento</Text>
                            </View>
                            <View
                            style={
                                {
                                    backgroundColor:"black",
                                }}
                            >
                                <Text style={{ color: "white", fontWeight: "bold", fontSize: 14, alignSelf:"center"}}>Verifica la matricula y los detalles del auto</Text>
                            </View>

                            <View style={styles.area}>
                                <Icon name="user-circle" size={60}></Icon>
                                <Icon name="car" size={45}  style={{paddingLeft:10}}></Icon>
                                <View style={{paddingLeft:120}}>
                                    <Text>Dodge Attitude</Text>
                                    <Text style={{fontWeight:"bold", fontSize:16}}>FRS408A</Text>
                                    <Button color="red" title="Cancelar"
                                        onPress={() => this.setModalCancel(!this.state.modalVisible)}
                                    ></Button>

                                </View>
                            </View>
                        
                            <View style={{ alignSelf: "center", backgroundColor:"white" }}>
                                <Text >Oscar Dario<Text>*4.8</Text> <Icon name="star"></Icon> <Text>* Habla inglés y español</Text></Text>
                            </View>

                            <View style={styles.area}>
                                <Icon name="phone" size={30}></Icon>
                                <View style={{paddingLeft:10}}></View>
                                <TextInput
                                    style={{ height: 40, width: 270, borderColor: 'gray', borderWidth: 1, backgroundColor: '#DCDCDC'}}
                                    placeholder=" Nota para iniciar el viaje"
                                    placeholderTextColor="black"
                                ></TextInput>
                            </View>

                


                        </View>

                
                    :
                        null
                    }

              

                </View>
            


            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        backgroundColor: "#f0f4f7",
        paddingBottom: 50
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
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        backgroundColor: "#fff"
    },
    areawrow: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        backgroundColor: "#fff"
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
        height: 425,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
