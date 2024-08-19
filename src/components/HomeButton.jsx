import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-ionicons'


const GroupButton =[{
    id: 1,
    icon: 'Host',
    title: 'Host'
},
{
    id: 2,
    icon: '+',
    title: 'Join'
},{
    id: 3,
    icon: 'Host',
    title: 'Calender'
},{
    id: 4,
    icon: 'Host',
    title: 'Screen share'
}

]
const HomeButton = () => {
    return (
      <View style={styles.container}>
        {GroupButton.map((button) => (
          <View key={button.id} style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
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
      flex: 1,
      alignItems: 'center',
      marginHorizontal: 5, // Adjust spacing between buttons
    },
    button: {
      width: 60,
      height: 60,
      borderRadius: 15,
      justifyContent: 'center',
      backgroundColor: 'blue', // Changed for better visibility
      alignItems: 'center',
    },
    text: {
      color: '#f5f5f5',
      fontSize: 16,
      fontWeight: '600',
      paddingTop: 10,
    },
  });