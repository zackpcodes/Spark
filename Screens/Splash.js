import React, { Component } from 'react';
import { Alert, View } from 'react-native';

import './Globals'

// The Splash component allows us to check to see if the user is logged in
// or not based on the server response.
export default class Splash extends Component {

    constructor(props) {
        super(props);
        this.authenticateSession();
    }

    // authenticateSession: Allows for the login verification of a user
    // upon loading of the application.
    authenticateSession() {
        fetch('http://spark.pemery.co/account', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 200) {
                    console.log(responseJson)
                    global.curUserUUID = responseJson.content.uuid;
                    this.props.navigation.replace('Convos')
                } else {
                    this.props.navigation.replace('Email')
                }
            })
            .catch((error) => {
                console.error(error);
                Alert.alert('Error', 'A connection error has occurred!')
            });
    }


    render() {
        return (
            <View>
            </View>
        );
    }
}