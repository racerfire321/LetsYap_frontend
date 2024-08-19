import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const JoinScreen = () => {
  const [meetingID, setMeetingID] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isAudioOff, setIsAudioOff] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const handleJoinMeeting = () => {
    // Logic to join the meeting
    console.log('Joining Meeting with ID:', meetingID, 'as', displayName);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join a Session</Text>

      <TextInput
        style={styles.input}
        placeholder="Meeting ID"
        value={meetingID}
        onChangeText={setMeetingID}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <View style={styles.option}>
        <Text style={styles.optionText}>Don't Connect to Audio</Text>
        <Switch value={isAudioOff} onValueChange={setIsAudioOff} />
      </View>

      <View style={styles.option}>
        <Text style={styles.optionText}>Turn Off My Video</Text>
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
