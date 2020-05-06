import React from 'react';
import 'react-native-gesture-handler';
import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';

export default class Collection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      apiKey: '3-erab-QjV7-Kvhvh',
      hash: this.props.hash,
      loading: false,
      query: '',
      response: [],
      owned: [],
      wanted: [],
      minifigs: [],
      ownedCount: 0,
      wantedCount: 0,
      minifigCount: 0,
    };
    this.getOwned = this.getOwned.bind(this);
    this.getWanted = this.getWanted.bind(this);
    this.getMinifigs = this.getMinifigs.bind(this);
    this.setMode = this.setMode.bind(this);
  }

  setMode = mode => {
    this.props.setMode(mode);
    this.props.navigation.navigate('MySets');
  };

  getMinifigs = () => {
    let params =
      'apiKey=' +
      this.state.apiKey +
      '&userHash=' +
      this.state.hash +
      '&params={owned:1}';
    fetch('https://brickset.com/api/v3.asmx/getMinifigCollection?' + params, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          minifigCount: response.matches,
          minifigs: response.minifigs,
        });
      })
      .catch(function(e) {
        console.log('Fetch Failed' + e.message);
      });
  };

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
          ownedCount: response.matches,
          owned: response.sets,
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
          wantedCount: response.matches,
          wanted: response.sets,
        });
      })
      .catch(function(e) {
        console.log('Fetch Failed' + e.message);
      });
  };

  componentDidMount() {
    this.getOwned();
    this.getWanted();
    this.getMinifigs();
  }

  render() {
    return (
      <>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <View style={styles.box}>
              <Image style={styles.logo} source={require('./logo.png')} />
            </View>
            <Text style={styles.sectionTitle}>Collection Overview</Text>
            <Text style={styles.sectionDescription}>
              {this.state.ownedCount} Sets
            </Text>
            <Text style={styles.sectionDescription}>
              {this.state.wantedCount} Wanted
            </Text>
            <Text style={styles.sectionDescription}>
              {this.state.minifigCount} Minifigs
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8}
              onPress={() => this.setMode(true)}>
              <Text style={styles.submitButtonText}> View Sets You Own </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8}
              onPress={() => this.setMode(false)}>
              <Text style={styles.submitButtonText}> View Sets You Want </Text>
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
    marginTop: 40,
    height: '80%',
    paddingHorizontal: 24,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 36,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 0,
    marginBottom: 15,
  },
  sectionDescription: {
    fontSize: 24,
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
    marginBottom: 0,
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
