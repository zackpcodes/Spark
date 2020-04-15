import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Conversation from './Screens/Conversation';
import ConvosFeed from './Screens/ConvoFeed';
import EmailVeri from './Screens/EmailVeri';
import ProfileSetup from './Screens/ProfileSetup';
import VeriScreen from './Screens/VeriScreen';
import ProfileUpdate from './Screens/ProfileUpdate';
import Settings from './Screens/Settings';




// Creates pages within the navigator
const MainNavigator = createStackNavigator({
  Email: { screen: EmailVeri, navigationOptions: { headerShown: false } },
  Veri: { screen: VeriScreen, navigationOptions: { headerShown: false } },
  ProfileSetup: { screen: ProfileSetup, navigationOptions: { headerShown: false } },
  IndividualConvo: { screen: Conversation, navigationOptions: { headerShown: false }},
  Convos: { screen: ConvosFeed, navigationOptions: { headerShown: false } },
  ProfileUpdate: { screen: ProfileUpdate, navigationOptions: { headerShown: false } },
  Settings: { screen: Settings, navigationOptions: { headerShown: false }}
  
});

const App = createAppContainer(MainNavigator);

export default App;