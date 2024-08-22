import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import HostScreen from '../screens/HostScreen';
import SettingsScreen from '../screens/SettingScreen';
import JoinScreen from '../screens/JoinScreen';
import CalendarScreen from '../screens/CalenderScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainScreen from '../screens/MainScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// HomeStack Navigator
const HomeStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
  >
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Host" component={HostScreen} />
    <Stack.Screen name="Join" component={JoinScreen} />
    <Stack.Screen
      name="Calendar"
      component={CalendarScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// AuthStack Navigator for Login, Register, and FrontPage
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#1c1c1c',
      },
      headerTintColor: '#fff',
    }}
    initialRouteName="FrontPage"
  >
    <Stack.Screen
      name="FrontPage"
      component={MainScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen}  options={{ headerShown: false }} />
  </Stack.Navigator>
);

// Main App Navigator with Tabs
const AppNavigator = ({ isLoggedIn }) => {
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarStyle: {
              backgroundColor: '#ffffff',
            },
            tabBarActiveTintColor: '#1E3A8A',
            tabBarInactiveTintColor: 'black',
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
