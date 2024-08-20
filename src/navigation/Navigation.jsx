import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import HostScreen from '../screens/HostScreen';
import SettingsScreen from '../screens/SettingScreen';
import JoinScreen from '../screens/JoinScreen';
import CalendarScreen from '../screens/CalenderScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#1c1c1c',
    },
    headerTintColor: '#fff', 
  }} initialRouteName={Home}>
    <Stack.Screen name="Home" component={HomeScreen}  options={{ headerShown: false }} />
    <Stack.Screen name="Host" component={HostScreen} />
    <Stack.Screen name="Join" component={JoinScreen} />
    <Stack.Screen name="Calender" component={CalendarScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            backgroundColor: '#1c1c1c', 
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#ccc', 
        })}
      >
        <Tab.Screen name="Home" component={HomeStack}  options={{ headerShown: false }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
