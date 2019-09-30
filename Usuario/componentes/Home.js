import React, { Component } from "react";
import { Text, View, StyleSheet, FlatList, TextInput, TouchableHighlight } from "react-native";
import { Divider, CheckBox, Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import * as Location from "expo-location";
import { ScrollView } from "react-native-gesture-handler";
// import keys from "../../config/Keys";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id_usuario: "2",
            // Arrivals
            showNewArrival: false,
            showNewArrival2: false,
            // Change options below screen
            showViewOptions: true,
            // Delete buttons delete 
            showButtonsDelete: true,
            //  State to show the position to arrival 
            showPositionArrival: false,
            // Hide or show button retweet
            showButtonPlaces: true,
            // Position of arrivals 
            place2: "",
            place1: "",
            place: "",
            showFavoritePlaces: false,
            Destinos: [],
            destination: "",
            destination2:"",
            destination3:"",
            destination4:"",
            hit: "",
            type: "",
            predictions: [],
            latitude: 0,
            longitude: 0,
            showListdestination:false,
            showListdestination2:false,
            showListdestination3:false,
            showListdestination4:false,
            flagDestino:""


        };

        showNewArrival = false;
        showNewArrival2 = false;
        varplaceArrival = 1;




    }

    // Function to show the buttons of position of arrivals
    showPositionArrival() {
        this.state = {
            showPositionArrival: false
        };
    }
    // Function to shows a new stop in a view
    showArrival() {

        if (showNewArrival == false) {

            this.setState({
                showNewArrival: true,
                showViewOptions: false
            })
            showNewArrival = true;
        } else {
            if (showNewArrival == true) {
                if (showNewArrival2 == false) {

                    this.setState({
                        showNewArrival2: true
                    })
                    showNewArrival2 = true;
                }
            }
        }
    }
    // Function to hide the field of stops
    hideArrival() {

        if (showNewArrival == true) {

            this.setState({
                showNewArrival: false,
                destination2:""
            })
            showNewArrival = false;
        } else {
            if (showNewArrival == false) {
                if (showNewArrival2 == true) {

                    this.setState({
                        showNewArrival2: false,
                        destination3:""
                    })
                    showNewArrival2 = false;
                }
            }
        }
        if (showNewArrival == false && showNewArrival2 == false) {
            this.setState({

                showViewOptions: true
            })
        }

    }
    // Hide the delete buttons
    hideDeleteButtons() {
        if (showNewArrival == true) {

            this.setState({
                showButtonsDelete: false,
                showButtonPlaces: false
            })
        }
    }


    setplaceArrival(place) {

        if (varplaceArrival < 4) {


            if (place == "place 1") {


                this.setState({
                    place: varplaceArrival.toString()
                })
                varplaceArrival++;

            } else {
                if (place == "place 2") {

                    this.setState({
                        place1: varplaceArrival.toString()
                    })
                    varplaceArrival++;

                } else {
                    if (place == "place 3") {
                        this.setState({
                            place2: varplaceArrival.toString()
                        })
                        varplaceArrival++;

                    }
                }
            }

        }

    }

    ViewOption() {
        this.setState({

            showViewOptions: true
        })
    }

    static navigationOptions = {
        title: "Solicitar taxi"
    };



    async componentDidMount() {

        //console.log(TopTemplate.props.switchValue);
        //console.log(db);
        try {
            //console.log(this.props.switchValue);
            const res = await axios.post('http://187.214.4.151:3001/webservice/interfaz204/MostrarDestinosFavoritos', {
                id_usuario: this.state.id_usuario
            });

            var DestinosTemp = {};
            var i = 0;
            res.data.datos.forEach(function (element) {

                var jsonDestinos = { nombre: element["nombre"], direccion: element["direccion"] }

                DestinosTemp[i] = (jsonDestinos)
                i++

            });
            this.setState({ Destinos: DestinosTemp });


            // console.log(this.state.Destinos);

            //console.log(res);


        } catch (e) {
            console.log(e);
            alert("No hay conexión al web service", "Error");
        }

        const location = await Location.getCurrentPositionAsync({});
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;
        if (!this.props.navigation.getParam("flag")) {
            this.setState({
                hit:
                    "Ingresa la dirección de tu " +
                    this.props.navigation.getParam("type"),
                type: this.props.navigation.getParam("type"),
                latitude,
                longitude
            });
        } else {
            this.setState({ hit: "Ingresa una dirección" });
        }
    }

    autocompleteGoogle = async destination => {
        this.setState({ destination:destination
        });

        this.setState({
            showListdestination:true,
            showListdestination2:false,
            showListdestination3:false,
            showListdestination4:false,
            flagDestino:"1"
        })
        console.log(this.state.destination);
        const apiUrl =
            "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" +
            'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY' +
            "&input=" +
            this.state.destination +
            "&location=" +
            this.state.latitude +
            ",%20" +
            this.state.longitude +
            "&radius=2000";
        try {
            const result = await fetch(apiUrl);
            const json = await result.json();
            this.setState({
                predictions: json.predictions
            });
        } catch (error) {
            console.error(error);
        }
    };

    autocompleteGoogle2 = async destination2 => {
        this.setState({ 
            destination2:destination2});
        // console.log(this.state.destination2);

        this.setState({
            showListdestination: false,
            showListdestination2: true,
            showListdestination3: false,
            showListdestination4: false,
            flagDestino: "2"
        })
        const apiUrl =
            "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" +
            'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY' +
            "&input=" +
            this.state.destination2 +
            "&location=" +
            this.state.latitude +
            ",%20" +
            this.state.longitude +
            "&radius=2000";
        try {
            const result = await fetch(apiUrl);
            const json = await result.json();
            this.setState({
                predictions: json.predictions
            });
            console.log(this.state.predictions);
        } catch (error) {
            console.error(error);
        }
    };

    autocompleteGoogle3 = async destination3 => {
        this.setState({ 
            destination3:destination3
        });


        this.setState({
            showListdestination: false,
            showListdestination2: false,
            showListdestination3: true,
            showListdestination4: false,
            flagDestino: "3"
        })
        console.log(this.state.destination3);
        const apiUrl =
            "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" +
            'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY' +
            "&input=" +
            this.state.destination3 +
            "&location=" +
            this.state.latitude +
            ",%20" +
            this.state.longitude +
            "&radius=2000";
        try {
            const result = await fetch(apiUrl);
            const json = await result.json();
            this.setState({
                predictions: json.predictions
            });
        } catch (error) {
            console.error(error);
        }
    };


    autocompleteGoogle4 = async destination4 => {
        this.setState({ destination4:destination4 });

        this.setState({
            showListdestination: false,
            showListdestination2: false,
            showListdestination3: false,
            showListdestination4: true,
            flagDestino: "4"
        })
        console.log(this.state.destination4);
        const apiUrl =
            "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" +
            'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY' +
            "&input=" +
            this.state.destination4 +
            "&location=" +
            this.state.latitude +
            ",%20" +
            this.state.longitude +
            "&radius=2000";
        try {
            const result = await fetch(apiUrl);
            const json = await result.json();
            this.setState({
                predictions: json.predictions
            });
        } catch (error) {
            console.error(error);
        }
    };




    Item = ({ item }) => {
        console.log(item);
        return (
            <View>
                <TouchableHighlight
               
                    onPress={() => this.setDirectionInput(item.description)}
              >
                    <View style={[styles.area, { paddingTop: 10, paddingBottom: 10 }]}>
                        <Icon name="map-marker-alt" style={styles.iconLeft} size={30} />
                        <View style={{ justifyContent: "center", width: 250 }}>
                            <Text
                                style={styles.text}
                            >
                                {item.description}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
            
            </View>
        );
    };


    setDirectionInput =(description)=>{
        if(this.state.flagDestino=="1"){
            this.setState({
                destination:description,
                showListdestination:false,
                showListdestination2:false,
                showListdestination3:false,
                showListdestination4:false
            })
        }else{
            if(this.state.flagDestino=="2"){
                this.setState({
                    destination2: description,
                    showListdestination: false,
                    showListdestination2: false,
                    showListdestination3: false,
                    showListdestination4: false
                })
            }else{
                if(this.state.flagDestino=="3"){
                    this.setState({
                        destination3: description,
                        showListdestination: false,
                        showListdestination2: false,
                        showListdestination3: false,
                        showListdestination4: false
                    })
                }else{
                    if(this.state.flagDestino=="4"){
                        this.setState({
                            destination4: description,
                            showListdestination: false,
                            showListdestination2: false,
                            showListdestination3: false,
                            showListdestination4: false
                        })
                    }
                }
            }
        }
    };

  

    render() {
        return (
            <ScrollView style={styles.container}>
                {/* Barra de herramientas*/}

                <View
                    style={{
                        flexDirection: "row",
                        paddingTop: 20,
                        backgroundColor: "#fff"
                    }}
                >

                    <Icon
                        name="times-circle"
                        size={30}
                        onPress={() => this.reinitializeComponents()}
                        style={{

                            paddingLeft: 20
                        }
                        }
                    />
                    {this.state.showButtonPlaces ?
                        <Icon
                            name="retweet"
                            size={30}
                            onPress={() => this.hideDeleteButtons()}
                            style={{
                                paddingLeft: 250

                            }
                            }
                        />

                        :
                        <View
                            style={{
                                flexDirection: "row"
                            }}>

                            <View>

                                <Icon
                                    name="ban"
                                    size={30}
                                    onPress={() => this.hideDeleteButtons()}
                                    style={{
                                        paddingLeft: 210

                                    }
                                    }
                                />
                            </View>

                            <View style={{
                                paddingLeft: 15,
                                marginBottom: 5

                            }}>


                                <Button
                                    title="Ok"
                                    onPress={() => this.ViewOption()}
                                >

                                </Button>

                            </View>

                        </View>




                    }

                </View>
                {/* View lugares */}
                <View style={{
                    backgroundColor: "#fff", paddingLeft: 20,
                    paddingBottom:10
                }}>

                    <View style={{ flexDirection: "row" }}>

                        <Input

                            placeholder={this.state.hit}
                            value={this.state.destination}
                            placeholder="Ingrese el punto de partida"

                        

                            onChangeText={destination => this.autocompleteGoogle(destination)}
                        />

                   

                    </View>
                    {this.state.showListdestination ? (
                        <FlatList
                            style={{
                                height: 340
                            }}

                                 
                                              
                            data={this.state.predictions}
                            renderItem={this.Item}
                            keyExtractor={item => item.id}
                
                        />
                    ) : null}





                </View>
                {/* Parada extra 2*/}
                {this.state.showNewArrival ?
                    <View style={{
                        backgroundColor: "#fff", paddingLeft: 20,
                        paddingBottom: 10
                    }}>

                        <View style={{ flexDirection: "row" }}>

                            <Input

                                placeholder={this.state.hit}
                                value={this.state.destination2}
                                placeholder="Agregar parada"

                                rightIcon={
                                    this.state.showButtonsDelete ?
                                        <Icon name="times-circle" 
                                        onPress={() => this.hideArrival()} 
                                        size={30} style={{ paddingLeft: 15 }}></Icon>
                                    :
                                    
                                    null

                                }
                            

                                onChangeText={destination2 => this.autocompleteGoogle2(destination2)}
                            />



                        </View>
                        {this.state.showListdestination2 ? (
                            <FlatList
                                style={{
                                    height: 340
                                }}
                                data={this.state.predictions}
                                renderItem={this.Item}
                                keyExtractor={item => item.id}
                            />
                        ) : null}





                    </View> :
                    null
                }
                {/* Parada extra 1*/}
                {this.state.showNewArrival2 ?
                    <View style={{
                        backgroundColor: "#fff", paddingLeft: 20,
                        paddingBottom: 10
                    }}>

                        <View style={{ flexDirection: "row" }}>

                            <Input

                                placeholder={this.state.hit}
                                value={this.state.destination3}
                                placeholder="Agregar parada"

                                rightIcon={
                                    this.state.showButtonsDelete ?
                                        <Icon name="times-circle"
                                            onPress={() => this.hideArrival()}
                                            size={30} style={{ paddingLeft: 15 }}></Icon>
                                        :

                                        null

                                }




                                onChangeText={destination3 => this.autocompleteGoogle3(destination3)}
                            />



                        </View>
                        {this.state.showListdestination3 ? (
                            <FlatList
                                style={{
                                    height: 340
                                }}
                                data={this.state.predictions}
                                renderItem={this.Item}
                                keyExtractor={item => item.id}
                            />
                        ) : null}





                    </View> :
                    null
                }
                <View style={{
                    backgroundColor: "#fff", paddingLeft: 20
                }}>

                    <View style={{flexDirection:"row"}}>

                        <Input
                          
                            placeholder={this.state.hit}
                            value={this.state.destination4}
                            placeholder="¿A dónde vamos?"
                        
                            rightIcon={
                                this.state.showButtonsDelete?
                                
                                    <Icon name="plus"
                                    onPress={() => this.showArrival()} 
                                    size={30} 
                                    style={{ paddingLeft: 15 }}></Icon>
                                :
                                    null

                            }

                            onChangeText={destination4 => this.autocompleteGoogle4(destination4)}
                        />
{/* 
                        {this.state.showButtonsDelete ?
                            <Icon name="plus" onPress={() => this.showArrival()} size={30} style={{ paddingLeft: 15 }}></Icon>

                            :
                            <View style={
                                {
                                    marginLeft: 10,

                                }
                            }>

                                <Button title={this.state.place}
                                    onPress={() => this.setplaceArrival("place 1")}
                                ></Button>

                            </View>

                        } */}

                    </View>
                    {this.state.showListdestination4 ? (
                        <FlatList
                            style={{
                                height: 340
                            }}
                            data={this.state.predictions}
                            renderItem={this.Item}
                            keyExtractor={item => item.id}
                        />
                    ) : null}


                 


                </View>

                <View style={{
                    flexDirection: "row",
                    backgroundColor: "#fff",
                    paddingRight: 120
                }}>
                    <View style={{ paddingLeft: 200 }}>
                        <CheckBox></CheckBox>
                    </View>

                    <View style={{ paddingLeft: 20, flexDirection: "row", }}>

                        <Text style={{ marginTop: 15, marginLeft: -20 }}> Ida y vuelta</Text>

                    </View>

                </View>

                <Divider style={styles.line} />
                {this.state.showViewOptions ?
                    <View>
                        <View style={
                            {
                                flexDirection: "row",
                                paddingLeft: 20
                            }
                        }>
                            <View style={
                                {
                                    width: 130,
                                    backgroundColor: "silver"
                                }
                            }>
                                <Button icon={
                                    <Icon
                                        name="home"
                                        size={15}
                                        color="white"
                                    />
                                } title=" Añadir casa"
                                    type="outline"
                                    titleStyle={{ color: "white" }}
                                ></Button>

                            </View>

                            <View style={
                                {
                                    width: 150,
                                    marginLeft: 35,
                                    backgroundColor: "silver"
                                }
                            }>

                                <Button icon={
                                    <Icon
                                        name="briefcase"
                                        size={15}
                                        color="white"
                                    />
                                }
                                    type="outline"
                                    title=" Añadir trabajo"
                                    titleStyle={{ color: "white" }}
                                ></Button>
                            </View>

                        </View>
                        <View style={{
                            flexDirection: "row",
                            backgroundColor: "#fff", paddingLeft: 20,
                            paddingTop: 10
                        }}>
                            <Icon

                                name="star"
                                size={25}
                                style={
                                    {
                                        paddingTop: 5
                                    }
                                }></Icon>

                            <View style={
                                {
                                    flexDirection: "column"
                                }
                            }>

                                <Text style={
                                    {
                                        fontWeight: "bold",
                                        paddingLeft: 20
                                    }
                                }>Destinos Favoritos
                        </Text>
                                <Text style={
                                    {
                                        fontWeight: "normal",
                                        paddingLeft: 20
                                    }
                                }>Elige tus lugares favoritos</Text>
                            </View>
                            <Icon name="chevron-right" size={20}
                                onPress={() => this.setState({
                                    showFavoritePlaces: !this.state.showFavoritePlaces
                                })}
                                style={
                                    {
                                        paddingLeft: 85,
                                        paddingTop: 7
                                    }
                                }></Icon>


                        </View>

                        {/* Lista de destinos favoritos */}
                        {this.state.showFavoritePlaces ?
                            <View>
                                <View style={styles.area}>
                                    <Icon

                                        name="map-marker-alt"
                                        size={20}
                                        style={
                                            {
                                                paddingTop: 5,
                                                paddingLeft: 15
                                            }
                                        }></Icon>

                                    <View style={
                                        {
                                            flexDirection: "column"
                                        }
                                    }>

                                        <Text style={
                                            {
                                                fontWeight: "bold",
                                                paddingLeft: 20,
                                                fontSize: 10
                                            }
                                        }
                                            onPress={() => this.props.navigation.navigate("Travel2")}
                                        >Little Caesars Pizza
                                </Text>
                                        <View style={{ width: 250 }}>

                                            <Text style={
                                                {
                                                    fontWeight: "normal",
                                                    paddingLeft: 20,
                                                    fontSize: 10
                                                }
                                            }
                                                onPress={() => this.props.navigation.navigate("Travel2")}
                                            >"Av, María Ahumada de Gómez 14, La Frontera, 28975 Villa de Álvarez, Col."</Text>
                                        </View>
                                    </View>
                                    <Icon name="chevron-right"
                                        onPress={() => this.props.navigation.navigate("Travel2")}
                                        size={20}
                                        style={
                                            {
                                                paddingTop: 5,
                                                paddingLeft: 15
                                            }
                                        }></Icon>
                                </View>

                            </View>
                            :
                            null}



                        <View style={{
                            flexDirection: "row",
                            backgroundColor: "#fff", paddingLeft: 25,
                            paddingTop: 10
                        }}>
                            <Icon

                                name="map-pin"
                                size={25}
                                style={
                                    {
                                        paddingTop: 5
                                    }
                                }></Icon>

                            <View style={
                                {
                                    flexDirection: "column"
                                }
                            }>

                                <Text style={
                                    {
                                        fontWeight: "bold",
                                        paddingLeft: 25
                                    }
                                }>Configurar lugar en el mapa
                        </Text>
                                <Text style={
                                    {
                                        fontWeight: "normal",
                                        paddingLeft: 25
                                    }
                                }>Visualizar vehículos por radio</Text>
                            </View>
                            <Icon name="chevron-right"
                                onPress={() => this.props.navigation.navigate("Travel")}
                                size={20}
                                style={
                                    {
                                        paddingLeft: 70,
                                        paddingTop: 7
                                    }
                                }></Icon>


                        </View>

                    </View>
                    :
                    <View style={styles.container}>

                        <View >

                            <Icon name="clock" size={60}
                                style={
                                    {
                                        textAlign: 'center'
                                    }
                                }
                            ></Icon>

                        </View>

                        <View
                            style={
                                {
                                    paddingTop: 10
                                }
                            }
                        >
                            <Text style={
                                {
                                    textAlign: "center",
                                    fontWeight: "bold"

                                }
                            }>Asegúrate de que la parada no dure mucho tiempo</Text>
                        </View>
                        <View
                            style={
                                {
                                    paddingTop: 10
                                }
                            }
                        >
                            <Text style={
                                {
                                    textAlign: "center",


                                }
                            }>Puedes agregar una parada durante el viaje. Para no perjudicar a los otros pasajeros, no te demores demasiado</Text>
                        </View>

                    </View>

                }

                {!this.state.showViewOptions ?

                    <View style={{ backgroundColor: "white" }}>

                        <Button title="Confirmar"
                            style={{ width: '100%' }}
                            type="outline" ></Button>

                    </View>
                    :
                    null
                }


                <Divider style={styles.block} />
         



       
           

                {/* <View style={[styles.area, { paddingBottom: 10 }]}>
                    <Icon
                        onPress={() => this.props.navigation.navigate("Map")}
                        name="map-pin"
                        style={styles.iconLeft}
                        size={30}
                    />
                    <View style={{ justifyContent: "center" }}>
                        <Text
                            onPress={() => this.props.navigation.navigate("Map")}
                            style={styles.text}
                        >
                            Fijar ubicación en el mapa
            </Text>
                    </View>
                </View> */}
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
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        backgroundColor: "#fff"
    },
    text: {
        paddingLeft: 15,
        fontSize: 16
    },
    rightArrow: {
        paddingLeft: 190
    }
});