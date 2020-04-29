import {StyleSheet} from 'react-native';
import Constants from 'react-native';

// Styles for registration screens
global.stylesForReg = StyleSheet.create({
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

    sText: {
      textAlign: 'center',
      height: 60,
      padding: 10,
      width: 290,
      fontSize: 32,
      marginTop: 10,
    }
  });
  
  
  // Styles for convo screens
  global.stylesForConvos = StyleSheet.create({
    
    startConvoButton: {
      position: 'absolute',
      alignItems: 'center',
      backgroundColor: '#1985a1',
      width: 70,
      height: 70,
      bottom: 20,
      right: 20,
      borderRadius: 100,
  
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
      marginTop: 70,
      width: '100%',
      backgroundColor: "white",
      borderColor: '#46494c',
      borderWidth: .5,
    },
    contactsList: {
      backgroundColor: 'white',
      width: "100%",
      flex: 1,
    },
    addContact: {
      alignItems: 'center',
      backgroundColor: '#1985a1',
      width: "100%",
      height: 65,
      marginTop: 30,
      marginBottom: 70,
      borderRadius: 2,
      opacity: 0.7,
    }
  
  });