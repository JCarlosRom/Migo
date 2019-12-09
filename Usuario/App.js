import React from "react";
import { View, Text, Button } from "react-native";
import {
  createAppContainer,
  StackActions,
  NavigationActions
} from "react-navigation"; // Version can be specified in package.json
import { createStackNavigator } from "react-navigation-stack";


import HomeTravel from "./componentes/Home";
import Travel from "./componentes/Travel";
import Travel_Integrado from "./componentes/Travel_Integrado";
import Travel_MP from "./componentes/TravelMP";
import Travel_MP2 from "./componentes/TravelMP2";
import DesgloseTarifa from "./componentes/DesgloseTarifa";
import InfoTravel from "./componentes/InfoTravel";
import Chat from "./componentes/Chat";
import Inicio from "./componentes/Inicio";


const MainStack = createStackNavigator({

  Inicio:{
    screen:Inicio
  },

  Home:{
    screen:HomeTravel
  },

  Travel:{
    screen:Travel
  },
  Travel_MP:{
    screen:Travel_MP
  },
  Travel_MP2: {
    screen: Travel_MP2
  },
  Travel_Integrado: {
    screen: Travel_Integrado
  },
  DesgloseTarifa:{
    screen:DesgloseTarifa
  },
  InfoTravel:{
    screen: InfoTravel
  },
  Chat: {
    screen: Chat
  },
 
},
  {
    initialRouteName: "Inicio",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#fff"
      },
      headerTintColor: "#000",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    }
  }
)


const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
      navigationOptions:{
        header:null
      }
    }
  }

);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
