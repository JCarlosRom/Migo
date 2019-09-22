import React from "react";
import { View, Text, Button } from "react-native";
import {
  createAppContainer,
  StackActions,
  NavigationActions
} from "react-navigation"; // Version can be specified in package.json
import { createStackNavigator } from "react-navigation-stack";
import { Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";

import HomeTravel from "./componentes/Home";
import Travel from "./componentes/Travel";
import Travel2 from "./componentes/Travel2";

const MainStack = createStackNavigator({

  Home:{
    screen:HomeTravel
  },

  Travel:{
    screen:Travel
  },
  Travel2:{
    screen:Travel2
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
