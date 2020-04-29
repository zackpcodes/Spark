import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modalbox';
import { ListItem, Divider } from 'react-native-elements';

import './styles';
import './Globals'


export default class ConvosFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CONVOS: global.conversations,
      CONTACTS: [],
      contactsOrigin: global.contacts,
      search: '',
    };
  }


  componentDidMount() {
    fetch('http://spark.pemery.co/chat/active/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 200) {
          return responseJson.content.chats;
        } else {
          Alert.alert('Error', responseJson.content.comment);
          this.props.navigation.replace('Email');
        }
      }).then((chats) => {

        let promises = [];
        for (let i = 0; i < chats.length; ++i) {
          promises.push(fetch('http://spark.pemery.co/chat/members/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cuuid: chats[i],
            }),
          }).then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.status == 200) {
                return responseJson
              } else {
                Alert.alert('Error', responseJson.content.comment)
                this.props.navigation.replace('Email')
              }
            })
            .catch((error) => {
              console.log(error)
              Alert.alert('Error', 'Promise rejection error')
            }));
        }

        Promise.all(promises).then(response => {
          let promises2 = []
          for (let i = 0; i < response.length; ++i) {
            promises2.push(fetch('http://spark.pemery.co/account/search/', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                uuid: response[i].content.members[1],
              }),
            }).then((response) => response.json())
              .then((responseJson) => {
                if (responseJson.status == 200) {

                  this.state.CONVOS.push({ cuuid: response[i].content.cuuid, uuid: response[i].content.members[1], name: responseJson.content.name, email_phone: responseJson.content.email_phone, messages: [] });
                  this.setState(this.state);

                } else {
                  Alert.alert('Error', responseJson.content.comment)
                  this.props.navigation.replace('Email')
                }
              })
              .catch((error) => {
                console.log(error)
                Alert.alert('Error', 'Promise rejection error')
              }));
          }


        }).catch(error => console.log('Error in promises2'));

      })
      .catch((error) => {
        console.log(error)
        Alert.alert('Error', 'Promise rejection error')
      });

  }


  updateSearch = text => {
    const searchData = this.state.contactsOrigin.filter(item => {
      const itemData = item.email_phone.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({ CONTACTS: searchData });
  };



  openContacts = () => {
    this.updateSearch('')
    fetch('http://spark.pemery.co/account/modify', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        //contacts: this.state.contactsOrigin,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status == 202) {
          this.state.contactsOrigin = JSON.parse(responseJson.content.contacts);
          this.setState(this.state);
          this.refs.modal2.open()
        } else {
          Alert.alert('Error', responseJson.content.comment)
          this.props.navigation.replace('Email')
        }
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('Error', 'Promise rejection error')
      });

  };


  startConvo = item => {

    fetch('http://spark.pemery.co/chat/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseJson1) => {
        if (responseJson1.status == 200) {
          return responseJson1.content.cuuid;
        } else {
          Alert.alert('Error', responseJson1.content.comment)
          this.props.navigation.replace('Email')
        }
      }).then((nCuuid) => {
        fetch('http://spark.pemery.co/chat/addMember', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cuuid: nCuuid,
            uuid: item.uuid,
          }),
        }).then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson)
            if (responseJson.status == 200) {
              fetch('http://spark.pemery.co/account/search/', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  uuid: responseJson.content.uuid,
                }),
              }).then((response) => response.json())
                .then((responseJson2) => {
                  if (responseJson2.status == 200) {

                    this.state.CONVOS.push({ cuuid: responseJson.content.cuuid, uuid: responseJson.content.uuid, name: responseJson2.content.name, email_phone: item.email_phone, messages: [] });
                    this.setState(this.state);
                    this.refs.modal2.close();

                  } else {
                    Alert.alert('Error', responseJson.content.comment)
                    this.props.navigation.replace('Email')
                  }
                })
                .catch((error) => {
                  console.log(error)
                  Alert.alert('Error', 'Promise rejection error')
                });

            } else {
              Alert.alert('Error', responseJson.content.comment)
              this.props.navigation.replace('Email')
            }
          })
          .catch((error) => {
            console.log(error)
            Alert.alert('Error', 'Promise rejection error')
          });
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('Error', 'Promise rejection error')
      });

  };


  openChat = item => {
    global.curConversation = item

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
            if (responseJson.content.messages[i].cuuid == item.cuuid) {
              item.messages.push({
                content: responseJson.content.messages[i].content,
                timestamp: responseJson.content.messages[i].message_sent,
                sender: responseJson.content.messages[i].sender,
              });
            }
          }
          global.curConversation = item
          this.props.navigation.navigate('IndividualConvo')
        } else {
          Alert.alert('Error', responseJson.content.comment)
          this.props.navigation.replace('Email')
        }
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('Error', 'Promise rejection error')
      });


  };


  render() {
    return (

      <SafeAreaView>
        <Modal style={[stylesForConvos.modal, stylesForConvos.modal2]} backdrop={false} position={"top"} ref={"modal2"}>
          <View>
            <Text style={{ padding: 20, fontSize: 20, }}>New Conversation</Text>
          </View>
          <View style={{ width: '100%', }}>
            <TextInput
              style={{ height: 50, borderColor: 'gray', borderWidth: .2, textAlign: "center", fontSize: 15, borderRadius: 10, }}
              onChangeText={text => this.updateSearch(text)}
              placeholder='Find Contact...'
            />
          </View>
          <View style={stylesForConvos.contactsList}>
            <FlatList
              data={this.state.contactsOrigin}
              renderItem={({ item }) => (
                <ListItem
                  roundAvatar
                  title={item.name}
                  leftAvatar={{ source: { uri: 'https://placeimg.com/140/140/any' } }}
                  onPress={() => { this.startConvo(item) }}
                  bottomDivider
                />
              )}
              keyExtractor={item => item.uuid}
            />
          </View>
        </Modal>


        <View style={stylesForConvos.convoScreen}>
          <View style={{ alignItems: 'center', padding: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProfileUpdate')} >
              <Image source={{ uri: global.userProfilepic }} style={stylesForConvos.profileMenuButton} />
            </TouchableOpacity>

            <Image
              style={{ width: 40, height: 40, }}
              source={require('./MainLogo.png')}
            />

            <TouchableOpacity onPress={() => this.props.navigation.navigate('Settings')} style={{ alignContent: 'center' }}>
              <Image
                style={{ width: 40, height: 40, }}
                source={require('./SettingsBtn.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={stylesForConvos.convoList}>
            <FlatList
              data={this.state.CONVOS}
              renderItem={({ item }) => (
                <View>
                  <ListItem
                    roundAvatar
                    title={item.name}
                    leftAvatar={{ source: { uri: 'https://placeimg.com/140/140/any' } }}
                    containerStyle={{ borderBottomWidth: 0 }}
                    onPress={() => { this.openChat(item) }}
                    chevron
                    bottomDivider
                  />
                  <Divider style={{ backgroundColor: 'black' }} />
                </View>
              )}
              keyExtractor={item => item.cuuid}
            />
          </View>
          <View style={stylesForConvos.startConvoButton}>
            <TouchableOpacity onPress={this.openContacts}>
              <Text style={{ fontSize: 35, paddingTop: 7, }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}