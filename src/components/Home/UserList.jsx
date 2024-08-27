import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Linking, TextInput, Alert, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; 

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [newUserFirstname, setNewUserFirstname] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Get the current user's ID from Firebase Authentication
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
        }));
        setAllUsers(usersList); // Store all users
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

      // Ensure current user ID is defined
      if (!currentUserId) {
        Alert.alert('Error', 'Failed to get current user ID.');
        return;
      }

      // Update the current user's friends list
      const currentUserFriendsRef = firestore().collection('userFriends').doc(currentUserId);
      await currentUserFriendsRef.set({
        friends: firestore.FieldValue.arrayUnion(userId),
      }, { merge: true });

      // Update the new friend's friends list
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
              source={require('../../assets/user/bits.jpg')}
              style={styles.userImage}
            />
            <Text style={styles.userName}>{item.firstname}</Text>
            <TouchableOpacity onPress={() => sendEmail(item.email)}>
              <Icon name="mail-outline" size={24} color="#FF6F61" />
            </TouchableOpacity>
          </View>
        )}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={newUserFirstname}
              onChangeText={setNewUserFirstname}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newUserEmail}
              onChangeText={setNewUserEmail}
            />
            <View style={styles.modalButtons}>
              <Button title="Add User" onPress={handleAddUser} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
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
    bottom: 10,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
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
  },
});

export default UserList;
