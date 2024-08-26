import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SOCKET_URL } from '../utils/config/config';

const socket = io(SOCKET_URL);

const HostScreen = () => {
  const [username, setUsername] = useState('');
  const [isAudioOff, setIsAudioOff] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const navigation = useNavigation()
;

  
const handleStartMeeting = () => {
  if (username.trim() !== '') {
    console.log(isVideoOff)
    // Emit the create-room event with the username
    socket.emit('create-room', username);
    socket.once('room-created', ({ roomId }) => {
        console.log('Received roomId from server:', roomId);
        socket.emit('join-room', { roomId, username });
        navigation.navigate('Call', { roomId, username ,isAudioOff,isVideoOff });
    });

  } else {
    alert('Please enter a username');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Host a Session</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />

      <View style={styles.option}>
        <Text style={styles.optionText}>Mute on Entry</Text>
        <Switch value={isAudioOff} onValueChange={setIsAudioOff} />
      </View>

      <View style={styles.option}>
        <Text style={styles.optionText}>Turn off My Video</Text>
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
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '##1E3A8A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionText: {
    color: '#1E3A8A',
    fontSize: 16,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  startButtonText: {
    color: '#1E3A8A',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default HostScreen;
