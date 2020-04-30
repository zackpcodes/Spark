import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image} from 'react-native';
import {Divider } from 'react-native-elements';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import Constants from 'expo-constants';

import './Globals'

export default class Conversation extends Component {
    constructor(props) {
      super(props);
      this.state = {
        messages: this.convertToGifted(),
        title: 'Convo Title'
      };
    }

    convertToGifted(messages = global.curConversation.messages) {
      unconverted = messages;
      converted = []
      converted.push({
        _id: 1,
          text: 'My message',
          createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
      })

      for (let i = 0; i < unconverted.length;i++) {
        converted.push(
          {
            _id: global.counter,
            text: unconverted[i].content,
            createdAt: unconverted[i].message_sent,
            user: {
              _id: unconverted[i].sender,
            },
          }
        );
        global.counter = global.counter + 1;
      }
      return converted;
    }

    componentDidMount() {
      global.beforeCheckingNotifications = this.messages;

      this.setState({
        title: curConversation.name
      })

      setInterval(function() {
        var returnedConversation = global.beforeCheckingNotifications;

        fetch('http://spark.pemery.co/notifications/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.status == 200) {
              for (let i = 0; i < responseJson.content.messages.length; ++i) {
                if (responseJson.content.messages[i].cuuid == returnedConversation.cuuid) {
                  returnedConversation.messages.push({
                    content: responseJson.content.messages[i].content,
                    timestamp: responseJson.content.messages[i].message_sent,
                    sender: responseJson.content.messages[i].sender,
                  });
                }
              }
            } 
            var newMessages = this.convertToGifted(returnedConversation);
            if (newMessages != this.state.messages) {
              this.setState({
                messages: newMessages
              });
            }

          })
          .catch((error) => {
            console.log(error)
            Alert.alert('Error', 'Promise rejection error')
          });
          }, 5000);
    }
  
    onSend(messages = []) {

      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }));

      // There needs to be a call here to post the new message to the server

      fetch('http://spark.pemery.co/chat/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message_type: 'text',
            content: messages[0].text,
            cuuid: global.curConversation.cuuid
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            if(responseJson.status == 200) {
              console.log("Sent successfully");
            } else {
              console.log("Send message failed");
            }

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

    renderBubble (props) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#1985a1'
            },
            left: {
              backgroundColor: '#c5c3c6'
            },
          }}
        />
      )
    }
  
    render() {
      return (
          <View style={{flex: 1,}}>
            <View style={{alignItems: 'center', padding: 0, justifyContent: 'space-between', flexDirection: 'row', marginTop: Constants.statusBarHeight,}}>
              <TouchableOpacity onPress={this.backToConvos} style={{alignContent: 'center', marginLeft: 10,}}>
                <Text style={{fontSize: 30, fontWeight: 'bold', color: '#1985a1'}}>&lt;</Text>
              </TouchableOpacity>
  
              <Text style={{fontSize: 20, fontWeight: 'bold', color: '#1985a1', marginLeft:0}}>{this.state.title}</Text>
  
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
              // user={{
              renderAvatar={null}
              // _id: 1,
              // }}
              renderBubble={this.renderBubble}
            />
  
          
          </View>
        
      );
    }
  }