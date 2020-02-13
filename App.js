import React, { Component } from 'react';
import { Text, View, stylesForRegheet, Button, Alert, TextInput, TouchableOpacity, Image, FLatList, StyleSheet} from 'react-native';
import Constants from 'expo-constants';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modalbox';

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

    // Make api call here to send user entered email to server

    if(this.validateEmail(this.state.email)){
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

// ProfileSetup: Allows the user to set up a profile then makes 
// a call to the server to push profile data.
class ProfileSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      organizationText: '',
      usernameText: '',
      placeHolderOrganization: 'Organization',
      placeHolderUsername: "Username",
      btnText: 'Done'
    };
  }

  profilePush = () => {
    // Make api call here to push profile data to server
    //this.props.navigation.navigate('Veri')
    this.props.navigation.navigate('Convos')
  }

  render() {
    let { image } = this.state;
    return (
      <KeyboardAvoidingView style={stylesForReg.container} behavior="padding" enabled>
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
      </KeyboardAvoidingView>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
    console.log('hi');
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
    }
  };
}



function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function ConvoCard({title}) {
  return(
    <TouchableOpacity style={stylesForConvos.convoCard}>
      <TouchableOpacity onPress={null}>
              <Image source={null} style={stylesForConvos.recipientProfileBtn} />
            </TouchableOpacity>
      <Text style={{ fontSize: 19, padding: 25 }}>{title}</Text>
    </TouchableOpacity>
  );
}

function ContactCard({title}) {
  return(
    <TouchableOpacity style={stylesForConvos.convoCard}>
      <TouchableOpacity onPress={null}>
              <Image source={null} style={stylesForConvos.recipientProfileBtn} />
      </TouchableOpacity>
      <Text style={{ fontSize: 19, width: '100%', padding: 25, }}>{title}</Text>
    </TouchableOpacity>
  );
}



class ConvosFeed extends Component {
  constructor(props) {
    super(props);
    this.convoArray = []

    this.state = {
      CONVOS: []
    };
  }



  startConvo = () => {
    this.refs.modal2.open()
    this.convoArray.push({id: uuidv4(), title: 'zack'})

    this.setState({ CONVOS: [...this.convoArray] })
  }

  
  render() {
    return (

      


      <SafeAreaView>
        <Modal style={[stylesForConvos.modal, stylesForConvos.modal2]} backdrop={false}  position={"top"} ref={"modal2"}>
          <View>
            <Text style={{fontSize: 25, padding: 10,}}>Contacts</Text>
          </View>
          <View style={stylesForConvos.contactsList}>
            <FlatList
              data = {this.state.CONVOS}
              renderItem={({item}) => <ContactCard title={item.title}/>}
              keyExtractor={item => item.id}
            />
          </View>
          <View style={{width: '100%',}}>
            <TouchableOpacity onPress={this.startConvo} style={{backgroundColor: '#1985a1', alignItems: 'center', borderBottomStartRadius: 15, borderBottomEndRadius: 15,}}>
              <Text style={{ fontSize: 18, padding: 17,}}>SPARK</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        
        <View style={stylesForConvos.convoScreen}>
          <View style={{alignItems: 'center', padding: 10, justifyContent: 'space-between', flexDirection: 'row'}}>
            <TouchableOpacity onPress={null}>
              <Image source={null} style={stylesForConvos.profileMenuButton} />
            </TouchableOpacity>
              
              <Image
            style={{ width: 40, height: 40, }}
            source={require('./MainLogo.png')}
            />
           
            <TouchableOpacity onPress={null} style={{alignContent: 'center'}}>
              <Image
              style={{ width: 40, height: 40, }}
              source={require('./SettingsBtn.png')}
            />
            </TouchableOpacity>
          </View>
          <View style={stylesForConvos.convoList}>
            <FlatList
              data = {this.state.CONVOS}
              renderItem={({item}) => <ConvoCard title={item.title}/>}
              keyExtractor={item => item.id}
            
            />
          </View>
          <View style={stylesForConvos.startConvoButton}>
            <TouchableOpacity onPress={this.startConvo}>
              <Text style={{ fontSize: 18, padding: 17 }}>SPARK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}



// Styles for registration screens
const stylesForReg = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    alignItems: 'center',
    backgroundColor: '#dcdcdd',
    justifyContent: 'center'
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
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#1985a1',
    marginBottom: 160,
  },
});

// Styles for convo screens
const stylesForConvos = StyleSheet.create({
  convoCard: {
    backgroundColor: 'white',
    borderBottomColor: '#46494c',
    borderBottomWidth: .3,
    flexDirection: 'row',
  },
  startConvoButton: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: '#1985a1',
    width: '25%',
    height: 65,
    opacity: 0.7,
    bottom: 20,
    right: 20,
    borderRadius: 100,
    elevation: 1,
    alignSelf: 'flex-end'
  },
  convoList: {
    backgroundColor: 'white',
    height:'100%',
    justifyContent: 'space-around',
    flex: 1,
  },
  convoScreen: {
    height: "100%",
   
  },
  profileMenuButton: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#1985a1',
    left: 5,
  },
  recipientProfileBtn: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#46494c',
    margin: 20,
    marginRight: 5,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal2: {
    marginTop: 80,
    height: '67%',
    width: '90%',
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: '#46494c',
    borderWidth: .5,
  },
  contactsList: {
    backgroundColor: 'white',
    flex: 1,
  },

});

// Creates pages within the navigator
const MainNavigator = createStackNavigator({
  Email: { screen: EmailVeri, navigationOptions: { headerShown: false } },
  Veri: { screen: VeriScreen, navigationOptions: { headerShown: false } },
  ProfileSetup: { screen: ProfileSetup, navigationOptions: { headerShown: false } },
  Convos: { screen: ConvosFeed, navigationOptions: { headerShown: false } },
  
});

const App = createAppContainer(MainNavigator);

export default App;