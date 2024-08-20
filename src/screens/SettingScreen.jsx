import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SettingsScreen = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const toggleThemeSwitch = () => setIsDarkTheme(previousState => !previousState);
  const toggleNotificationsSwitch = () => setIsNotificationsEnabled(previousState => !previousState);

  return (
    <ScrollView style={[styles.container, isDarkTheme && styles.darkContainer]}>
      <Text style={[styles.title, isDarkTheme && styles.darkTitle]}>Settings</Text>

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
      <TouchableOpacity style={[styles.button, isDarkTheme && styles.darkButton]}>
        <Text style={[styles.buttonText, isDarkTheme && styles.darkButtonText]}>Privacy Policy</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={[styles.logoutButton, isDarkTheme && styles.darkLogoutButton]}>
        <Text style={[styles.logoutButtonText, isDarkTheme && styles.darkLogoutButtonText]}>Logout</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  darkTitle: {
    color: '#ffffff',
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
    marginTop: 40,
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
});
