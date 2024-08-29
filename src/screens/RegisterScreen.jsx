import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../contexts/auth/AuthProvider';
import moment from 'moment';
import CustomAlert from '../components/alert/CustomAlert'; 

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const { register } = useContext(AuthContext);

  const validateDateOfBirth = (dateString) => {
    const dob = moment(dateString, 'YYYY-MM-DD', true);
    return dob.isValid() && dob.isBefore(moment().subtract(18, 'years'));
  };

  const handleRegister = async () => {
    // Basic validation
    if (!firstName || !lastName || !dob || !email || !password || !confirmPassword) {
      setAlertTitle('Validation Error');
      setAlertMessage('All fields are required!');
      setAlertVisible(true);
      return;
    }

    if (!validateDateOfBirth(dob)) {
      setAlertTitle('Validation Error');
      setAlertMessage('You must be at least 18 years old!');
      setAlertVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertTitle('Validation Error');
      setAlertMessage('Passwords do not match!');
      setAlertVisible(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlertTitle('Validation Error');
      setAlertMessage('Invalid email address!');
      setAlertVisible(true);
      return;
    }

    try {
      await register(firstName, lastName, dob, email, password);
      console.log('User registered successfully!');
      navigation.navigate('Login'); // Navigate to another screen or perform other actions
    } catch (error) {
      console.error('Registration error:', error);
      setAlertTitle('Registration Error');
      setAlertMessage('An error occurred during registration.');
      setAlertVisible(true);
    }
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

  const handleAlertCancel = () => {
    setAlertVisible(false);
  };

  return (
    <View style={styles.container}>
     <View style={styles.header}>
      
      <View style={styles.textGroup}>
      <Text style={styles.title}>Join Let's Yap !</Text>
      <Text style={styles.subtitle}>To connect with yappers</Text>
      </View>
      <Image source={require('../assets/logo/logobg.png')} style={styles.logo} />
        </View>
      <View style={styles.nameContainer}>
        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          mode="outlined"
          style={[styles.input, styles.halfInput]}
          left={<TextInput.Icon icon="account-circle" />}
        />
        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          mode="outlined"
          style={[styles.input, styles.halfInput]}
          left={<TextInput.Icon icon="account-circle" />}
        />
      </View>

      <TextInput
        label="Date of Birth"
        value={dob}
        onChangeText={setDob}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="calendar-star" />}
        placeholder="YYYY-MM-DD"
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="email-fast" />}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        left={<TextInput.Icon icon="lock-open-plus" />}
        right={
          <TextInput.Icon
            name={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        left={<TextInput.Icon icon="shield-lock" />}
      />

      <Button mode="contained" icon="notebook-plus" onPress={handleRegister} style={styles.button}>
        Register
      </Button>

      <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
        Already have an account? Sign In
      </Text>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
        onCancel={handleAlertCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 5,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    marginLeft: 20,
    width: 150, 
    height: 110, 
    top: 5,
    alignSelf: 'center', 
   
  },
  textGroup:{
   flexDirection: 'column',
   top: 24,
   left: 21,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6347',
    
    
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center', 
    marginTop: 10,
  },
  header:{
    display: 'flex',
    flexDirection: 'row',
    right: 15,
    bottom: 9,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#1E3A8A',
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#ff6347',
    fontWeight: '500'
  },
});

export default RegisterScreen;
