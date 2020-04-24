import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

import './styles';
import './Globals';


// ProfileSetup: Allows the user to set up a profile then makes 
// a call to the server to push profile data.
export default class ProfileSetup extends Component {
    constructor(props) {
      super(props);
      this.state = {
        image: userProfilepic,
        organizationText: '',
        usernameText: '',
        placeHolderOrganization: 'Organization',
        placeHolderUsername: "Username",
        btnText: 'Done'
      };
    }

  
    profilePush = () => {
      fetch('http://104.196.33.197:80/account/modify', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.state.usernameText,
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            if (responseJson.status == 200){
              this.props.navigation.navigate('Convos')
            }else{
              Alert.alert('Invalid', 'Please login.')
            }
            
          })
          .catch((error) => {
            console.error(error);
            Alert.alert('Error', 'A connection error has occurred!')
          });
    }
  
    render() {
      let { image } = this.state;
      return (
          <View style={stylesForReg.container}>
  
            <TouchableOpacity onPress={this._pickImage}>
              <Image source={{ uri: image }} style={stylesForReg.profilePicSelection} />
            </TouchableOpacity>
  
            <TextInput
              style={stylesForReg.textIn}
              placeholder={this.state.placeHolderOrganization}
              onChangeText={(organizationText) => this.setState({ organizationText })}
              value={this.state.organizationText}
            />
            <TextInput
              style={stylesForReg.textIn}
              placeholder={this.state.placeHolderUsername}
              onChangeText={(usernameText) => this.setState({ usernameText })}
              value={this.state.veriCode}
            />
  
            <TouchableOpacity style={stylesForReg.touchButton} onPress={() => this.profilePush()}>
              <Text style={{ fontSize: 19, padding: 17 }}>{this.state.btnText}</Text>
            </TouchableOpacity>
          </View>
      );
    }
  
    componentDidMount() {
      this.getPermissionAsync();
    }
  
    getPermissionAsync = async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    }
  
    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        this.setState({ image: result.uri });
        userProfilepic = result.uri
      }
    };
  }