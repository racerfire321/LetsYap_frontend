import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import YourImage from '../assets/Bubbles.png'; 

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={YourImage} style={styles.headerImage} />
      </View>
      <Text style={styles.title}>Sign In to Let's Yap</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon name="email" />}
        outlineColor="#1E3A8A" 
        activeOutlineColor="#1E3A8A"  
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        left={<TextInput.Icon name="lock" />}
        outlineColor="#1E3A8A"  // Navy Blue for the outline
        activeOutlineColor="#1E3A8A"  // Navy Blue when active
      />

      <Button mode="contained" onPress={() => {}} style={styles.button}>
        Sign In
      </Button>

      <Text style={styles.orText}>OR</Text>

      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => {}}
      />

      <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: -110,
    left: 130,
    zIndex: 1,
  },
  headerImage: {
    width: 300, 
    height: 300, 
  },
  title: {
    marginTop:50,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1E3A8A', 
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#1E3A8A', 
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#1E3A8A', 
  },
  googleButton: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#FF6F61', 
  },
});

export default LoginScreen;
