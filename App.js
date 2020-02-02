import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, TextInput, TouchableOpacity, Image } from 'react-native';
import Constants from 'expo-constants';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { KeyboardAvoidingView } from 'react-native';


// EmailVeri: Ask's users to enter their email and a request is sent
// to api on server for verification code.
class EmailVeri extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      placeHolderText: "Enter your email",
      btnText: 'Continue'
    };
  }

  
  validate = (text) => {
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

    // Make api call here to send user entered email to server

    if(this.validate(this.state.email)){
      this.props.navigation.navigate('Veri')
    }else{
      alert("Please enter a valid email address")
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>

        <View style={styles.container}>
          <Image
            style={{ width: 210, height: 210, marginLeft: 20, }}
            source={require('./MainLogo.png')}
          />
          <Text style={{ marginBottom: 160, fontSize: 55, textAlign: 'center', fontFamily: 'sans-serif-thin', }}>SPARK</Text>
          <TextInput
            style={styles.textIn}
            placeholder={this.state.placeHolderText}
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
          />

          <TouchableOpacity style={styles.touchButton} onPress={() => this.emailVeriRequest()}>
            <Text style={{ fontSize: 19, padding: 17 }}>{this.state.btnText}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

// VeriScreen: Ask's user to enter verification code from api, then
// sends this entered code back to server via api call for verification.
class VeriScreen extends Component {

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
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.container}>
          <Image
            style={{ width: 210, height: 210, marginLeft: 20, }}
            source={require('./MainLogo.png')}
          />

          <Text style={{ marginBottom: 160, fontSize: 55, textAlign: 'center', fontFamily: 'sans-serif-thin', }}>SPARK</Text>

          <TextInput
            style={styles.textIn}
            placeholder={this.state.placeHolderText}
            onChangeText={(veriCode) => this.setState({ veriCode })}
            value={this.state.veriCode}
          />

          <TouchableOpacity style={styles.touchButton} onPress={() => this.codeVeriRequest()}>
            <Text style={{ fontSize: 19, padding: 17 }}>{this.state.btnText}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

// ProfileSetup: Allows the user to set up a profile then makes 
// a call to the server to push profile data.
class ProfileSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      veriCode: '',
      placeHolderOrganization: 'Organization',
      placeHolderUsername: "Username",

      btnText: 'Done'
    };
  }

  profilePush = () => {
    // Make api call here to push profile data to server
    //this.props.navigation.navigate('Veri')
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.container}>

          <TouchableOpacity style={styles.profilePicSelection} onPress={() => this.profilePush()}>
            <Image
              style={{ width: 50, height: 50, marginLeft: 58, marginTop: 60 }}
              source={require('./AddProfilePicture.png')}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.textIn}
            placeholder={this.state.placeHolderOrganization}
            onChangeText={(veriCode) => this.setState({ veriCode })}
            value={this.state.veriCode}
          />
          <TextInput
            style={styles.textIn}
            placeholder={this.state.placeHolderUsername}
            onChangeText={(veriCode) => this.setState({ veriCode })}
            value={this.state.veriCode}
          />

          <TouchableOpacity style={styles.touchButton} onPress={() => this.profilePush()}>
            <Text style={{ fontSize: 19, padding: 17 }}>{this.state.btnText}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dcdcdd'
  },
  textIn: {
    textAlign: 'center',
    borderColor: '#1985a1',
    borderWidth: .7,
    height: 60,
    borderRadius: 2,
    padding: 10,
    width: 290,
    fontSize: 17,
    marginTop: 10,

  },
  touchButton: {
    alignItems: 'center',
    backgroundColor: '#1985a1',
    width: 290,
    height: 65,
    marginTop: 30,
    marginBottom: 50,
    borderRadius: 2,
    opacity: 0.7,
  },
  profilePicSelection: {
    width: 175,
    height: 175,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#1985a1',
    marginBottom: 150,
  },
});

// Following code creates and enables the default page upon loading the app
const MainNavigator = createStackNavigator({
  Email: { screen: EmailVeri, navigationOptions: { headerShown: false } },
  Veri: { screen: VeriScreen, navigationOptions: { headerShown: false } },
  ProfileSetup: { screen: ProfileSetup, navigationOptions: { headerShown: false } },
});

const App = createAppContainer(MainNavigator);


export default App;