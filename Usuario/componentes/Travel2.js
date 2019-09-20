import React, { Component } from "react";
import {Modal, View, Text, StyleSheet, TextInput, TouchableHighlight } from "react-native";
import { Divider, CheckBox, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
    createAppContainer,
    StackActions,
    NavigationActions
} from "react-navigation"; // Version can be specified in package.json
import { createStackNavigator } from "react-navigation-stack";
import { stringify } from "qs";
import MapView from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { ScrollView } from "react-native-gesture-handler";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';



export default class Travel2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Home:false,
            showEstimations:false,
            Pay:false,
            Onway:true,
            ModalCancel:false,
            ModalAceptCancel:false

        };

   

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
                                latitude: 19.2398017,
                                longitude: - 103.7546414,
                                latitudeDelta: 1,
                                longitudeDelta: 1,
                            }}
                        >
                        </MapView>
                    </View>
                    {this.state.showEstimations?
                        <View>

                            <View style={styles.areawrow}>
                            
                                <Icon name="car-side" size={30} style={{ alignSelf: "center", paddingTop:5 }}></Icon>
                            
                            </View>

                        

                            <View style={styles.area}>
                        
                                <View>
                                    <Text>Migo Estándar <Icon name="info-circle" size={18}></Icon> </Text>
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
                                    type="outline" ></Button>
                            </View>
                            
                    
                        </View>
                        
                    :
                        null
                    }

                    {this.state.Home?
                    <View>

                        <View style={styles.area}>
                            <Text style={{fontWeight:"bold", fontSize:16}}>Migo Express</Text>
                        </View>

                        <View style={styles.area}>
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
                                >Migo Estandar</Text>
                                <Text
                                    style={{
                                        alignSelf: "center",
                                        fontSize: 12
                                    }}
                                >Aprox MX $163.30</Text>
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
                                >Migo de lujo</Text>
                                <Text
                                    style={{
                                        alignSelf: "center",
                                        fontSize: 12
                                    }}
                                >Aprox MX $173.30</Text>
                            </View>
                            <View style={
                                {
                                    paddingLeft:30,
                                    paddingTop:12
                                }
                            }>
                                <Icon name="chevron-right"
                                size={25}
                                ></Icon>
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

                    <Modal
                        animationType="fade"
                        transparent={false}
                        visible={true}
                        >
                        <View style={{ marginTop: 22 }}>
                            <View>
                                <Text>Hello World!</Text>

                                <TouchableHighlight
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    }}>
                                    <Text>Hide Modal</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </Modal>

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
