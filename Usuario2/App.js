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
import Travel_IntegradoChange from "./componentes/Travel_IntegradoChange";

import TravelNoDestination from "./componentes/TravelNoDestination";

import Travel_MP from "./componentes/TravelMP";
import TravelMPChange from "./componentes/TravelMPChange";

import Travel_MP2 from "./componentes/TravelMP2";
import TravelMP2Change from "./componentes/TravelMP2Change"

import DesgloseTarifa from "./componentes/DesgloseTarifa";
import DetalleCancelacion from "./componentes/DetalleCancelacion"

import InfoTravel from "./componentes/InfoTravel";
import Chat from "./componentes/Chat";
import Inicio from "./componentes/Inicio";
import changeDestinoView from "./componentes/changeDestinoView"


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
  TravelMPChange: {
    screen: TravelMPChange
  },
  Travel_MP2: {
    screen: Travel_MP2
  },
  TravelMP2Change: {
    screen: TravelMP2Change
  },
  Travel_Integrado: {
    screen: Travel_Integrado
  },
  Travel_IntegradoChange: {
    screen: Travel_IntegradoChange
  },
  DesgloseTarifa:{
    screen:DesgloseTarifa
  },
  DetalleCancelacion:{
    screen:DetalleCancelacion
  },
  InfoTravel:{
    screen: InfoTravel
  },
  Chat: {
    screen: Chat
  },
  TravelNoDestination:{
    screen: TravelNoDestination
  },
  changeDestinoView:{
    screen: changeDestinoView
  }
 
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
