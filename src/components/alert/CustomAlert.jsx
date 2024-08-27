// components/CustomSliderAlert.js
import React from 'react';
import { Modal, View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native'; // Import LottieView

const CustomAlert = ({ visible, title, message, onConfirm, onCancel }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
        <LottieView 
              source={require('../../assets/animation/alert.json')} 
              autoPlay
              loop
              style={styles.animation}
              speed={2}
            />
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Caution!</Text>
          </View>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onConfirm}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  alertContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    bottom: 40,
  },
  animation: {
    width: 80,
    height: 80,
    bottom:30,
    right: 90,
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6F61'
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    bottom: 30,
  },
  button: {
    justifyContent: 'center',
    alignItems:'center',
    height: 40,
    borderRadius: 90,
    width: 200,
    backgroundColor: '#1E3A8A',
    bottom: 20,
    
  },
  buttonText:{
    color:'#fff',
    fontSize: 16,
  }
});

export default CustomAlert;
