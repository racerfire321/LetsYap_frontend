import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../contexts/auth/AuthProvider';
import { ThemeContext } from '../contexts/theme/ThemeProvider';
import { NotificationContext } from '../contexts/notification/NotificationContext';
import { Colors } from '../constants/constants';
import { VolumeManager } from 'react-native-volume-manager';

const useVolumeControl = () => {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const getInitialVolume = async () => {
      const { volume } = await VolumeManager.getVolume();
      setVolume(volume);
    };

    getInitialVolume();

    const volumeListener = VolumeManager.addVolumeListener((result) => {
      setVolume(result.volume);
    });

    return () => {
      volumeListener.remove();
    };
  }, []);

  const handleVolumeChange = async (value) => {
    await VolumeManager.setVolume(value);
    setVolume(value);
  };

  return { volume, handleVolumeChange };
};
const SettingsScreen = () => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const { isNotificationsEnabled, setIsNotificationsEnabled } = useContext(NotificationContext);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userProfile, setuserProfile] = useState('');
 

   const { volume, handleVolumeChange } = useVolumeControl();

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
              setuserProfile(data.profileImage || 'https://via.placeholder.com/100');
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
  const handleCall = () => {
    Linking.openURL('tel:9768432216');
  };

  const handleEmail = () => {
    const url = `mailto:${email}`;
    Linking.openURL(url).catch((err) => console.error('Failed to open email client', err));
    Linking.openURL('mailto:bitisha2005@gmail.com');
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
        <Image source={{ uri: userProfile }} style={styles.profileImage} />
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

     

      {/* Volume Settings */}
       <View style={[styles.setting, { backgroundColor: currentColors.box }]}>
<Text style={[styles.settingText, { color: currentColors.text }]}>Volume</Text>
<Slider
  style={styles.slider}
  minimumValue={0}
  maximumValue={1}
  value={volume}
  onValueChange={handleVolumeChange}
  minimumTrackTintColor={currentColors.primary}
  maximumTrackTintColor={currentColors.border}
  thumbTintColor={currentColors.primary}
/>
</View>
       {/* Notification */}   
           <View style={[styles.setting, { backgroundColor: currentColors.box }]}>
         <Text style={[styles.settingText, { color: currentColors.text }]}>Notifications</Text>
         <Switch
          trackColor={{ false: '#767577', true: currentColors.primary }}
          thumbColor={isNotificationsEnabled ? currentColors.primary : '#f4f3f4'}
          onValueChange={() => setIsNotificationsEnabled((prev) => !prev)}
          value={isNotificationsEnabled}
        />
      </View>
       
      {/* Contact Us Section */}
      <View style={[styles.contactContainer, { backgroundColor: currentColors.box }]}>
        <Text style={[styles.settingText, { color: currentColors.text }]}>Contact Us</Text>
        <View style={styles.contactIcons}>
          <TouchableOpacity onPress={handleCall} style={styles.contactIcon}>
            <Ionicons name="call" size={24} color={currentColors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEmail} style={styles.contactIcon}>
            <Ionicons name="mail" size={24} color={currentColors.primary} />
          </TouchableOpacity>
        </View>
      </View>


      {/* Logout Button */}
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: currentColors.button }]} onPress={logout}>
        <Text style={[styles.logoutButtonText, { color: currentColors.buttonText }]}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: currentColors.footerText }]}>© 2024 Let's Yap. All rights reserved.</Text>
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
  contactContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    padding: 15,
    borderRadius: 10,
    elevation: 4,

  },
  contactIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
   
  },
  contactIcon: {
    paddingHorizontal: 12,
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

