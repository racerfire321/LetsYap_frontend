import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HostScreen = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [meetingID, setMeetingID] = useState('');

  const handleStartMeeting = () => {
    // Logic to start the meeting
    console.log('Meeting Started with ID:', meetingID);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Host a Session</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Meeting ID"
        value={meetingID}
        onChangeText={setMeetingID}
      />

      <View style={styles.option}>
        <Text style={styles.optionText}>Mute on Entry</Text>
        <Switch value={isMuted} onValueChange={setIsMuted} />
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
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default HostScreen;
