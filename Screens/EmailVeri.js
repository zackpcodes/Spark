import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

import './styles';

// EmailVeri: Ask's users to enter their email and a request is sent
// to api on server for verification code.
export default class EmailVeri extends Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        placeHolderText: "Enter your email",
        btnText: 'Continue'
      };
    }
  
    
    validateEmail = (text) => {
      console.log(text);
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(text) === false) {
        this.setState({ email: text })
        return false;
      }
      else {
        this.setState({ email: text })
        return true;
      }
    }
  
  
    emailVeriRequest = () => {
  
      if(this.validateEmail(this.state.email)){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
          }
        };
        xhttp.open("POST", "35.185.73.228:90", true);
        xhttp.setRequestHeader("Content-Type", "application/json")
        xhttp.send(JSON.stringify({email: this.state.email}));
  
        this.props.navigation.navigate('Veri')
      }else{
  
        alert("Please enter a valid email address")
      }
      
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
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            />
  
            <TouchableOpacity style={stylesForReg.touchButton} onPress={() => this.emailVeriRequest()}>
              <Text style={{ fontSize: 19, padding: 17 }}>{this.state.btnText}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    }
  }