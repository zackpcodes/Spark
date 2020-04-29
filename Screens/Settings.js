import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

import './styles';
import './Globals';

// Settings: Allows the user to change settings for the application
export default class ProfileSetup extends Component {
    constructor(props) {
      super(props);
      this.state = {
        btnText: 'Done',
        statusText: 'Coming Soon!!!'
      };
    }

    settingsPush = () => {

        this.props.navigation.navigate('Convos')
      }

    render() {
        return (
            <View style ={stylesForReg.container}>

                <Text style={stylesForReg.sText}>{this.state.statusText}</Text>

                <TouchableOpacity style={stylesForReg.touchButton} onPress={() => this.settingsPush()}>
                    <Text style={{ fontSize: 19, padding: 17 }}>{this.state.btnText}</Text>
                </TouchableOpacity>
            </View>
        );
    }


}
