import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image} from 'react-native';
import {Divider } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import Constants from 'expo-constants';

import './Globals'

export default class Conversation extends Component {
    state = {
      messages: curConversation.messages,
      title: 'Convo Title'
    }

    componentDidMount() {
      this.setState({
        title: curConversation.title
        
      })

      fetch('http://192.168.0.10:4567', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            state: 'messages',
            messages: curConversation.messages
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            
            //this.state.messages = responseJson.messages

          })
          .catch((error) => {
            console.error(error);
            Alert.alert('Error', 'A connection error has occurred!')
          });
    }
  
    onSend(messages = []) {
      this.setState(previousState => ({

        messages: GiftedChat.append(previousState.messages, messages),
      }))

      fetch('http://192.168.0.10:4567', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({

            state: 'messages',
            messages: curConversation.messages
          }),
        }).then((response) => response.json())
          .then((responseJson) => {

            this.setState((previousState) => {
              return {
                messages: GiftedChat.append(previousState.messages, {
                  _id: Math.round(Math.random() * 1000000),
                  text: responseJson.testmessage,
                  createdAt: new Date(),
                  user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                  },
                }),
              };
            });
            //this.state.messages = responseJson.messages

          })
          .catch((error) => {
            console.error(error);
            Alert.alert('Error', 'A connection error has occurred!')
          });
          
    }
  
    backToConvos = () =>{
      curConversation.messages = this.state.messages
      this.props.navigation.navigate('Convos')
      
    }
  
    render() {
      return (
          <View style={{flex: 1,}}>
            <View style={{alignItems: 'center', padding: 10, justifyContent: 'space-between', flexDirection: 'row', marginTop: Constants.statusBarHeight,}}>
              <TouchableOpacity onPress={this.backToConvos} style={{alignContent: 'center', marginLeft: 10,}}>
                <Text style={{fontSize: 30, fontWeight: 'bold', color: '#1985a1'}}>&lt;</Text>
              </TouchableOpacity>
  
              <Text style={{fontSize: 20, fontWeight: 'bold', color: '#1985a1', marginLeft:13}}>{this.state.title}</Text>
  
              <TouchableOpacity onPress={null} style={{alignContent: 'center'}}>
                <Image
                  style={{ width: 40, height: 40, }}
                  source={require('./SettingsBtn.png')}
                />
              </TouchableOpacity>
              
            </View>
  
            <Divider style={{backgroundColor: 'black'}}/>
            
            <GiftedChat
              messages={this.state.messages}
              onSend={messages => this.onSend(messages)}
              user={{
              _id: 1,
              }}
            />
  
          
          </View>
        
      );
    }
  }