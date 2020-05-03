import React from 'react';
import 'react-native-gesture-handler';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Modal,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      apiKey: '3-erab-QjV7-Kvhvh',
      hash: this.props.hash,
      image: false,
      owned: false,
      qty: 0,
      wanted: false,
      response: [],
      loading: false,
    };
    this.query = this.query.bind(this);
    this.processQuery = this.processQuery.bind(this);
  }

  processQuery = () => {
    this.setState({
      owned: this.state.response.sets[0].collection.owned,
      wanted: this.state.response.sets[0].collection.wanted,
      qty: this.state.response.sets[0].collection.qtyOwned,
    });
  };

  query = () => {
    let params =
      'apiKey=' +
      this.state.apiKey +
      '&userHash=' +
      this.state.hash +
      '&params={setID:' +
      this.props.item.setID +
      '}';
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

  handleQuery = text => {
    this.setState({query: text});
  };

  componentDidMount() {
    console.log(this.props.item);
    if (this.state.hash != '') {
      this.query();
    }
  }

  render() {
    const images = [{url: this.props.item.image.imageURL}];
    return (
      <>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Set Details</Text>
            <View style={styles.item}>
              <View style={styles.row}>
                <Text style={styles.setID}>{this.props.item.number}</Text>
                <Text style={styles.year}>{this.props.item.year}</Text>
              </View>
              <Text style={styles.name}>{this.props.item.name}</Text>
              <View style={styles.row}>
                <Text style={styles.pieces}>
                  {this.props.item.pieces != undefined
                    ? this.props.item.pieces + ' Pieces'
                    : ''}
                </Text>
                <Text style={styles.minifigs}>
                  {this.props.item.minifigs}
                  {this.props.item.minifigs == 1
                    ? ' Minifigure'
                    : ' Minifigures'}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.themeBox}>
                <Text style={styles.theme}>{this.props.item.theme}</Text>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.price}>
                  ${this.props.item.LEGOCom.US.retailPrice}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.subthemeBox}>
                <Text style={styles.subtheme}>{this.props.item.subtheme}</Text>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.price}>
                  ${this.props.item.LEGOCom.UK.retailPrice}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.collectionsBox}>
                <Text style={styles.collections}>
                  Owned By: {this.props.item.collections.ownedBy}
                </Text>
              </View>
              <View style={styles.collectionsBox}>
                <Text style={styles.collections}>
                  Wanted By: {this.props.item.collections.wantedBy}
                </Text>
              </View>
            </View>
            <View style={styles.ownedBox}>
              <Text style={styles.collections}>
                {this.state.owned == true
                  ? 'You Own ' + this.state.qty + ' of ' + this.props.item.number
                  : "You Don't Own " + + this.props.item.number}
              </Text>
            </View>
            <View style={styles.wantedBox}>
              <Text style={styles.collections}>
                {this.state.wanted == true
                  ? 'You Want ' + this.props.item.number
                  : "You Don't Want " + this.props.item.number}
              </Text>
            </View>
            <View style={styles.box}>
              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  style={styles.image}
                  resizeMethod="auto"
                  resizeMode="center"
                  source={{
                    uri: this.props.item.image.imageURL,
                  }}
                />
              </TouchableOpacity>
            </View>
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
  item: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    padding: 10,
    marginBottom: 10,
  },
  themeBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    padding: 10,
    marginBottom: 10,
    marginRight: 20,
    width: '65%',
  },
  subthemeBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    padding: 10,
    marginBottom: 10,
    marginRight: 20,
    width: '65%',
  },
  collectionsBox: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    padding: 10,
    marginRight: 38,
    marginBottom: 10,
    width: '45%',
  },
  ownedBox: {
    backgroundColor: 'green',
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    width: '80%',
  },
  wantedBox: {
    backgroundColor: 'orange',
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    width: '80%',
  },
  priceBox: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '30%',
  },
  theme: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
  },
  subtheme: {
    fontSize: 20,
    color: 'black',
  },
  price: {
    fontSize: 22,
    color: 'black',
  },
  collections: {
    fontSize: 16,
    color: 'white',
  },
  row: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 24,
    color: 'black',
  },
  setID: {
    fontSize: 24,
    width: '50%',
    fontWeight: '600',
    color: 'rgb(9,144,215)',
  },
  year: {
    width: '50%',
    fontSize: 24,
    fontWeight: '600',
    color: 'rgb(9,144,215)',
    textAlign: 'right',
  },
  pieces: {
    width: '50%',
    fontSize: 18,
    color: 'black',
    textAlign: 'left',
  },
  minifigs: {
    width: '50%',
    fontSize: 18,
    color: 'black',
    textAlign: 'right',
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modal: {
    height: 200,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: 360,
    height: 360,
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
    letterSpacing: 0,
  },
});
