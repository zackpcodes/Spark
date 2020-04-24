
global.gEmail = null
global.userProfilepic = null
global.contacts = []
global.conversations = []
global.curConversation = null



global.updateProfile = () => {
        fetch('http://104.196.33.197:80/account', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.state.email,
          }),
        }).then((response) => response.text())
          .then((responseJson) => {
            
          })
          .catch((error) => {
            console.error(error);
            Alert.alert('Error', 'A connection error has occurred!');
          });
}