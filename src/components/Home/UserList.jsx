import React, { useState, useEffect,useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
  TextInput,Button,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import FormModal from '../modal/FormModal'; 
import { Colors } from '../../constants/constants';
import { ThemeContext } from '../../contexts/theme/ThemeProvider';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [newUserFirstname, setNewUserFirstname] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserProfile, setNewUserProfile] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { isDarkTheme } = useContext(ThemeContext);
  const currentColors = isDarkTheme ? Colors.dark : Colors.light; 
 
  const currentUserId = auth().currentUser?.uid;

  useEffect(() => {
    if (!currentUserId) {
      console.error('No current user ID found');
      return;
    }

    const unsubscribeAllUsers = firestore()
      .collection('users')
      .onSnapshot((querySnapshot) => {
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          firstname: doc.data().firstname,
          email: doc.data().email,
          profileImage: doc.data().profileImage,
        }));
        setAllUsers(usersList); 
      });

    const unsubscribeCurrentUserFriends = firestore()
      .collection('userFriends')
      .doc(currentUserId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const friendsIds = doc.data().friends || [];
          const friendsList = allUsers.filter(user => friendsIds.includes(user.id));
          setUsers(friendsList);
        } else {
          setUsers([]);
        }
      });

    return () => {
      unsubscribeAllUsers();
      unsubscribeCurrentUserFriends();
    };
  }, [allUsers, currentUserId]);

  const sendEmail = (email) => {
    const url = `mailto:${email}`;
    Linking.openURL(url).catch((err) => console.error('Failed to open email client', err));
  };

  const handleAddUser = async () => {
    if (newUserFirstname === '' || newUserEmail === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Check if the user exists
      const userSnapshot = await firestore().collection('users').where('email', '==', newUserEmail).get();
      if (userSnapshot.empty) {
        Alert.alert('Error', 'User does not exist.');
        return;
      }

      const userDoc = userSnapshot.docs[0];
      const userId = userDoc.id;

    
      if (!currentUserId) {
        Alert.alert('Error', 'Failed to get current user ID.');
        return;
      }

      // Update the current user's friends list
      const currentUserFriendsRef = firestore().collection('userFriends').doc(currentUserId);
      await currentUserFriendsRef.set({
        friends: firestore.FieldValue.arrayUnion(userId),
      }, { merge: true });

     
      const userFriendsRef = firestore().collection('userFriends').doc(userId);
      await userFriendsRef.set({
        friends: firestore.FieldValue.arrayUnion(currentUserId),
      }, { merge: true });

      // Clear input and close modal
      setNewUserFirstname('');
      setNewUserEmail('');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add user as a friend.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Friends</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setModalVisible(true)}>
          <Icon name="add" size={21} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <Image
              source={{ uri: item.profileImage }}
              style={styles.userImage}
            />
            <Text style={[styles.userName, { color: currentColors.text }]}>{item.firstname}</Text>
            <TouchableOpacity onPress={() => sendEmail(item.email)}>
              <Icon name="mail-outline" size={24} color="#FF6F61" />
            </TouchableOpacity>
          </View>
        )}
      />
      <FormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Add New User"
      >
        <TextInput
         style={[styles.input, { color: currentColors.text, borderColor: currentColors.border }]}
          placeholder="First Name"
          placeholderTextColor='#999'
          value={newUserFirstname}
          onChangeText={setNewUserFirstname}
        />
        <TextInput
           style={[styles.input, { color: currentColors.text, borderColor: currentColors.border }]}
          placeholder="Email"
          placeholderTextColor='#999' 
          value={newUserEmail}
          onChangeText={setNewUserEmail}
        />
        <View style={styles.modalButtons}>
         
          <Button title="Cancel"  color={'#ff6347'}onPress={() => setModalVisible(false)} />
          <Button title="Add User" color={'#1E3A8A'} onPress={handleAddUser} />
        </View>
      </FormModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    color: '#FF6F61',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6F61',
    padding: 8,
    borderRadius: 50,
    bottom: 5,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    color:'#ff6347'
  },
});

export default UserList;
