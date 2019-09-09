import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TextInput  } from "react-native";
import { Divider, CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
    createAppContainer,
    StackActions,
    NavigationActions
} from "react-navigation"; // Version can be specified in package.json
import { createStackNavigator } from "react-navigation-stack";
import { stringify } from "qs";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Arrivals
            showNewArrival:false,
            showNewArrival2:false,
            // Change options below screen
            showViewOptions:true,
            // Delete buttons delete 
            showButtonsDelete:true,
            //  State to show the position to arrival 
            showPositionArrival:false,
            // Hide or show button retweet
            showButtonPlaces: true,
            // Position of arrivals 
            place2:"",
            place1:"",
            place:""
     
        };
        showNewArrival=false;
        showNewArrival2 = false;
        varplaceArrival=1;

    }
    reinitializeComponents() {
        this.state = {
        
            showViewOptions: true,
    

        };
  
      
    }
    // Function to show the buttons of position of arrivals
    showPositionArrival(){
        this.state={
            showPositionArrival: false 
        };
    }
    // Function to shows a new stop in a view
    showArrival(){
        
        if(showNewArrival==false){
            
            this.setState({
                showNewArrival: true,
                showViewOptions: false
            })
            showNewArrival = true;
        }else{
            if(showNewArrival==true){
                if(showNewArrival2==false){
                    
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
                showNewArrival: false
            })
            showNewArrival = false;
        } else {
            if (showNewArrival == false) {
                if (showNewArrival2 == true) {

                    this.setState({
                        showNewArrival2: false
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
    hideDeleteButtons(){
        this.setState({
            showButtonsDelete: false,
            showButtonPlaces: false
        })
    }
    

    setplaceArrival(place){
        
        if(varplaceArrival<4){
            

            if(place=="place 1"){
                
            
                this.setState({
                    place: varplaceArrival.toString()
                })
                varplaceArrival++;
         
            }else{
                if(place=="place 2"){

                    this.setState({
                        place1: varplaceArrival.toString()
                    })
                    varplaceArrival++;
               
                }else{
                    if(place=="place 3"){
                        this.setState({
                            place2: varplaceArrival.toString()
                        })
                        varplaceArrival++;
                     
                    }
                }
            }
         
        }

    }
    
    static navigationOptions = {
        title: "Solicitar taxi"
    };
    
    
  

    render() {
        return (
            <View style={styles.container}>
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

                            paddingLeft:20
                        }
                        }
                    />
                    {this.state.showButtonPlaces?
                    <Icon
                        name="retweet"
                        size={30}
                        onPress={() => this.hideDeleteButtons()}
                        style={{
                            paddingLeft: 250
                           
                        }
                        }
                    />
                    
                    :   <View>

                            <Icon
                                name="ban"
                                size={30}
                                onPress={() => this.hideDeleteButtons()}
                                style={{
                                    paddingLeft: 250

                                }
                                }
                            />
                            <Button
                            title="Ok"
                            style={{
                                paddingLeft:270
                                }}
                            >
                            </Button>
                                />


                        </View>
                        
                    }
                 
                </View>
                {/* View lugares */}
                <View style={styles.area}>
                   <View>
                        <TextInput
                            style={{ height: 40, width: 270, borderColor: 'gray', borderWidth: 1, backgroundColor:'#DCDCDC' }}
                        placeholder=" Ingrese el punto de partida"
                        placeholderTextColor="red"
                        ></TextInput>
                   </View>
                 
                </View>
                {/* Parada extra 2*/}
                {this.state.showNewArrival2 ?
                    <View style={{
                        flexDirection: "row",
                        backgroundColor: "#fff", paddingLeft: 20,
                        paddingBottom: 20
                    }}>


                        <TextInput
                            style={{ height: 40, width: 270, borderColor: 'gray', borderWidth: 1, backgroundColor: '#DCDCDC' }}
                            placeholder=" Agregar parada"
                            placeholderTextColor="dimgray"
                        ></TextInput>
                        {this.state.showButtonsDelete ?
                            <Icon name="times-circle" onPress={() => this.hideArrival()} size={30} style={{ paddingLeft: 15 }}></Icon>
                            :
                            <View style={
                                {
                                    marginLeft: 10,

                                }
                            }>

                                <Button
                                
                                title={this.state.place2}
                                
                                onPress={()=>this.setplaceArrival("place 3")}
                                    style={
                                        {
                                            width: 40
                                        }
                                    }
                                    
                                ></Button>

                            </View>

                        }

                    


                    </View> :
                    null
                } 
                {/* Parada extra 1*/}
                {this.state.showNewArrival ?
                    <View style={{
                        flexDirection: "row",
                        backgroundColor: "#fff", paddingLeft: 20,
                        paddingBottom:20
                    }}>


                        <TextInput
                            style={{ height: 40, width: 270, borderColor: 'gray', borderWidth: 1, backgroundColor: '#DCDCDC' }}
                            placeholder=" Agregar parada"
                            placeholderTextColor="dimgray"
                        ></TextInput>

                        {this.state.showButtonsDelete?
                        <Icon name="times-circle" onPress={() => this.hideArrival()} size={30} style={{ paddingLeft: 15 }}></Icon>
                        :
                            <View style={
                                {
                                    marginLeft:10,
                                   
                                }
                            }>

                                <Button title={this.state.place1}
                                    onPress={() => this.setplaceArrival("place 2")}
                                ></Button>

                            </View>
                           
                        }

                    </View> :
                    null
                } 
                <View style={{flexDirection: "row",
                    backgroundColor: "#fff", paddingLeft: 20}}>

                    
                        <TextInput
                            style={{ height: 40, width: 270, borderColor: 'gray', borderWidth: 1, backgroundColor: '#DCDCDC' }}
                            placeholder="¿A dónde vamos?"
                            placeholderTextColor="dimgray"
                        ></TextInput>
                        
             
            
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

                    }


                </View>
                
                <View style={{
                    flexDirection: "row",
                    backgroundColor: "#fff",
                    paddingRight: 120
                }}>
                 
                    <CheckBox></CheckBox>
                    <Text style={{ marginTop: 15, marginLeft:-20 }}> Ida y vuelta</Text>
              
           


                </View>
                
                <Divider style={styles.line} />
                {this.state.showViewOptions?
                    <View>
                      <View style={
                          {
                              flexDirection:"row",
                              paddingLeft:20
                          }
                      }>
                        <View style={
                            {
                                width: 130
                            }
                        }>
                            <Button color="silver" icon={
                                <Icon
                                    name="home"
                                    size={15}
                                    color="white"
                                />
                            } title="Añadir casa"
                            ></Button>

                        </View>

                    <View style={
                        {
                            width: 180,
                            paddingLeft:45
                        }
                    }>

                        <Button color="silver" icon={
                            <Icon
                                name="briefcase"
                                size={15}
                                color="white"
                            />
                        }  title="Añadir trabajo"></Button>
                    </View>

                      </View>
                    <View style={{
                        flexDirection: "row",
                        backgroundColor: "#fff", paddingLeft: 20,
                        paddingTop:10
                    }}>
                    <Icon
                        
                        name="star"
                        size={25}
                        style={
                            {
                                paddingTop:5
                            }
                        }></Icon>
    
                        <View style={
                            {
                                flexDirection: "column"
                            }
                        }>
    
                        <Text style={
                            {
                                fontWeight:"bold",
                                paddingLeft:20
                            }
                        }>Destinos Favoritos
                        </Text>
                        <Text style={
                            {
                                fontWeight: "normal",
                                paddingLeft:20
                            }
                        }>Elige tus lugares favoritos</Text>
                        </View>
                        <Icon name="chevron-right" size={20}
                        style={
                            {
                                paddingLeft: 85,
                                paddingTop:7
                            }
                        }></Icon>
    
                    
                    </View>
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
                        <Icon name="chevron-right" size={20}
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
                                    paddingTop:10
                                }
                            }
                        >
                            <Text style={
                                {
                                    textAlign:"center",
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
                    
            
                <Divider style={styles.block} />
            </View>
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
