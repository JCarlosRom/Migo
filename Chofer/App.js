import React from "react";
import { View, Text, Button } from "react-native";
import {
  createAppContainer,
  StackActions,
  NavigationActions
} from "react-navigation"; // Version can be specified in package.json
import { createStackNavigator } from "react-navigation-stack";
import HomeTravel from "./componentes/Home";
import TravelMP from "./componentes/TravelMP";
import TravelMP2 from "./componentes/TravelMP2";
import Travel_Integrado from "./componentes/Travel_Integrado";
import TravelNoDestination from "./componentes/TravelNoDestination";
import Pago from "./componentes/Pago";
import viajeFinalizado from "./componentes/viajeFinalizado";
import Travel_Waze from './componentes/Travel_Waze'
import Notificaciones from  './componentes/Notificaciones';
import Chat from './componentes/Chat';
import ViewSetUbication from './componentes/ViewSetUbication';


const MainStack = createStackNavigator({

  Home:{
    screen:HomeTravel
  },

  Travel_Integrado:{
    screen:Travel_Integrado
  },
  TravelMP:{
    screen:TravelMP
  },
  TravelMP2: {
    screen: TravelMP2
  },
  TravelNoDestination:{
    screen:TravelNoDestination
  },
  Pago:{
    screen:Pago
  },
  viajeFinalizado:{
    screen:viajeFinalizado
  },
  Travel_Waze:{
    screen:Travel_Waze
  },
  Notificaciones:{
    screen:Notificaciones
  },
  Chat:{
    screen:Chat
  },
  ViewSetUbication:{
    screen:ViewSetUbication
  }
},
  {
    initialRouteName: "Home",
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
