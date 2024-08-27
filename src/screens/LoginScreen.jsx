import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../contexts/auth/AuthProvider';
import CustomAlert from '../components/alert/CustomAlert'; 

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { login } = useContext(AuthContext);

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: '314244381974-m51hluj0a24jgiio7f7gj4vjbib6979j.apps.googleusercontent.com', // Replace with your actual web client ID
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      console.log('Signed in with Google!');
     
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    if (email === '' || password === '') {
      setAlertMessage('Please enter both email and password.');
      setAlertVisible(true);
      return;
    }
    try {
      const loginResponse = await login(email, password);
      if (loginResponse){ navigation.navigate('Home')}
      else { setAlertVisible(true);  setAlertMessage('Invalid email or password'); }
    } catch (error) {
      setAlertMessage('Incorrect email or password.');
      setAlertVisible(true);
    }
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/Bubbles.png')} style={styles.headerImage} />
      </View>
      <Image source={require('../assets/logo/logobg.png')} style={styles.logo} />
    

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="email-send" />}
        outlineColor="#1E3A8A"
        activeOutlineColor="#1E3A8A"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry={!passwordVisible}
        style={styles.input}
        left={<TextInput.Icon icon="shield-lock-open-outline" />}
        right={
          <TextInput.Icon
            icon={passwordVisible ? 'eye' : 'eye-off'}
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        }
        outlineColor="#1E3A8A"
        activeOutlineColor="#1E3A8A"
      />

      <Button mode="contained" icon="account-lock-open" onPress={handleLogin} style={styles.button}>
        Sign In
      </Button>

      <Text style={styles.orText}>OR</Text>

      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
      />

      <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text>

      <CustomAlert
        visible={alertVisible}
        title="Error"
        message={alertMessage}
        onConfirm={handleAlertConfirm}
      />
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
  logo: {
    marginTop: 60,
    width: 250,
    height: 140, 
    alignSelf: 'center',
    right:10,
    marginBottom:10,
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
    marginTop: 30,
    textAlign: 'center',
    color: '#ff6347',
    fontWeight:'bold',
  },
});

export default LoginScreen;
