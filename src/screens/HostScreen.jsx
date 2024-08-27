import React, { useContext, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import io from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import { SOCKET_URL } from '../utils/config/config';
import { ThemeContext } from '../contexts/theme/ThemeProvider';
import { Colors } from '../constants/constants'; 

const socket = io(SOCKET_URL);

const HostScreen = () => {
  const [username, setUsername] = useState('');
  const [isAudioOff, setIsAudioOff] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const navigation = useNavigation();
  const { isDarkTheme } = useContext(ThemeContext);
  const currentColors = isDarkTheme ? Colors.dark : Colors.light; 

  const handleStartMeeting = () => {
    if (username.trim() !== '') {
      console.log(isVideoOff);
      // Emit the create-room event with the username
      socket.emit('create-room', username);
      socket.once('room-created', ({ roomId }) => {
        console.log('Received roomId from server:', roomId);
        socket.emit('join-room', { roomId, username });
        navigation.navigate('Call', { roomId, username, isAudioOff, isVideoOff });
      });
    } else {
      alert('Please enter a username');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.title, { color: currentColors.primary }]}>Host a Session</Text>

      <TextInput
        style={[styles.input, { backgroundColor: currentColors.box, color: currentColors.text }]}
        placeholder="Enter username"
        placeholderTextColor={currentColors.text}
        value={username}
        onChangeText={setUsername}
      />

      <View style={styles.option}>
        <Text style={[styles.optionText, { color: currentColors.text }]}>Mute on Entry</Text>
        <Switch value={isAudioOff} onValueChange={setIsAudioOff} />
      </View>

      <View style={styles.option}>
        <Text style={[styles.optionText, { color: currentColors.text }]}>Turn off My Video</Text>
        <Switch value={isVideoOff} onValueChange={setIsVideoOff} />
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleStartMeeting}>
        <Icon name="videocam" size={24} color="#fff" />
         <Text style={styles.startButtonText}>Start Session</Text>
       </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 29,
  },
  input: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 29,
    fontSize: 16,
    elevation: 5,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionText: {
    fontSize: 16,
  },
  startButton: {
        flexDirection: 'row',
        backgroundColor: Colors.light.primary,
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
      },
      startButtonText: {
        color: Colors.dark.text,
        fontSize: 18,
        marginLeft: 10,
      },
});

export default HostScreen;
