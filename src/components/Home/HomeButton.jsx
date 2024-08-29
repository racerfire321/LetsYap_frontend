
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/constants'; 
import { ThemeContext } from '../../contexts/theme/ThemeProvider'; 

const GroupButton = [
  { id: 1, icon: 'videocam-outline', title: 'Host', screen: 'Host' },
  { id: 2, icon: 'add', title: 'Join', screen: 'Join' },
  { id: 3, icon: 'calendar-outline', title: 'Calendar', screen: 'Calendar' },
  { id: 4, icon: 'earth', title: 'Explore' , screen: 'Explore'},
 
];

const HomeButton = () => {
  const navigation = useNavigation();
  const { isDarkTheme } = useContext(ThemeContext); 
  console.log(isDarkTheme)
  const currentColors = isDarkTheme ? Colors.dark : Colors.light;
return (
      <View style={styles.container}>
        {GroupButton.map((button) => (
          <View key={button.id} style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                button.title === 'Host' && styles.hostButton, 
              ]}
              onPress={() => {
                console.log('Join button pressed');
                navigation.navigate(button.screen);
              }}
            >
              <Ionicons name={button.icon} size={30} color={'#ffffff'} />
            </TouchableOpacity>
            <Text style={styles.text}>{button.title}</Text>
          </View>
        ))}
      </View>
    );
  };
  
  export default HomeButton;
  
  const styles = StyleSheet.create({
    container: {
      marginTop: 66,
      paddingBottom: 10,
      borderBottomColor: '#1f1f1f',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonContainer: {
      alignItems: 'center',
    },
    button: {
      width: 60,
      height: 60,
      borderRadius: 15,
      justifyContent: 'center',
      backgroundColor: '#1E3A8A',
      alignItems: 'center',
    },
    hostButton: {
      backgroundColor: '#FF6F61', 
    },
    text: {
      color: '#858585',
      fontSize: 12,
      fontWeight: '600',
      paddingTop: 10,
      textAlign: 'center',
    },
  });
  