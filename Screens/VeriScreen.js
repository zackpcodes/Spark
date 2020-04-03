import React, { Component } from 'react';
import { Text, View,TextInput, TouchableOpacity, Image} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

import './styles';

// VeriScreen: Ask's user to enter verification code from api, then
// sends this entered code back to server via api call for verification.
export default class VeriScreen extends Component {

    constructor(props) {
      super(props);
      this.state = {
        veriCode: '',
        placeHolderText: "Enter Verification Code",
        btnText: 'Confirm'
      };
    }
  
  
    codeVeriRequest = () => {
      // Make api call here to verify entered code
      this.props.navigation.navigate('ProfileSetup')
  
    }
  
    render() {
      return (
        <KeyboardAvoidingView style={stylesForReg.container} behavior="padding" enabled>
          <View style={stylesForReg.container}>
            <Image
              style={{ width: 210, height: 210, marginLeft: 20, }}
              source={require('./MainLogo.png')}
            />
  
            <Text style={{ marginBottom: 160, fontSize: 55, textAlign: 'center', fontFamily: 'sans-serif-thin', }}>SPARK</Text>
  
            <TextInput
              style={stylesForReg.textIn}
              placeholder={this.state.placeHolderText}
              onChangeText={(veriCode) => this.setState({ veriCode })}
              value={this.state.veriCode}
            />
  
            <TouchableOpacity style={stylesForReg.touchButton} onPress={() => this.codeVeriRequest()}>
              <Text style={{ fontSize: 19, padding: 17 }}>{this.state.btnText}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    }
  }