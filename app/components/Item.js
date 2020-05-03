import React from 'react';
import 'react-native-gesture-handler';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

export default function Item(props) {
  return (
    <TouchableOpacity activeOpacity={0.5}>
      <View style={styles.item}>
        <View style={styles.row}>
          <Text style={styles.setID}>{props.item.number}</Text>
          <Text style={styles.year}>{props.item.year}</Text>
        </View>
        <Text style={styles.name}>{props.item.name}</Text>
        <Text style={styles.pieces}>
          {props.item.pieces != undefined ? props.item.pieces + ' Pieces' : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'white',
    height: 120,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 20,
    color: 'white',
  },
  setID: {
    fontSize: 24,
    width: '50%',
    fontWeight: '600',
    color: 'white',
  },
  year: {
    width: '50%',
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'right',
  },
  pieces: {
    fontSize: 16,
    color: 'white',
    textAlign: 'left',
  },
});
