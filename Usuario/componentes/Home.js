import React, { Component } from "react";
import { Text, View, StyleSheet, FlatList, TouchableHighlight } from "react-native";
import { Divider, CheckBox, Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import * as Location from "expo-location";
import { ScrollView } from "react-native-gesture-handler";
import { StackActions, NavigationEvents, NavigationActions } from 'react-navigation';
import keys from "./global";
import * as Permissions from 'expo-permissions';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';

// import keys from "../../config/Keys";

export default class Home extends Component {


    constructor(props) {

        // keys.socket = SocketIOClient('http://192.168.1.161:3001');
        // keys.socket = SocketIOClient('http://35.203.42.33:3001/');
        
        super(props);
        this.state = {
            myPosition:{
                address: null,
                addressInput: null,
                latitude: null,
                longitude: null
            },
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
            place3: "",
            place2: "",
            place1: "",
            showFavoritePlaces: false,
            Destinos: null,
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
            flagDestino:"",
            direccion:null,
            coordinatesPuntoPartida:null,
        
           
            checked: false



        };

        showNewArrival = false;
        showNewArrival2 = false;
        varplaceArrival = 1;

        // Función para recibir el mensaje del conductor
        keys.socket.on('chat_usuario', (num) => {

            console.log("chat_usuario", num)

            keys.Chat.push(num.Mensaje);

            this.setState({
                Chat: keys.Chat
            })

            console.log(keys.Chat);

        })

     




    }
 

    changetoConfigureTravel(){
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Travel' })],
            key:undefined
        });

        this.props.navigation.dispatch(resetAction);
    }

    // Function to show the buttons of position of arrivals
    showPositionArrival() {
        this.state = {
            showPositionArrival: false
        };
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
                showButtonPlaces: true
            })
        }
    }

    // Asignar el orden de las paradas a los inputs
    setplaceArrival(place) {


        if (varplaceArrival < 4) {


            if (place == "Place 1") {

                if(this.state.place1==""){

                    this.setState({
                        place1: varplaceArrival.toString()
                    })
                    varplaceArrival++;
    
                    // console.log(this.state.place1)
                }else{
                    alert("Número de parada ya asignada");
                }



            } else {
                if (place == "Place 2") {

                    if(this.state.place2==""){

                        this.setState({
                            place2: varplaceArrival.toString()
                        })
                        varplaceArrival++;
                        // console.log(this.state.place2)

                    }else{
                        alert("Número de parada ya asignada");
                    }


                } else {

                
                    if (place == "Place 3") {

                        if(this.state.place3==""){

                            this.setState({
                                place3: varplaceArrival.toString()
                            })
                            varplaceArrival++;
                            // console.log(this.state.place3)

                        }else{
                            alert("Número de parada ya asignada");
                        }

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

    
        let location = await Location.getCurrentPositionAsync({});
    

        try {
            var locationAddress = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            Address = this.props.navigation.getParam('Address', 'No Address');

            console.log(Address);
            console.log(keys.tipoVehiculo);

            if (Address != 'No Address') {

                locationStr = Address;
            
            }else{

                locationStr = locationAddress[0]["street"] + " #" + locationAddress[0]["name"] + " " + locationAddress[0]["city"] + " " + locationAddress[0]["region"];
            }

            this.setState({
                myPosition:{
                    address:locationAddress,
                    addressInput:locationStr,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                }
            })

        } catch (e) {
            console.log(e)
        }

        // Método para consultar destinos
        try {
            //console.log(this.props.switchValue);
            const res = await axios.post('http://35.203.42.33:3003/webservice/interfaz204/MostrarDestinosFavoritos', {
                id_usuario: this.state.id_usuario
            });

            this.state.Destinos = res.data.datos
         
            //console.log(res);


        } catch (e) {
            console.log(e);
            alert("No hay conexión al web service", "Error");
        }

        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

         
    
    }

  

    autocompleteGoogle1 = async destination => {
        this.setState({ 
            myPosition:{

                addressInput:destination

            }
        });

        this.setState({
            showListdestination:true,
            showListdestination2:false,
            showListdestination3:false,
            showListdestination4:false,
            flagDestino:"1"
        })

        const apiUrl =
            "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" +
            'AIzaSyCr7ftfdqWm1eSgHKPqQe30D6_vzqhv_IY' +
            "&input=" +
            this.state.myPosition.addressInput +
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
     

        return (
            <View>
                <NavigationEvents onDidFocus={() => console.log('I am triggered')} />
                <TouchableHighlight
               
                    onPress={() => this.setDirectionInput(item.description)}
              >
                    <View style={[styles.area, { paddingTop: 10, paddingBottom: 10 }]}>
                        <Icon color="#ff8834" name="map-marker-alt" style={styles.iconLeft} size={30} />
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
                myPosition:{
                   addressInput:description
                },
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

  

    showArrival = (e) => {

       

        if (showNewArrival == false) {

            this.setState({
                showNewArrival: true,
                showViewOptions: false
            })
            showNewArrival = true;

            setTimeout(() => {
                this.parada1Focus.focus();

            }, 500);

        } else {
            if (showNewArrival == true) {
                if (showNewArrival2 == false) {

                    this.setState({
                        showNewArrival2: true
                    })
                    showNewArrival2 = true;
                    setTimeout(() => {
                        this.parada2Focus.focus();

                    }, 500);
                }
            }
        };
       
    }

    clear = () => {
        this.setState({ 
            myPosition:{
                addressInput:""
            } 
    });
    };


    async DestinosFavoritosTravel(Destino){


   

        if(this.state.myPosition.addressInput!=""){



            try {
                
                // console.log(this.state.myPosition.addressInput)
                // console.log(Destino);
    
                let puntoPartida = await Location.geocodeAsync(this.state.myPosition.addressInput);  
                
                let DestinoCords = await Location.geocodeAsync(Destino);
    
                // console.log(puntoPartida);
    
                // console.log(DestinoCords);
                
                if(puntoPartida.length==0 ){
                    alert("Favor de agregar un punto de partida correcto");
                }else{
                    if (DestinoCords[0]["latitude"] == null || DestinoCords[0]["longitude"] == null) {
                        alert("Favor de agregar un destino correcto");
                    }else{
    
                        keys.travelInfo.puntoPartida = this.state.myPosition;
                        keys.travelInfo.Parada1 = Destino;
                        keys.type="Unico"
                
                        this.props.navigation.navigate("Travel_Integrado");
                    }
                }

            } catch (error) {
                
            }


        }else{

            alert("Favor de ingresar un punto de partida válido");

        }
    }

    // Función para iniciar el viaje 
    Travel = () =>{


        if (keys.categoriaVehiculo == null) {
            alert("Favor de seleccionar un tipo de vehículo en configurar lugar en el mapa");
        } else {

    
            if(this.state.showNewArrival==false){
    
                if(this.state.destination4==""){
                    alert("Favor de agregar un destino");
                }else{
    
                
                    keys.travelInfo.puntoPartida = this.state.myPosition;
                    keys.travelInfo.Parada1 = this.state.destination4;
    
                    
                    keys.type = "Unico"
        
                    this.props.navigation.navigate("Travel_Integrado");
                }
    
    
                
    
            }else{
    
                    if(this.state.myPosition.addressInput=="" ){
                        alert("Favor de agregar un punto de partida");
                    }else{
                        if(this.state.destination2==""){
                        
                            alert("favor de agregar la parada 1")
                        }else{
                            if(this.state.showNewArrival2){
    
                                if(this.state.destination3==""){
                                        alert("Favor de agregar la parada 2");
                                }else{
                                    if(this.state.destination4==""){
                                        alert("Favor de agregar un destino")
                                    }else{
    
                                        if(this.state.place1==""){
                                            alert("Favor de asignar número de parada a la parada 1")
                                        }else{
    
                                
                                            if(this.state.place2==""){
                                                alert("Favor de asignar número de parada a la parada 2")
                                            }else{
                                                if(this.state.place3==""){
                                                    alert("Favor de asignar número de parada a la parada 3")
                                                }else{
    
                                                    keys.travelInfo.puntoPartida = this.state.myPosition;
                                                    keys.travelInfo.Parada1 = this.state.destination2;
                                                    keys.travelInfo.Parada2 = this.state.destination3;
                                                    keys.travelInfo.Parada3 = this.state.destination4;
    
                                                    var Paradas = {
                                                        Parada1: this.state.place1,
                                                        Parada2: this.state.place2,
                                                        Parada3: this.state.place3
                                                    }
    
                                                    keys.Paradas= Paradas;
                                                    keys.flag= true;
                                                    keys.type="Multiple"
    
                                                    this.props.navigation.navigate("TravelMP");
                                                }
                                            }
    
                                            
                                            
                                        }
        
                                
    
                                    }
    
                                }
                            }else{
    
                                if(this.state.place1==""){
                                    alert("Favor de asignar número de parada a la parada 1")
                                }else{
                                    if(this.state.place3==""){
                                        alert("Favor de asignar número de parada a la parada 2 ")
                                    }else{
                                        
                                        if(this.state.destination4!=""){
    
    
                                            keys.travelInfo.puntoPartida = this.state.myPosition;
                                            keys.travelInfo.Parada1 = this.state.destination2;
                                            keys.travelInfo.Parada3 = this.state.destination4;
    
                                            var Paradas = {
                                                Parada1: this.state.place1,
                                                Parada3: this.state.place3
                                            }
    
                                            keys.Paradas = Paradas;
                                            keys.flag = true;
                                            keys.type = "Multiple 2 paradas"
    
                
                
                
                                            this.props.navigation.navigate("TravelMP2");
            
                                        }else{
                                            alert("¡Favor de agregar un destino!")
                                        }
                                    }
                                }
    
    
                            }
                        }
                    }
                    
                }
        }



     
        
    }
    
    reinitializeComponents = () => {
        this.setState({
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
            place3: "",
            place2: "",
            place1: "",
            showFavoritePlaces: false,
            Destinos: null,
            destination2: "",
            destination3: "",
            destination4: "",
            hit: "",
            type: "",
            predictions: [],
            latitude: 0,
            longitude: 0,
            showListdestination: false,
            showListdestination2: false,
            showListdestination3: false,
            showListdestination4: false,
            flagDestino: "",
            direccion: null,
            coordinatesPuntoPartida: null,
            myPosition: {
                latitude: 0,
                longitude: 0,
                address: "",
                addressInput: "",

            },
            travelInfo: {
                puntoPartida: null,
                Parada1: null,
                Parada2: null,
                Parada3: null
            }
        })
    }

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
                        color="#ff8834"
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
                            color="#ff8834"
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

                    {this.state.addressInput!=""?
                    
                        <Input
                            value={this.state.myPosition.addressInput}
                            placeholder="Ingrese el punto de partida"
                            onChangeText={addressInput => this.autocompleteGoogle1(addressInput)} 
                            rightIcon={
                                <Icon
                                    name="undo-alt"
                                    onPress={this.clear}
                                    size={24}
                                    color="#ff8834"
                                />
                            }
                        />
                
                    :   
                            <Input

                                placeholder="Ingrese el punto de partida"
                                rightIcon={
                                    <Icon
                                        name="undo-alt"
                                        onPress={this.clear}
                                        size={24}
                                        color="#ff8834"
                                    />
                                }
                            />
                    
                    }
                  

                   

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
                            <View style={!this.state.showButtonsDelete?{width:300}:{width:330}}>
                                <Input
                                    
                                    ref={input => this.parada1Focus = input}
                                    placeholder={this.state.hit}
                                    value={this.state.destination2}
                                    placeholder="Agregar parada 1"

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


                            {!this.state.showButtonsDelete ?

                                <Button title={this.state.place1}
                                onPress={()=>this.setplaceArrival("Place 1")}
                                ></Button>

                                :
                                null
                            }




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

                            <View style={!this.state.showButtonsDelete ? { width: 300 } : { width: 330 }}>

                            <Input
                                ref={input => this.parada2Focus = input}
                                placeholder={this.state.hit}
                                value={this.state.destination3}
                                placeholder="Agregar parada 2"

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



                            {!this.state.showButtonsDelete ?

                                <Button title={this.state.place2}
                                onPress={() => this.setplaceArrival("Place 2")}
                                ></Button>

                                :
                                null
                            }



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
                        <View style={!this.state.showButtonsDelete ? { width: 300} : { width: 330 }}>

                            <Input
                                ref={this.stop2}
                                placeholder={this.state.hit}
                                value={this.state.destination4}
                                placeholder="¿A dónde vamos?"
                            
                                rightIcon={
                                    this.state.showButtonsDelete?
                                    
                                        <Icon name="plus"
                                        color="#ff8834"
                                        onPress={this.showArrival}
                                        size={30} 
                                        style={{ paddingLeft: 15 }}></Icon>
                                    :
                                        null

                                }

                                onChangeText={destination4 => this.autocompleteGoogle4(destination4)}
                            />

                        </View>



                        {!this.state.showButtonsDelete ?
                            
                            <View style={{ width: 25 }}>
                                
                                <Button 
                                title={this.state.place3}
                                onPress={() => this.setplaceArrival("Place 3")}
                                ></Button>

                            </View>

                            :
                            null
                        }
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

                        <CheckBox
                            checked={this.state.checked}
                            onPress={() => this.setState({ checked: !this.state.checked })}
                        />
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
                                        color="#ff8834"
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
                                        color="#ff8834"
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
                            backgroundColor: "#fff",
                            paddingTop: 10
                        }}>
                        
                        <View style={{flex:1}}>


                            <Icon
                                color="#ff8834"
                                name="star"
                                size={25}
                                style={
                                    {
                                        paddingTop: 5,
                                        paddingLeft: 25,
                                    }
                                }></Icon> 

                        </View>

                            <View style={
                                {
                                    flexDirection: "column",
                                    flex:4
                                }
                            }>

                                <Text style={
                                    {
                                        fontWeight: "bold",
                                    }
                                }>Destinos Favoritos
                                </Text>
                                <Text style={
                                    {
                                        fontWeight: "normal",
                                    }
                                }>Elige tus lugares favoritos</Text>
                            </View>


                            <View style={{flex:1}}>

                                <Icon name="chevron-right" size={20}
                                    color="#ff8834"
                                    onPress={() => this.setState({
                                        showFavoritePlaces: !this.state.showFavoritePlaces
                                    })}
                                    style={
                                        {
                                            paddingTop: 7
                                        }
                                    }></Icon>

                            </View>




                        </View>

                        {/* Lista de destinos favoritos */}
                        {this.state.showFavoritePlaces ?

                            this.state.Destinos!=null?

                         
                                this.state.Destinos.map(Destino => (

                                    <View key={Destino.coordenadas}>
                                        <View style={{
                                            flexDirection: "row",
                                            paddingTop: 5,
                                            paddingBottom: 5,
                                            paddingLeft: 20,
                                            backgroundColor: "#fff"}}>
                                            <Icon
                                                color="#ff8834"
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
                                                    onPress={() => this.DestinosFavoritosTravel(Destino.direccion)}
                                                >{Destino.nombre}
                                        </Text>
                                                <View style={{ width: 250 }}>

                                                    <Text style={
                                                        {
                                                            fontWeight: "normal",
                                                            paddingLeft: 20,
                                                            fontSize: 10
                                                        }
                                                    }
                                                        onPress={() => this.DestinosFavoritosTravel(Destino.direccion)}
                                                    >{Destino.direccion}</Text>
                                                </View>
                                            </View>
                                            <Icon name="chevron-right"
                                                color="#ff8834"
                                                onPress={() => this.DestinosFavoritosTravel(Destino.direccion)}
                                                size={20}
                                                style={
                                                    {
                                                        paddingTop: 5,
                                                        paddingLeft: 15
                                                    }
                                                }></Icon>
                                        </View>

                                    </View>

                                ))
                            : 
                                null
                            :
                                null}



                        <View style={{
                            flexDirection: "row",
                            backgroundColor: "#fff",
                            paddingTop: 10
                        }}>
                            <View style={{flex:1}}>
                                <Icon
                                    color="#ff8834"
                                    name="map-pin"
                                    size={25}
                                    style={{   
                                        paddingLeft: 25,
                                        paddingTop: 5
                                    }
                                    }></Icon>

                            </View>

                            <View style={
                                {
                                    flexDirection: "column",
                                    flex:4
                                }
                            }>

                                <Text style={
                                    {
                                        fontWeight: "bold",
                                  
                                    }
                                }>Configurar lugar en el mapa
                                </Text>
                                <Text style={
                                    {
                                        fontWeight: "normal",
                                  
                                    }
                                }>Visualizar vehículos por radio</Text>
                            </View>
                            <View style={{ flex: 1 }}>

                                <Icon name="chevron-right"
                                    color="#ff8834"
                                    onPress={() => this.changetoConfigureTravel()}
                                    size={20}
                                    // style={
                                    //     {
                                    //         paddingLeft: 70,
                                    //         paddingTop: 7
                                    //     }
                                    // }
                                    ></Icon>

                            </View>


                        </View>

                    </View>
                    :
                    <View style={styles.container}>

                        <View >

                            <Icon name="clock" size={60}
                                color="#ff8834"
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

           

                    <View style={{ backgroundColor: "white", position:"relative", marginTop:120 }}>

                        <Button title="Confirmar"
                            style={{ width: '100%' }}
                            type="outline" 
                        onPress={()=>this.Travel()}
                            ></Button>

                    </View>
                 


                <Divider style={styles.block} />
         



       
     
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