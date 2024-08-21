import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-ionicons';
import React from 'react'

const Header = () => {
  return (
    <View  style={styles.container}>
       <Icon name="add" size={30} color="#efefef" />
      <Text style={styles.title}>Let's Yap</Text>
      <Icon name="chatboxes" size={30} color="#efefef" />
      
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container:{
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title:{
    fontSize:20,
    color: '#efefef'
  }
})