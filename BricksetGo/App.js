import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './components/Login.js';
import Home from './components/Home.js';
import Search from './components/Search.js';
import Set from './components/Set.js';
import Browse from './components/Browse.js';
import FlashMessage from "react-native-flash-message";
Stack = createStackNavigator();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      apiKey: '3-erab-QjV7-Kvhvh',
      hash: '',
      status: 'Empty',
      loading: false,
      data: [],
    };
    this.setUser = this.setUser.bind(this);
    this.setItem = this.setItem.bind(this);
  }

  setUser = (username, hash) => {
    this.setState({username: username, hash: hash});
  };

  setItem = (item) => {
    this.setState({data: item});
  };

  render() {
    return (
      <>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" options={{headerShown: false}}>
              {props => <Login {...props} setUser={this.setUser} />}
            </Stack.Screen>
            <Stack.Screen name="Home" options={{headerShown: false}}>
              {props => <Home {...props} username={this.state.username} hash={this.state.hash} />}
            </Stack.Screen>
            <Stack.Screen name="Search" options={{headerShown: false}}>
              {props => <Search {...props} setItem={this.setItem} username={this.state.username} hash={this.state.hash} />}
            </Stack.Screen>
            <Stack.Screen name="Set" options={{headerShown: false}}>
              {props => <Set {...props} item={this.state.data} username={this.state.username} hash={this.state.hash} />}
            </Stack.Screen>
            <Stack.Screen name="Browse" options={{headerShown: false}}>
              {props => <Browse {...props} setItem={this.setItem} username={this.state.username} hash={this.state.hash} />}
            </Stack.Screen>
          </Stack.Navigator>
          <FlashMessage ref="myLocalFlashMessage" />
        </NavigationContainer>
      </>
    );
  }
}
export default App;
