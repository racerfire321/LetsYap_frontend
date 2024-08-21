import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';

// Onboarding data array
const onboardingData = [
  {
    backgroundColor: '#ffffff',
    title: 'Welcome to Let\'s Yap',
    subtitle: 'Your go-to platform for connecting with friends.',
    image: require('../assets/animation/Animation - 1724133527684.json'),
  },
  {
    backgroundColor: '#ffffff',
    title: 'Connect with Yappers',
    subtitle: 'Find and gossips with all the people across the area.',
    image: require('../assets/animation/Animation - 1724132817608.json'),
  },
  {
    backgroundColor: '#ffffff',
    title: 'Share your Screen',
    subtitle: 'Share your screen with people for easy collaboration and video sharing.',
    image: require('../assets/animation/animation 3.json'),
  },
];

const Skip = () => {
  return <View />;
};

const Next = () => {
  return <View />;
};

const Dots = ({ selected }) => {
  return (
    <View
      style={[
        styles.dot,
        {
          opacity: selected ? 1 : 0.5,
        },
      ]}
    />
  );
};

const OnboardingScreen = ({ navigation }) => {
  const onboardingRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < onboardingData.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    if (onboardingRef.current) {
      onboardingRef.current.goToPage(currentIndex, true);
    }
  }, [currentIndex]);

  const handleDone = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Let&apos;s Yap</Text>
      <Onboarding
        ref={onboardingRef}
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        bottomBarHighlight={false}
        DotComponent={Dots}
        onDone={handleDone}
        pages={onboardingData.map((item, index) => ({
          backgroundColor: item.backgroundColor,
          image: (
            <LottieView
              source={item.image}
              autoPlay
              loop
              style={index === 0 ? styles.firstAnimation : styles.otherAnimation} 
            />
          ),
          title: item.title,
          subtitle: item.subtitle,
        }))}
        containerStyles={styles.onboardingContainer}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>New to Let&apos;s Yap? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingTop: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A', 
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#1E3A8A', 
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#1E3A8A', 
    width: 260,
    height: 50,
    padding: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#1E3A8A', 
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  registerLink: {
    marginTop: 10,
    alignItems: 'center',
  },
  registerText: {
    color: '#FF6F61', 
    fontSize: 16,
    top: 15,
  },
  dot: {
    width: 8,
    height: 8,
    bottom: 15,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#FF6F61', 
  },
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    bottom: 28,
  },
  onboardingContainer: {
    bottom: 180,
    width: '100%',
    height: 30,
    backgroundColor: '#fff',
  },
  firstAnimation: {
    width: 300,
    height: 250,
    marginTop: 0, 
  },
  otherAnimation: {
    width: 280,  
    height: 200,
    marginTop: 20,
  },
});
