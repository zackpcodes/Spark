import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { Divider } from 'react-native-elements';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import Constants from 'expo-constants';

import './Globals'

// Generic function for generating unique ID's
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// The Conversation component represents an individual conversation,
// allowing the user to send a receieve messages.
export default class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: global.curConversation.messages,
      title: 'Convo Title'
    };
  }

  componentDidMount() {

    global.beforeCheckingNotifications = this.state.messages;

    this.setState({
      title: curConversation.name
    })

    
    // refresh is a function which checks for new messages from the server.
    this.refresh = setInterval(() => {
      fetch('http://spark.pemery.co/chat/get/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cuuid: global.curConversation.cuuid
        }),
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          if (responseJson.status == 200) {
            this.setState({ messages: [] });

            for (let i = 0; i < responseJson.content.messages.length; ++i) {

              this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, {
                  _id: uuidv4(),
                  text: responseJson.content.messages[i].content,
                  createdAt: responseJson.content.messages[i].message_sent,
                  user: {
                    _id: responseJson.content.messages[i].sender,
                  }
                }),
              }));

            }

          }


        })
        .catch((error) => {
          console.log(error)
          Alert.alert('Error', 'Promise rejection error')
        });

    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.refresh);
  }


  // onSend formats and sends a messsage to the server and also adds
  // the message to the current conversation.
  onSend(messages = []) {

    
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

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
        if (responseJson.status == 200) {
          // console.log(messages[0])
        } else {
          console.log("Send message failed");
        }

      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'A connection error has occurred!')
      });

  }

  // Navigating back to the main conversation screen.
  backToConvos = () => {
    curConversation.messages = this.state.messages
    this.props.navigation.navigate('Convos')
  }

  // This is the individual bubbles containing the messages.
  // Returns a updated bubble render to make them consistent
  // with our style.
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            padding: 3,
            backgroundColor: '#1985a1'
          },
          left: {
            padding: 3,
            backgroundColor: '#c5c3c6'
          },
        }}
      />
    )
  }

  render() {
    return (
      <View style={{ flex: 1, }}>
        <View style={{ alignItems: 'center', padding: 5, justifyContent: 'space-between', flexDirection: 'row', marginTop: Constants.statusBarHeight, }}>
          <TouchableOpacity onPress={this.backToConvos} style={{ alignContent: 'center', marginLeft: 10, }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#1985a1' }}>&lt;</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1985a1', marginLeft: 0 }}>{this.state.title}</Text>

          <TouchableOpacity onPress={null} style={{ alignContent: 'center' }}>
            <Image
              style={{ width: 40, height: 40, }}
              source={require('./SettingsBtn.png')}
            />
          </TouchableOpacity>

        </View>

        <Divider style={{ backgroundColor: 'black' }} />

        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderAvatar={null}
          user={{
          _id: global.curUserUUID,
          }}
          renderBubble={this.renderBubble}
        />


      </View>

    );
  }
}