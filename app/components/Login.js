import React from 'react';
import 'react-native-gesture-handler';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native';
import {showMessage, hideMessage} from 'react-native-flash-message';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      apiKey: '3-erab-QjV7-Kvhvh',
      hash: '',
      message: '',
      status: 'Empty',
      loading: false,
      response: [],
    };
    this.handlePassword = this.handlePassword.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.login = this.login.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  handleUsername = text => {
    this.setState({username: text});
  };

  handlePassword = text => {
    this.setState({password: text});
  };

  setUser = () => {
    this.props.setUser(this.state.username, this.state.hash);
    if (this.state.status != 'success') {
      showMessage({
        message: 'Invalid Login Credentials!',
        type: 'default',
        backgroundColor: 'black', // background color
        color: 'white', // text color
        duration: 2000,
        icon: 'warning'
      });
    } else {
      showMessage({
        message: 'Successfully entered the Matrix!',
        type: 'default',
        backgroundColor: 'green', // background color
        color: 'white', // text color
        duration: 2000,
        icon: 'success'
      });
      this.props.navigation.navigate('Home');
    }
  };

  componentDidMount() {
    this.setUser;
  }

  login = () => {
    if (this.state.username.length == 0 || this.state.password.length == 0) {
    } else {
      let params =
        'apiKey=' +
        this.state.apiKey +
        '&username=' +
        this.state.username +
        '&password=' +
        this.state.password;
      fetch('https://brickset.com/api/v3.asmx/login?' + params, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(json => this.setState({status: json.status, hash: json.hash}))
        .catch(function(e) {
          console.log('Fetch Failed' + e.message);
        })
        .then(this.setUser);
    }
  };

  render() {
    return (
      <>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>BRICKSET GO</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="white"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={this.handleUsername}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="white"
              autoCapitalize="none"
              returnKeyType="go"
              secureTextEntry={true}
              autoCorrect={false}
              onChangeText={this.handlePassword}
            />
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8}
              onPress={this.login}>
              <Text style={styles.submitButtonText}> LOG IN </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: 'rgb(9,144,215)',
    height: '100%',
  },
  sectionContainer: {
    height: '100%',
    paddingHorizontal: 24,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 48,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 15,
  },
  sectionDescription: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '400',
    height: 50,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    marginTop: 20,
    marginBottom: 15,
    height: 40,
    fontSize: 20,
    borderColor: 'white',
    borderBottomWidth: 2,
    color: 'white',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: 'white',
    height: 60,
    borderRadius: 99,
    lineHeight: 60,
    width: '100%',
  },
  submitButtonText: {
    color: 'black',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 2,
    fontWeight: '600',
  },
});
