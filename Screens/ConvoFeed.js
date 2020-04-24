import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modalbox';
import { ListItem, Divider } from 'react-native-elements';

import './styles';

import './Globals'



function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default class ConvosFeed extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        CONVOS: conversations,
        CONTACTS: [],
        contactsOrigin: [],
        search: '',
      };
    }

    profileUp = () => {
      this.props.navigation.navigate('ProfileUpdate')
    }

    settings = () => {
      this.props.navigation.navigate('Settings')
    }

  
    updateSearch = text => {
      const searchData = this.state.contactsOrigin.filter(item => {      
        const itemData = item.title.toUpperCase();
        const textData = text.toUpperCase();  
        return itemData.indexOf(textData) > -1;    
      });
      
      this.setState({ CONTACTS: searchData });  
    };
  
  
    openContacts = () => {
      this.updateSearch('')
        this.state.contactsOrigin.push({contactId: uuidv4(), title: 'zack'})
        this.state.contactsOrigin.push({contactId: uuidv4(), title: 'corwin'})
        this.state.contactsOrigin.push({contactId: uuidv4(), title: 'brad'})
        this.state.contactsOrigin.push({contactId: uuidv4(), title: 'connor'})
        this.state.contactsOrigin.push({contactId: uuidv4(), title: 'von'})
        this.state.contactsOrigin.push({contactId: uuidv4(), title: 'patrick'})


          fetch('http://spark.pemery.co/account/modify', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contacts: this.state.contactsOrigin,
            }),
          }).then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson);
              if (responseJson.status == 200){
                this.state.contactsOrigin = responseJson.content.contacts;
                this.setState({CONTACTS: this.state.contactsOrigin});
              
              }else{
                Alert.alert('Error', 'Please login!')
              }
              
            })
            .catch((error) => {
              console.error(error);
              Alert.alert('Error', 'A connection error has occurred!')
            });

      this.refs.modal2.open()
    };
  
    startConvo = title => {
      fetch('http://spark.pemery.co/chat/create', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }).then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson);
              if (responseJson.status == 200){
                this.state.contactsOrigin = responseJson.content.contacts;
                this.setState({CONTACTS: this.state.contactsOrigin});
              
              }else{
                Alert.alert('Error', 'Please login!')
              }
              
            })
            .catch((error) => {
              console.error(error);
              Alert.alert('Error', 'A connection error has occurred!')
            });

      this.setState(this.state)
      this.refs.modal2.close()
    };
  
    openChat = item => {
      curConversation = item
      this.props.navigation.navigate('IndividualConvo')
      console.log(item.convoId)
    };
  

  
    
    render() {
      return (
  
        <SafeAreaView>
          <Modal style={[stylesForConvos.modal, stylesForConvos.modal2]} backdrop={false}  position={"top"} ref={"modal2"}>
            <View>
              <Text style={{padding: 20, fontSize: 20,}}>New Conversation</Text>
            </View>
            <View style={{width: '100%',}}>
              <TextInput
                style={{ height: 50, borderColor: 'gray', borderWidth: .2, textAlign: "center", fontSize: 15, borderRadius: 10, }}
                onChangeText={text => this.updateSearch(text)}
                placeholder='Find Contact...'
              />
            </View>
            <View style={stylesForConvos.contactsList}>
              <FlatList
                data = {this.state.CONTACTS}
                renderItem={({item}) => (
                  <ListItem              
                    roundAvatar              
                    title={item.title}  
                    subtitle={"Email@gmail.com"}                           
                    leftAvatar={{source: {uri: 'https://placeimg.com/140/140/any'}}}
                    onPress={() => {this.startConvo(item.title)}}
                    bottomDivider
                    />
                )}
                keyExtractor={item => item.contactId}
              />
            </View>
          </Modal>
          
  
          <View style={stylesForConvos.convoScreen}>
            <View style={{alignItems: 'center', padding: 10, justifyContent: 'space-between', flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => this.profileUp()} >
                <Image source={{uri: userProfilepic}} style={stylesForConvos.profileMenuButton} />
              </TouchableOpacity>
                
                <Image
                  style={{ width: 40, height: 40, }}
                  source={require('./MainLogo.png')}
                />
             
              <TouchableOpacity onPress={() => this.settings()} style={{alignContent: 'center'}}>
                <Image
                  style={{ width: 40, height: 40, }}
                  source={require('./SettingsBtn.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={stylesForConvos.convoList}>
            <FlatList
                data = {this.state.CONVOS}
                renderItem={({item}) => (
                  <View>
                  <ListItem              
                    roundAvatar              
                    title={item.title}  
                    subtitle={"Email@gmail.com"}                           
                    leftAvatar={{source: {uri: 'https://placeimg.com/140/140/any'}}}
                    containerStyle={{ borderBottomWidth: 0 }} 
                    onPress={() => {this.openChat(item)}}
                    chevron
                    bottomDivider 
                    />
                    <Divider style={{backgroundColor: 'black'}}/>
                    </View>
                )}
                keyExtractor={item => item.convoId}
              />
            </View>
            <View style={stylesForConvos.startConvoButton}>
              <TouchableOpacity onPress={this.openContacts}>
                <Text style={{ fontSize: 35, paddingTop: 7,}}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
    }
  }