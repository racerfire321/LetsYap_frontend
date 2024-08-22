import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons'; 


const SettingsScreen = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [volume, setVolume] = useState(50);

  const toggleThemeSwitch = () => setIsDarkTheme(previousState => !previousState);
  const toggleNotificationsSwitch = () => setIsNotificationsEnabled(previousState => !previousState);

  return (
    <ScrollView style={[styles.container, isDarkTheme && styles.darkContainer]}>
      <Text style={[styles.title, isDarkTheme && styles.darkTitle]}>Settings</Text>
      <View style={styles.header}>
        <Image source={require('../assets/animation/setting.json')} style={styles.headerImage} />
      </View>

      {/* Profile Section */}
      <View style={[styles.profileContainer, isDarkTheme && styles.darkProfileContainer]}>
        <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.profileImage} />
        <View style={styles.profileDetails}>
          <Text style={[styles.profileName, isDarkTheme && styles.darkProfileName]}>John Doe</Text>
          <Text style={[styles.profileEmail, isDarkTheme && styles.darkProfileEmail]}>john.doe@example.com</Text>
        </View>
        <TouchableOpacity style={styles.editProfileIcon}>
          <Ionicons name="pencil" size={24} color={isDarkTheme ? "#ffffff" : "#000000"} />
        </TouchableOpacity>
      </View>

      {/* Theme Settings */}
      <View style={[styles.setting, isDarkTheme && styles.darkSetting]}>
        <Text style={[styles.settingText, isDarkTheme && styles.darkSettingText]}>Dark Theme</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#00aaff' }}
          thumbColor={isDarkTheme ? '#00aaff' : '#f4f3f4'}
          onValueChange={toggleThemeSwitch}
          value={isDarkTheme}
        />
      </View>

      {/* Language Settings */}
      <View style={[styles.setting, isDarkTheme && styles.darkSetting]}>
        <Text style={[styles.settingText, isDarkTheme && styles.darkSettingText]}>Language</Text>
        <Picker
          selectedValue={selectedLanguage}
          style={[styles.picker, isDarkTheme && styles.darkPicker]}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Spanish" value="es" />
          <Picker.Item label="French" value="fr" />
        </Picker>
      </View>

      {/* Volume Settings (using Slider) */}
      <View style={[styles.setting, isDarkTheme && styles.darkSetting]}>
        <Text style={[styles.settingText, isDarkTheme && styles.darkSettingText]}>Volume</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          value={volume}
          onValueChange={(value) => setVolume(value)}
          minimumTrackTintColor={isDarkTheme ? "#00aaff" : "#1f1f1f"}
          maximumTrackTintColor="#000000"
          thumbTintColor={isDarkTheme ? "#00aaff" : "#f4f3f4"}
        />
      </View>

      {/* Notification Settings */}
      <View style={[styles.setting, isDarkTheme && styles.darkSetting]}>
        <Text style={[styles.settingText, isDarkTheme && styles.darkSettingText]}>Notifications</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#00aaff' }}
          thumbColor={isNotificationsEnabled ? '#00aaff' : '#f4f3f4'}
          onValueChange={toggleNotificationsSwitch}
          value={isNotificationsEnabled}
        />
      </View>

      {/* Privacy Policy */}
      {/* <TouchableOpacity style={[styles.button, isDarkTheme && styles.darkButton]}>
        <Text style={[styles.buttonText, isDarkTheme && styles.darkButtonText]}>Privacy Policy</Text>
      </TouchableOpacity> */}

      {/* Logout Button */}
      <TouchableOpacity style={[styles.logoutButton, isDarkTheme && styles.darkLogoutButton]}>
        <Text style={[styles.logoutButtonText, isDarkTheme && styles.darkLogoutButtonText]}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, isDarkTheme && styles.darkFooterText]}>© 2024 YourApp. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#1c1c1c',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  darkTitle: {
    color: '#ffffff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 10,
  },
  darkProfileContainer: {
    backgroundColor: '#333333',
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
    color: '#000000',
  },
  darkProfileName: {
    color: '#ffffff',
  },
  profileEmail: {
    fontSize: 16,
    color: '#666666',
  },
  darkProfileEmail: {
    color: '#cccccc',
  },
  editProfileIcon: {
    padding: 10,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 10,
  },
  darkSetting: {
    backgroundColor: '#333333',
  },
  settingText: {
    fontSize: 18,
    color: '#000000',
  },
  darkSettingText: {
    color: '#ffffff',
  },
  picker: {
    width: 150,
    height: 50,
    color: '#000000',
  },
  darkPicker: {
    color: '#ffffff',
  },
  slider: {
    width: 150,
    height: 40,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  darkButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkButtonText: {
    color: '#ffffff',
  },
  logoutButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  darkLogoutButton: {
    backgroundColor: '#ff6347',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkLogoutButtonText: {
    color: '#ffffff',
  },
  footer: {
    marginTop: 0,
    alignItems: 'center',
    padding: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  darkFooterText: {
    color: '#cccccc',
  },
});
