import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Alert} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

import './styles';
import './Globals';



// EmailVeri: Ask's users to enter their email and a request is sent
// to api on server for verification code.
export default class EmailVeri extends Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
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
      global.email_phone = this.state.email
      if (this.validateEmail(this.state.email)) {
        fetch('http://spark.pemery.co/account/dispatch', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.state.email,
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.status == 200){
              this.props.navigation.replace('Veri');
            }else{
              Alert.alert('Error', responseJson.content.comment);
            }
            
          })
          .catch((error) => {
            console.log(error)
            Alert.alert('Error', 'Promise rejection error')
          });
        
      } else {
        alert("Please enter a valid email address")

      } 
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
              placeholder='Enter Your Email'
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            />
  
            <TouchableOpacity style={stylesForReg.touchButton} onPress={() => this.emailVeriRequest()}>
              <Text style={{ fontSize: 19, padding: 17 }}>Continue</Text>
            </TouchableOpacity>
          </View>
      );
    }
  }