import React from 'react';
import 'react-native-gesture-handler';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  FlatList,
} from 'react-native';
import Item from './Item.js';
import {showMessage} from 'react-native-flash-message';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      apiKey: '3-erab-QjV7-Kvhvh',
      hash: this.props.hash,
      loading: false,
      query: '',
      response: [],
      data: [],
    };
    this.handleQuery = this.handleQuery.bind(this);
    this.query = this.query.bind(this);
    this.processQuery = this.processQuery.bind(this);
    this.setItem = this.setItem.bind(this);
  }

  setItem = item => {
    this.props.setItem(item);
    this.props.navigation.navigate('Set');
  };

  stringBuilder = text => {
    let tokens = text.split(' ');

    return tokens.join('+');
  };

  processQuery = () => {
    this.setState({
      data: this.state.response.sets,
    });
    if (this.state.data.length == 0) {
      showMessage({
        message: 'No Sets Found!',
        type: 'default',
        backgroundColor: 'black', // background color
        color: 'white', // text color
        duration: 2000,
        position: 'bottom',
        icon: 'info',
      });
    }
  };

  query = () => {
    let queryString = this.stringBuilder(this.state.query);
    let params =
      'apiKey=' +
      this.state.apiKey +
      '&userHash=' +
      this.state.hash +
      '&params={query:"' +
      queryString +
      '",pageSize:500}';
    fetch('https://brickset.com/api/v3.asmx/getSets?' + params, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          response: response,
          loading: false,
        });
      })
      .catch(function(e) {
        console.log('Fetch Failed' + e.message);
      })
      .then(this.processQuery);
  };

  handleQuery = text => {
    this.setState({query: text});
  };

  render() {
    return (
      <>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Set Search</Text>
            <TextInput
              style={styles.input}
              placeholder="Query"
              placeholderTextColor="white"
              autoCapitalize="none"
              returnKeyType="go"
              autoCorrect={false}
              onChangeText={this.handleQuery}
            />
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8}
              onPress={this.query}>
              <Text style={styles.submitButtonText}> Search </Text>
            </TouchableOpacity>
            <FlatList
              style={styles.list}
              keyExtractor={item => item.setID.toString()}
              data={this.state.data}
              renderItem={({item}) => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onLongPress={(event) => this.setItem(item)}>
                  <Item item={item} />
                </TouchableOpacity>
              )}
            />
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
  },
  list: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 40,
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
    marginBottom: 20,
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
});
