import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modalbox';
import { ListItem, Divider } from 'react-native-elements';

import './styles';
import './Globals'

// ConvosFeed allows the user to add conversations via their contacts modal
// this component also allows the user to add new contacts.
export default class ConvosFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CONVOS: global.conversations,
      CONTACTS: [],
      contactsOrigin: global.contacts,
      search: '',
      emailToSearch: '',
      emailSearchResult: null,
    };
  }

  // Loads all current conversations each time the component mounts.
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
                this.setState({ CONVOS: [] });
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
                  this.state.CONVOS.push({ cuuid: response[i].content.cuuid, uuid: response[i].content.members[1], name: responseJson.content.name, email_phone: responseJson.content.email_phone, messages: [], counter: 0 });
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

  // Sorts and searches contacts when a user searches for a contact
  // from the contact modal pop up.
  updateSearch = text => {
    /*const searchData = this.state.contactsOrigin.filter(item => {
      const itemData = item.email_phone.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({ CONTACTS: searchData });*/
  };


  // openContacts loads your contacts from the server and opens a model
  // where the user can select a contact to start a conversation with.
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

  // startConvo: When the user taps on a contact from the contact list this function is called.
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

                    this.state.CONVOS.push({ cuuid: responseJson.content.cuuid, uuid: responseJson.content.uuid, name: responseJson2.content.name, email_phone: item.email_phone, messages: [], counter: 0 });
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

  // openChat: sets opened chat to the current chat being viewed.
  openChat = item => {
    global.curConversation = item;
    this.props.navigation.navigate('IndividualConvo');
  };


  // addContact: searches for user information and adds this information
  // to contacts list.
  addContact = email => {
    fetch('http://spark.pemery.co/account/search/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_phone: email,
      }),
    }).then((response) => response.json())
      .then((responseJson1) => {
        if (responseJson1.status == 200) {

          fetch('http://spark.pemery.co/account/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }).then((response) => response.json())
            .then((responseJson2) => {
              if (responseJson2.status == 200) {
                var flag = false;

                if(responseJson2.content.contacts != null){
                  var contactsTemp = JSON.parse(responseJson2.content.contacts);
                  
                  for (let i = 0; i < contactsTemp.length; ++i) {
                    if (contactsTemp[i].uuid == responseJson1.uuid) {
                      flag = true;
                    }
                  }
                }
                
                if (!flag) {
                  var contactsTemp = [];
                  contactsTemp.push({ email_phone: responseJson1.content.email_phone, uuid: responseJson1.content.uuid, picture_id: responseJson1.content.picture_id, name: responseJson1.content.name })

                  fetch('http://spark.pemery.co/account/modify/', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      contacts: contactsTemp,
                    }),
                  }).then((response) => response.json())
                    .then((responseJson3) => {
                      if (responseJson3.status == 202) {

                        Alert.alert('Success.', 'Contact successfully added!')
                        this.refs.model1.close();
                        this.refs.model2.open();
                      } else {
                        Alert.alert('Error', responseJson3.content.comment)
                      }
                    })
                    .catch((error) => {
                      console.log(error)
                      Alert.alert('Error', 'Promise rejection error')
                    });


                  }else{
                    Alert.alert('Failed.', 'Contact already exists')
                  }
                } else {
                  Alert.alert('Error', responseJson2.content.comment)
                  this.props.navigation.replace('Email')
                }
              
              })
            .catch((error) => {
              console.log(error)
              Alert.alert('Error', 'Promise rejection error')
            });

      } else {
        Alert.alert('Error', responseJson1.content.comment)
          this.props.navigation.replace('Email')
      }
      })
      .catch((error) => {
  console.log(error)
  Alert.alert('Error', 'Promise rejection error')
});



  }


render() {
  return (

    <SafeAreaView>
      <Modal style={[stylesForConvos.modal, stylesForConvos.modal2]} backdrop={false} position={"top"} ref={"modal1"}>
        <View>
          <Text style={{ padding: 20, fontSize: 20, }}>New Contact</Text>
        </View>
        <View style={{ width: '100%', }}>
          <TextInput
            style={{ height: 50, borderColor: 'gray', borderWidth: .2, textAlign: "center", fontSize: 15, borderRadius: 10, }}
            onChangeText={text => this.setState({ emailToSearch: text })}
            placeholder='Email to add...'
          />
          <TouchableOpacity style={stylesForConvos.addContact} onPress={() => this.addContact(this.state.emailToSearch)} >
            <Text style={{ fontSize: 19, padding: 17 }}>Add Contact</Text>
          </TouchableOpacity>
        </View>
      </Modal>


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
        <TouchableOpacity style={stylesForConvos.addContact} onPress={() => { this.refs.modal2.close(); this.refs.modal1.open() }} >
          <Text style={{ fontSize: 19, padding: 17 }}>Add Contact</Text>
        </TouchableOpacity>
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