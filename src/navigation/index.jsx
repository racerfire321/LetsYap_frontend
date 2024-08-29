import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../contexts/auth/AuthProvider';
import { AuthStack, AppNavigator } from './Navigation';
import SplashScreen from '../screens/SplashScreen'; 

const Routes = () => {
  const { user, setUser } = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    // Hide splash screen after 1 second or when authentication state changes
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1700); 

    return () => {
      clearTimeout(timer);
      subscriber(); 
    };
  }, []);

  if (!authChecked) return null;

  if (initializing || showSplash) return <SplashScreen />;

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;


