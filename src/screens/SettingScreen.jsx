import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../contexts/auth/AuthProvider';
import { ThemeContext } from '../contexts/theme/ThemeProvider';
import { NotificationContext } from '../contexts/notification/NotificationContext';
import { Colors } from '../constants/constants';

const SettingsScreen = () => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const { isNotificationsEnabled, setIsNotificationsEnabled } = useContext(NotificationContext);
  const [selectedLanguage, setSelectedLanguage] = useState('en');


  const [volume, setVolume] = useState(50);
  const { logout, user } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot(
          (doc) => {
            if (doc.exists) {
              const data = doc.data();
              setUserName(data.firstname || 'User');
              setUserEmail(data.email || 'user@example.com');
            }
          },
          (error) => {
            console.log('Error fetching user data: ', error);
          }
        );

      return () => unsubscribe();
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (user) {
      try {
        await firestore().collection('users').doc(user.uid).update({
          firstname: userName,
          email: userEmail,
        });
        Alert.alert('Success', 'Profile updated successfully!');
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile: ', error);
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    }
  };

  const currentColors = isDarkTheme ? Colors.dark : Colors.light;

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.title, { color: currentColors.text }]}>Settings</Text>
      <View style={styles.header}>
        <Image source={require('../assets/animation/setting.json')} style={styles.headerImage} />
      </View>

      {/* Profile Section */}
      <View style={[styles.profileContainer, { backgroundColor: currentColors.box }]}>
        <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.profileImage} />
        <View style={styles.profileDetails}>
          {isEditing ? (
            <>
              <TextInput
                style={[styles.profileNameInput, { color: currentColors.text }]}
                value={userName}
                onChangeText={setUserName}
                placeholder="Name"
                placeholderTextColor={currentColors.text}
              />
              <TextInput
                style={[styles.profileEmailInput, { color: currentColors.text }]}
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="Email"
                placeholderTextColor={currentColors.text}
                keyboardType="email-address"
              />
            </>
          ) : (
            <>
              <Text style={[styles.profileName, { color: currentColors.text }]}>{userName}</Text>
              <Text style={[styles.profileEmail, { color: currentColors.text }]}>{userEmail}</Text>
            </>
          )}
        </View>
        <TouchableOpacity
          style={styles.editProfileIcon}
          onPress={() => {
            if (isEditing) {
              handleSaveProfile();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <Ionicons name={isEditing ? "checkmark" : "pencil"} size={24} color={currentColors.text} />
        </TouchableOpacity>
      </View>

      {/* Theme Settings */}
      <View style={[styles.setting, { backgroundColor: currentColors.box }]}>
        <Text style={[styles.settingText, { color: currentColors.text }]}>Dark Theme</Text>
        <Switch
          trackColor={{ false: '#767577', true: currentColors.primary }}
          thumbColor={isDarkTheme ? currentColors.primary : '#f4f3f4'}
          onValueChange={toggleTheme}
          value={isDarkTheme}
        />
      </View>

      {/* Language Settings */}
      <View style={[styles.setting, { backgroundColor: currentColors.box }]}>
        <Text style={[styles.settingText, { color: currentColors.text }]}>Language</Text>
        <Picker
          selectedValue={selectedLanguage}
          style={[styles.picker, { color: currentColors.text }]}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Spanish" value="es" />
          <Picker.Item label="French" value="fr" />
        </Picker>
      </View>

      {/* Volume Settings */}
      <View style={[styles.setting, { backgroundColor: currentColors.box }]}>
        <Text style={[styles.settingText, { color: currentColors.text }]}>Volume</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={volume}
          onValueChange={(value) => setVolume(value)}
          minimumTrackTintColor={currentColors.primary}
          maximumTrackTintColor={currentColors.border}
          thumbTintColor={currentColors.primary}
        />
      </View>

      <View style={[styles.setting, { backgroundColor: currentColors.box }]}>
        <Text style={[styles.settingText, { color: currentColors.text }]}>Notifications</Text>
        <Switch
          trackColor={{ false: '#767577', true: currentColors.primary }}
          thumbColor={isNotificationsEnabled ? currentColors.primary : '#f4f3f4'}
          onValueChange={() => setIsNotificationsEnabled((prev) => !prev)}
          value={isNotificationsEnabled}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: currentColors.button }]} onPress={logout}>
        <Text style={[styles.logoutButtonText, { color: currentColors.buttonText }]}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: currentColors.footerText }]}>© 2024 YourApp. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
    elevation: 4,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileNameInput: {
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  profileEmail: {
    fontSize: 16,
  },
  profileEmailInput: {
    fontSize: 16,
    borderBottomWidth: 1,
  },
  editProfileIcon: {
    padding: 10,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 4,
  },
  settingText: {
    fontSize: 18,
  },
  picker: {
    width: 150,
    height: 50,
  },
  slider: {
    width: 150,
    height: 40,
  },
  logoutButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 0,
    alignItems: 'center',
    padding: 10,
  },
  footerText: {
    fontSize: 14,
  },
});
