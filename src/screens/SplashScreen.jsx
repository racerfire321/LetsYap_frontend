import React from 'react';
import { View, StyleSheet,Text } from 'react-native';
import LottieView from 'lottie-react-native'; // Import LottieView

const SplashScreen = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>Let's Yap!</Text>
      <LottieView
        source={require('../assets/animation/splashscreen.json')} 
        autoPlay
        loop={true} 
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f5fd',
  },
  text:{
    fontSize: 32,
    fontWeight:'bold',
    color:'#1E3A8A'
  },
  lottie: {
    width: 250, 
    height: 250,
  },
});

export default SplashScreen;
