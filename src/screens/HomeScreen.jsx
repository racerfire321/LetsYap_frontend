import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import HomeButton from '../components/HomeButton'
import UserList from '../components/UserList'

const HomeScreen = () => {
  return (
    <View style={styles.container}>
     <SafeAreaView  style={styles.area} >
      <Header/>
      <SearchBar/>
      <HomeButton/>
      <UserList/>
     </SafeAreaView>
     </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  area:{
    height: '100%',
  }
})