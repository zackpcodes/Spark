import React, { Component } from 'react';
import { Text, View,TextInput, TouchableOpacity, Image, Alert} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

import './styles';

// VeriScreen: Ask's user to enter verification code from api, then
// sends this entered code back to server via api call for verification.
export default class VeriScreen extends Component {

    constructor(props) {
      super(props);
      this.state = {
        email: global.email_phone,
        veriCode: '',
        placeHolderText: "Enter Verification Code",
        btnText: 'Confirm'
      };
    }
  
  
    codeVeriRequest = () => {

        fetch('http://spark.pemery.co/account/verify', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_phone: this.state.email,
            code: this.state.veriCode,
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            if (responseJson.status == 200){
              this.props.navigation.replace('ProfileSetup')
            }else{
              Alert.alert('Invalid', 'Invalid verification code, please check the code and try again.')
            }
            
          })
          .catch((error) => {
            console.error(error);
            Alert.alert('Error', 'A connection error has occurred!')
          });
  
    }
  
    render() {
      return (
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
      );
    }
  }