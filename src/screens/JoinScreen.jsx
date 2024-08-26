import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import io from 'socket.io-client';
import { SOCKET_URL } from '../utils/config/config';

const socket = io(SOCKET_URL);

const JoinScreen = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isAudioOff, setIsAudioOff] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
 const navigation = useNavigation();
  

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
    <View style={styles.container}>
      <Text style={styles.title}>Join a Session</Text>

      <TextInput
        style={styles.input}
        placeholder="Room ID"
        value={roomId}
        onChangeText={setRoomId}
       
      />

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={username}
        onChangeText={setUsername}
      />

      <View style={styles.option}>
        <Text style={styles.optionText}>Don't Connect to Audio</Text>
        <Switch value={isAudioOff} onValueChange={setIsAudioOff} />
      </View>

      <View style={styles.option}>
        <Text style={styles.optionText}>Turn off My Video</Text>
        <Switch value={isVideoOff} onValueChange={setIsVideoOff} />
      </View>

      <TouchableOpacity style={styles.joinButton} onPress={handleJoinMeeting}>
        <Icon name="meeting-room" size={24} color="#fff" />
        <Text style={styles.joinButtonText}>Join Meeting</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
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
    color: '#fff',
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
    color: '#fff',
    fontSize: 16,
  },
  joinButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default JoinScreen;
