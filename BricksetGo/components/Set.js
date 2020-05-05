import React from 'react';
import 'react-native-gesture-handler';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Modal,
  Linking,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {showMessage} from 'react-native-flash-message';

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
      viewerVisibile: false,
      locationData: null,
      currencyData: null,
      localPrice: 0,
      currencySymbol: '',
    };
    this.query = this.query.bind(this);
    this.processQuery = this.processQuery.bind(this);
    this.setViewerVisibile = this.setViewerVisibile.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getCurrency = this.getCurrency.bind(this);
    this.calculateLocalPrice = this.calculateLocalPrice.bind(this);
    this.setCollection = this.setCollection.bind(this);
  }

  calculateLocalPrice = () => {
    const price =
      this.props.item.LEGOCom.US.retailPrice *
      this.state.currencyData.rates[this.state.locationData.currency];
    this.setState({
      localPrice: price.toFixed(2),
      currencySymbol: this.state.locationData.currency,
    });
  };

  getCurrency = () => {
    let currency = 'ZAR';
    if (this.state.locationData != null) {
      currency = this.state.locationData.currency;
    }
    fetch('http://api.openrates.io/latest?base=USD&symbols=' + currency)
      .then(response => response.json())
      .then(response => {
        this.setState({currencyData: response});
      })
      .catch(err => {
        console.log('Fetch Error', err.message);
      })
      .then(this.calculateLocalPrice);
  };

  getLocation = () => {
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(response => {
        this.setState({
          locationData: response,
        });
      })
      .catch(function(e) {
        console.log('Fetch Failed' + e.message);
      })
      .then(this.getCurrency);
  };

  setViewerVisibile = () => {
    this.setState({
      viewerVisibile: !this.state.viewerVisibile,
    });
  };

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
    if (this.state.hash != '') {
      this.query();
    }
    if (this.state.locationData == null) {
      this.getLocation();
    }
  }

  setCollection = action => {
    if (this.state.hash == '') {
      showMessage({
        message: 'Not Logged In!',
        type: 'default',
        backgroundColor: 'black', // background color
        color: 'white', // text color
        duration: 2000,
        icon: 'warning',
      });
    } else {
      let params =
        'apiKey=' +
        this.state.apiKey +
        '&userHash=' +
        this.state.hash +
        '&setID=' +
        this.props.item.setID;
      if (action == 'own') {
        if (this.state.owned == true) {
          params += '&params={own:0}';
        } else {
          params += '&params={qtyOwned:1}';
        }
      } else {
        if (this.state.wanted == true) {
          params += '&params={want:0}';
        } else {
          params += '&params={want:1}';
        }
      }
      fetch('https://brickset.com/api/v3.asmx/setCollection?' + params, {
        method: 'GET',
      }).then(this.query);
    }
  };

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
                  {this.state.currencySymbol}
                  {this.state.localPrice}
                </Text>
              </View>
            </View>
            <Text style={styles.sectionSubtitle}>Collections</Text>
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
            <View style={styles.row}>
              <View style={styles.ownedBox}>
                <Text style={styles.collection}>
                  {this.state.owned == true
                    ? 'I Own ' + this.state.qty + ' of This Set'
                    : "I Don't Own This Set"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.ownedButton}
                onPress={() => this.setCollection('own')}>
                <Text style={styles.collectionButtonText}>
                  {this.state.qty == 0 ? 'Own' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <View style={styles.wantedBox}>
                <Text style={styles.collection}>
                  {this.state.wanted == true
                    ? 'I Want This Set'
                    : "I Don't Want This Set"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.wantedButton}
                onPress={() => this.setCollection('want')}>
                <Text style={styles.collectionButtonText}>
                  {this.state.wanted == true ? 'Edit' : 'Want'}
                </Text>
              </TouchableOpacity>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.viewerVisibile}
              onPress={this.setViewerVisibile}>
              <ImageViewer
                useNativeDriver={false}
                onClick={this.setViewerVisibile}
                style={styles.viewer}
                imageUrls={images}
              />
            </Modal>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.setViewerVisibile}>
              <Text style={styles.submitButtonText}>Images</Text>
            </TouchableOpacity>
            <Text style={styles.sectionSubtitle}>Insights</Text>
            <View style={styles.row}>
              <View style={styles.reviewBox}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://brickset.com/reviews/set-' +
                        this.props.item.number +
                        '-1',
                    )
                  }>
                  <View style={styles.row}>
                    <Text style={styles.reviewText}>Reviews: </Text>
                    <Text style={styles.reviews}>
                      {this.props.item.reviewCount}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.reviewBox}>
                <View style={styles.row}>
                  <Text style={styles.reviewText}>Rating: </Text>
                  <Text style={styles.rating}>{this.props.item.rating}</Text>
                </View>
              </View>
            </View>
            <View style={styles.box}>
              <Image style={styles.logo} source={require('./logo.png')} />
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
  sectionSubtitle: {
    marginTop: 5,
    fontSize: 24,
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
  box: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modal: {
    height: 200,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  themeBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    padding: 10,
    marginBottom: 10,
    marginRight: 20,
    width: '60%',
  },
  subthemeBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    padding: 10,
    marginBottom: 10,
    marginRight: 20,
    width: '60%',
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
  reviewBox: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    padding: 10,
    marginRight: 38,
    marginBottom: 10,
    width: '45%',
  },
  ownedBox: {
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 20,
    marginBottom: 10,
    width: '60%',
  },
  wantedBox: {
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 20,
    marginBottom: 10,
    width: '60%',
  },
  priceBox: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '35%',
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
    fontSize: 18,
    color: 'black',
  },
  collections: {
    fontSize: 16,
    color: 'white',
  },
  collection: {
    fontSize: 16,
    color: 'white',
  },
  reviewText: {
    fontSize: 18,
    color: 'black',
  },
  reviews: {
    fontSize: 18,
    color: 'green',
    fontWeight: '700',
  },
  rating: {
    fontSize: 18,
    color: 'orange',
    fontWeight: '700',
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
  submitButton: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: 'white',
    height: 60,
    borderRadius: 99,
    lineHeight: 60,
    width: '100%',
  },
  ownedButton: {
    backgroundColor: 'green',
    borderRadius: 99,
    padding: 10,
    marginBottom: 10,
    width: '35%',
    height: 40,
  },
  wantedButton: {
    backgroundColor: 'orange',
    borderRadius: 99,
    padding: 10,
    marginBottom: 10,
    width: '35%',
    height: 40,
  },
  submitButtonText: {
    color: 'black',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 22,
    letterSpacing: 0,
  },
  collectionButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0,
  },
  logo: {
    marginTop: 30,
    height: 70,
    width: 70,
  },
});
