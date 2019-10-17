import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { ScrollView } from "react-native-gesture-handler";
import axios from 'axios';
import { GiftedChat } from 'react-native-gifted-chat'


export default class Chat extends Component {
    state = {
        messages: [],
    }

    componentWillMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
            ],
        })
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    static navigationOptions = {
        title: "Chat"
    };



    render() {
        return (

            <ScrollView>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

    area: {
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        backgroundColor: "#fff",
        paddingRight: 20
    },


});
