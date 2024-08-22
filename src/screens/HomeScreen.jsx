import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Home/Header'
import SearchBar from '../components/Home/SearchBar'
import HomeButton from '../components/Home/HomeButton'
import UserList from '../components/Home/UserList'

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
    backgroundColor: '#fff',
    padding: 15,
  },
  area:{
    height: '100%',
  }
})