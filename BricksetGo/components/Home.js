import React from 'react';
import 'react-native-gesture-handler';
import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      apiKey: '3-erab-QjV7-Kvhvh',
      hash: this.props.hash,
      status: '',
      loading: true,
      setsOwned: 0,
      response: [],
    };
    this.getOwned = this.getOwned.bind(this);
    this.getWanted = this.getWanted.bind(this);
  }

  getOwned = () => {
    let params =
      'apiKey=' +
      this.state.apiKey +
      '&userHash=' +
      this.state.hash +
      '&params={owned:1}';
    fetch('https://brickset.com/api/v3.asmx/getSets?' + params, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          setsOwned: response.matches,
          loading: false,
        });
      })
      .catch(function(e) {
        console.log('Fetch Failed' + e.message);
      });
  };

  getWanted = () => {
    let params =
      'apiKey=' +
      this.state.apiKey +
      '&userHash=' +
      this.state.hash +
      '&params={wanted:1}';
    fetch('https://brickset.com/api/v3.asmx/getSets?' + params, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          setsWanted: response.matches,
        });
      })
      .catch(function(e) {
        console.log('Fetch Failed' + e.message);
      });
  };
  render() {
    return (
      <>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <View style={styles.box}>
              <Image style={styles.logo} source={require('./logo.png')} />
            </View>
            <Text style={styles.sectionTitle}>
              Welcome, {this.state.username}
            </Text>
            <Text style={styles.sectionDescription}>
              What would you like to do today?
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8}
              onPress={() => {
                this.props.navigation.navigate('Search');
              }}>
              <Text style={styles.submitButtonText}> Search Sets </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8} onPress={() => {
                this.props.navigation.navigate('Browse');
              }}
              ><Text style={styles.submitButtonText}> Browse </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} activeOpacity={0.8}>
              <Text style={styles.submitButtonText}>Manage Collection</Text>
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
    fontSize: 36,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 0,
    marginBottom: 15,
  },
  sectionDescription: {
    marginTop: 20,
    fontSize: 24,
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
    fontSize: 22,
    fontWeight: '400',
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 30,
    height: 100,
    width: 100,
  },
});
