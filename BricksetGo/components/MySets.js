import React from 'react';
import 'react-native-gesture-handler';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Modal,
  TouchableHighlight,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import Item from './Item.js';

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
      sortOption: 'Number',
      modalVisible: false,
    };
    this.query = this.query.bind(this);
    this.processQuery = this.processQuery.bind(this);
    this.setItem = this.setItem.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  setModalVisible = () => {
    this.setState({modalVisible: !this.state.modalVisible});
  };

  setItem = item => {
    this.props.setItem(item);
    this.props.navigation.navigate('Set');
  };

  processQuery = () => {
    this.setState({
      data: this.state.response.sets,
    });
  };

  query = (option) => {
    let params = '';
    if (this.props.mode == true) {
      params =
        'apiKey=' +
        this.state.apiKey +
        '&userHash=' +
        this.state.hash +
        '&params={owned:1,pageSize:500,orderBy:"' + option+ '"}';
    } else {
      params =
        'apiKey=' +
        this.state.apiKey +
        '&userHash=' +
        this.state.hash +
        '&params={owned:1,pageSize:500,orderBy:"' + option+ '"}';
    }
    console.log(params)
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

  componentDidMount() {
    this.query(this.state.sortOption);
  }

  render() {
    const options = [
      'Number',
      'YearFrom',
      'Pieces',
      'Minifigs',
      'Rating',
      'Theme',
      'Subtheme',
      'Name',
      'Random',
    ];
    return (
      <>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {this.props.mode == true ? 'Sets You Own' : 'Sets You Want'}
            </Text>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}>
              <View style={styles.modalView}>
              <Text style={styles.selectionText}>Sort Options</Text>
                <View style={styles.selection}>
            
                  <Picker
                    itemStyle={{color: 'black', fontSize: 16}}
                    selectedValue={this.state.sortOption}
                    onValueChange={(itemValue, itemIndex) => {
                      this.setState({sortOption: itemValue});
                      this.query(itemValue);
                    }}>
                    {options.map((o, i) => {
                      return <Picker.Item key={i} label={o} value={o} />;
                    })}
                  </Picker>
                  </View>
                <TouchableHighlight
                  style={{...styles.openButton, backgroundColor: '#2196F3'}}
                  onPress={this.setModalVisible}>
                  <Text style={styles.textStyle}>Hide Options</Text>
                </TouchableHighlight>
              </View>
            </Modal>
            <TouchableHighlight
              style={styles.openButton}
              onPress={this.setModalVisible}>
              <Text style={styles.textStyle}>Display Options</Text>
            </TouchableHighlight>

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
    height: '80%',
    paddingHorizontal: 24,
    flex: 1,
    flexDirection: 'column',
  },
  list: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 20,
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
  selection: {
    width: '100%',
  },
  selectionText: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
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
  modalView: {
    margin: 20,
    marginTop: 70,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
