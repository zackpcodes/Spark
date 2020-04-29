import React, { Component } from 'react';
import { Alert, View } from 'react-native';



export default class Splash extends Component {

    constructor(props) {
        super(props);
        this.authenticateSession();
    }


    authenticateSession() {
        fetch('http://spark.pemery.co/account', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.status == 200) {
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