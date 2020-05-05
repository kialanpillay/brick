import React from 'react';
import 'react-native-gesture-handler';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import Item from './Item.js';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      apiKey: '3-erab-QjV7-Kvhvh',
      hash: this.props.hash,
      status: '',
      themeResponse: [],
      subthemeResponse: [],
      yearResponse: [],
      response: [],
      themes: [],
      themeCount: 0,
      subthemes: [],
      subthemeCount: 0,
      years: [],
      themeSelection: '',
      themeIndex: 0,
      subthemeSelection: '',
      yearSelection: '',
      data: [],
    };

    this.getThemes = this.getThemes.bind(this);
    this.processThemes = this.processThemes.bind(this);
    this.getSubthemes = this.getSubthemes.bind(this);
    this.processSubthemes = this.processSubthemes.bind(this);
    this.setItem = this.setItem.bind(this);
    this.query = this.query.bind(this);
    this.processQuery = this.processQuery.bind(this);
  }

  setItem = item => {
    this.props.setItem(item);
    this.props.navigation.navigate('Set');
  };

  processQuery = () => {
    this.setState({
      data: this.state.response.sets,
    });
  };

  query = () => {
    params = '';
    if (this.state.subthemeSelection == '') {
      params =
        'apiKey=' +
        this.state.apiKey +
        '&userHash=' +
        this.state.hash +
        '&params={theme:"' +
        this.state.themeSelection +
        '"}';
    } else {
      params =
        'apiKey=' +
        this.state.apiKey +
        '&userHash=' +
        this.state.hash +
        '&params={theme:"' +
        this.state.themeSelection +
        '",subtheme:"' +
        this.state.subthemeSelection +
        '"}';
    }
    console.log(params);
    fetch('https://brickset.com/api/v3.asmx/getSets?' + params, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          response: response,
        });
      })
      .catch(function(e) {
        console.log('Fetch Failed' + e.message);
      })
      .then(this.processQuery);
  };

  processThemes = () => {
    const themeNames = this.state.themeResponse.themes.map(item => {
      return item.theme;
    });
    this.setState({
      themes: themeNames,
      themeCount: this.state.themeResponse.matches,
      themeSelection: themeNames[0],
    });
    this.getSubthemes(this.state.themeSelection);
  };

  getThemes = () => {
    let params = 'apiKey=' + this.state.apiKey;
    fetch('https://brickset.com/api/v3.asmx/getThemes?' + params, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          themeResponse: response,
        });
      })
      .catch(function(e) {
        console.log('Fetch Failed' + e.message);
      })
      .then(this.processThemes);
  };

  processSubthemes = () => {
    const subthemeNames = this.state.subthemeResponse.subthemes.map(item => {
      return item.subtheme;
    });
    this.setState({
      subthemes: subthemeNames,
      subthemeCount: this.state.subthemeResponse.matches,
    });
  };

  getSubthemes = theme => {
    let params = 'apiKey=' + this.state.apiKey + '&Theme=' + theme;
    fetch('https://brickset.com/api/v3.asmx/getSubthemes?' + params, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          subthemeResponse: response,
        });
      })
      .catch(function(e) {
        console.log('Fetch Failed' + e.message);
      })
      .then(this.processSubthemes);
  };

  componentDidMount() {
    if (this.state.themeCount == 0) {
      this.getThemes();
    }
    console.log(this.state.themeSelection);
  }

  render() {
    return (
      <>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Browse</Text>

            <View style={styles.row}>
              <View style={styles.selection}>
                <Text style={styles.selectionText}>Theme</Text>

                <Picker
                  itemStyle={{color: 'black', fontSize: 12}}
                  selectedValue={this.state.themeSelection}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({themeSelection: itemValue});
                    this.setState({subthemeSelection: ''})
                    this.getSubthemes(itemValue);
                  }}>
                  {this.state.themes.map((theme, i) => {
                    return <Picker.Item key={i} label={theme} value={theme} />;
                  })}
                </Picker>
              </View>
              <View style={styles.selection}>
                <Text style={styles.selectionText}>Subtheme</Text>
                <Picker
                  itemStyle={{color: 'black', fontSize: 12}}
                  selectedValue={this.state.subthemeSelection}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({subthemeSelection: itemValue})
                  }>
                  {this.state.subthemes.map((subtheme, i) => {
                    return (
                      <Picker.Item key={i} label={subtheme} value={subtheme} />
                    );
                  })}
                </Picker>
              </View>
            </View>
            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.8}
              onPress={this.query}>
              <Text style={styles.submitButtonText}> Browse </Text>
            </TouchableOpacity>
            <FlatList
              style={styles.list}
              keyExtractor={item => item.setID.toString()}
              data={this.state.data}
              renderItem={({item}) => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onLongPress={event => this.setItem(item)}>
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
    paddingHorizontal: 24,
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  list: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'column',
    marginBottom: 40,
  },
  selection: {
    height: 250,
    marginTop: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    padding: 10,
    width: '45%',
    marginRight: 35,
  },
  selectionText: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
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
});
