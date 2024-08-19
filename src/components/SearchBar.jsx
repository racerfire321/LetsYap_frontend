import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-ionicons'

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <Icon name='search' size={20} color='#858585'></Icon>
      <Text style={styles.searchText}>Search</Text>
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        color: '#333333',
        paddingHorizontal:10,
        height: 40,
        alignItems:'center',
        borderRadius: 10,
    },
    searchText: {
        color: '#858585',
        paddingLeft: 10,
        fontSize: 20,
    },
})