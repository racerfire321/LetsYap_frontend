import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-ionicons';
import { useNavigation } from '@react-navigation/native';

const GroupButton = [
  { id: 1, icon: 'person-add', title: 'Host',screen: 'Host' },
  { id: 2, icon: 'add', title: 'Join', screen: 'Join' },
  { id: 3, icon: 'calendar', title: 'Calendar' , screen:'Calender'},
  { id: 4, icon: 'share', title: 'Sharing' },
];

const HomeButton = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {GroupButton.map((button) => (
        <View key={button.id} style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate(button.screen)}
          >
            <Icon name={button.icon} size={30} color="#efefef" />
          </TouchableOpacity>
          <Text style={styles.text}>{button.title}</Text>
        </View>
      ))}
    </View>
  );
};

export default HomeButton;

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingBottom: 10,
    borderBottomColor: '#1f1f1f',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    backgroundColor: 'blue',
    alignItems: 'center',
  },
  text: {
    color: '#858585',
    fontSize: 12,
    fontWeight: '600',
    paddingTop: 10,
    textAlign: 'center',
  },
});
