import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Home/Header';
import SearchBar from '../components/Home/SearchBar';
import HomeButton from '../components/Home/HomeButton';
import UserList from '../components/Home/UserList';
import { ThemeContext } from '../contexts/theme/ThemeProvider'; 
import { Colors } from '../constants/constants';

const HomeScreen = () => {
  const { isDarkTheme } = useContext(ThemeContext);
  const currentColors = isDarkTheme ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <SafeAreaView style={styles.area}>
        <Header />
        <SearchBar />
        <HomeButton />
        <UserList />
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  area: {
    height: '100%',
  },
});
