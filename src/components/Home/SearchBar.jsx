import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <Ionicons name='search' size={20} color='#858585'/>
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
        marginTop: 10
    },
    searchText: {
        color: '#858585',
        paddingLeft: 10,
        fontSize: 16,
    },
})