import React, { useContext } from 'react';
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
import CallScreen from '../screens/CallScreen';
import { ThemeContext } from '../contexts/theme/ThemeProvider'; 
import { Colors } from '../constants/constants'; 
import ExploreScreen from '../screens/ExploreScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const HomeStack = () => {
  const { isDarkTheme } = useContext(ThemeContext);
  const currentColors = isDarkTheme ? Colors.dark : Colors.light;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: currentColors.background },
        headerTintColor: currentColors.buttonText,
      }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Host" component={HostScreen} options={{
    title: 'Host',
    headerStyle: {
      backgroundColor: '#1E3A8A', 
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold', 
    },
  }}/>
      <Stack.Screen name="Join" component={JoinScreen} options={{
    title: 'Join',
    headerStyle: {
      backgroundColor: '#1E3A8A', 
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold', 
    },
  }}/>
      <Stack.Screen
        name="Call"
        component={CallScreen}
        options={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Explore" component={ExploreScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export const AuthStack = () => {
  const { isDarkTheme } = useContext(ThemeContext);
  const currentColors = isDarkTheme ? Colors.dark : Colors.light;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: currentColors.primary },
        headerTintColor: currentColors.buttonText,
      }}
      initialRouteName="FrontPage"
    >
      <Stack.Screen name="FrontPage" component={MainScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export const AppNavigator = () => {
  const { isDarkTheme } = useContext(ThemeContext);
  const currentColors = isDarkTheme ? Colors.dark : Colors.light;

  return (
   
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeMain') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            backgroundColor: currentColors.background,
          },
          tabBarActiveTintColor: currentColors.primary,
          tabBarInactiveTintColor: currentColors.navText,
        })}
      >
        <Tab.Screen name="HomeMain" component={HomeStack} options={{ headerShown: false }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
   
  );
};

export default AppNavigator;

