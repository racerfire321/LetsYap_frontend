import React, { useContext, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { SOCKET_URL } from '../utils/config/config';
import { ThemeContext } from '../contexts/theme/ThemeProvider'; 
import { Colors } from '../constants/constants';
const socket = io(SOCKET_URL);

const JoinScreen = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isAudioOff, setIsAudioOff] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const navigation = useNavigation();
  const { isDarkTheme } = useContext(ThemeContext);
  const currentColors = isDarkTheme ? Colors.dark : Colors.light; 

  const handleJoinMeeting = () => {
    if (username.trim() !== '' && roomId.trim() !== '') {
      console.log('Joining room...');
      
      socket.emit('join-room', { roomId, username }, (response) => {
        console.log('Server response:', response);
        
        if (response.success) {
          navigation.navigate('Call', { roomId, username, isAudioOff, isVideoOff });
        } else {
          alert('Room not found!');
        }
      });
    } else {
      alert('Please enter a username and room ID');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.title, { color: currentColors.primary }]}>Join a Session</Text>

      <TextInput
        style={[styles.input, { backgroundColor: currentColors.box, color: currentColors.text }]}
        placeholder="Room ID"
        placeholderTextColor={currentColors.text}
        value={roomId}
        onChangeText={setRoomId}
      />

      <TextInput
        style={[styles.input, { backgroundColor: currentColors.box, color: currentColors.text }]}
        placeholder="Your Name"
        placeholderTextColor={currentColors.text}
        value={username}
        onChangeText={setUsername}
      />

      <View style={styles.option}>
        <Text style={[styles.optionText, { color: currentColors.text }]}>Don't Connect to Audio</Text>
        <Switch value={isAudioOff} onValueChange={setIsAudioOff} />
      </View>

      

      <TouchableOpacity
        style={[styles.joinButton]}
        onPress={handleJoinMeeting}
      >
        <Icon name="meeting-room" size={24} color={currentColors.buttonText} />
        <Text style={[styles.joinButtonText, { color: currentColors.buttonText }]}>Join Meeting</Text>
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
    marginBottom: 24,
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
  joinButton: {
        flexDirection: 'row',
        backgroundColor: Colors.light.primary,
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        elevation: 6
      },
      joinButtonText: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 10,
      },
});

export default JoinScreen;
