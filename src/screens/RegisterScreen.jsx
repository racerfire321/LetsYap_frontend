// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { TextInput, Button } from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const RegisterScreen = ({ navigation }) => {
//   const [firstName, setFirstName] = React.useState('');
//   const [lastName, setLastName] = React.useState('');
//   const [dob, setDob] = React.useState('');
//   const [email, setEmail] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const [confirmPassword, setConfirmPassword] = React.useState('');

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Register for App</Text>

//       <View style={styles.nameContainer}>

//         <TextInput
//           label="First Name"
//           value={firstName}
//           onChangeText={setFirstName}
//           mode="outlined"
//           style={[styles.input, styles.halfInput]}
//           left={<TextInput.Icon name="account" size={20} color={'#000'} />}
//         />
//         <TextInput
//           label="Last Name"
//           value={lastName}
//           onChangeText={setLastName}
//           mode="outlined"
//           style={[styles.input, styles.halfInput]}
//           left={<TextInput.Icon name="account" />}
//         />
//       </View>

//       <TextInput
//         label="Date of Birth"
//         value={dob}
//         onChangeText={setDob}
//         mode="outlined"
//         style={styles.input}
//         left={<TextInput.Icon name="calendar" />}
//         placeholder="YYYY-MM-DD"
//       />

//       <TextInput
//         label="Email"
//         value={email}
//         onChangeText={setEmail}
//         mode="outlined"
//         style={styles.input}
//         left={<TextInput.Icon name="email" />}
//       />
//       <TextInput
//         label="Password"
//         value={password}
//         onChangeText={setPassword}
//         mode="outlined"
//         secureTextEntry
//         style={styles.input}
//         left={<TextInput.Icon name="lock" />}
//       />
//       <TextInput
//         label="Confirm Password"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         mode="outlined"
//         secureTextEntry
//         style={styles.input}
//         left={<TextInput.Icon name="lock" />}
//       />

//       <Button mode="contained" onPress={() => {}} style={styles.button}>
//         Register
//       </Button>

//       <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
//         Already have an account? Sign In
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 30,
//     color: 'black'
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
    
//   },
//   halfInput: {
//     width: '48%',
//   },
//   input: {
//     marginBottom: 20,
//   },
//   button: {
//     marginVertical: 10,
//     backgroundColor: '#1E3A8A',
//   },
//   loginText: {
//     marginTop: 20,
//     textAlign: 'center',
//     color: '#FF6F61',
//   },
// });

// export default RegisterScreen;


import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        // Navigate to another screen or perform other actions
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }

        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register for App</Text>

      <View style={styles.nameContainer}>
        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          mode="outlined"
          style={[styles.input, styles.halfInput]}
          left={<TextInput.Icon name="account" size={20} color={'#000'} />}
        />
        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          mode="outlined"
          style={[styles.input, styles.halfInput]}
          left={<TextInput.Icon name="account" />}
        />
      </View>

      <TextInput
        label="Date of Birth"
        value={dob}
        onChangeText={setDob}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon name="calendar" />}
        placeholder="YYYY-MM-DD"
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon name="email" />}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        left={<TextInput.Icon name="lock" />}
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
        left={<TextInput.Icon name="lock" />}
      />

      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>

      <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
        Already have an account? Sign In
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
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
    color: '#FF6F61',
  },
});

export default RegisterScreen;
