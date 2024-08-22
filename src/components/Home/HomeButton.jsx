// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Icon from 'react-native-ionicons';
// import { useNavigation } from '@react-navigation/native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// const GroupButton = [
//   { id: 1, icon: 'videocam-outline', title: 'Host',screen: 'Host' },
//   { id: 2, icon: 'add', title: 'Join', screen: 'Join' },
//   { id: 3, icon: 'calendar-outline', title: 'Calendar' , screen:'Calender'},
//   { id: 4, icon: 'share-outline', title: 'Sharing' },
// ];

// const HomeButton = () => {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       {GroupButton.map((button) => (
//         <View key={button.id} style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => navigation.navigate(button.screen)}
//           >
//             <Ionicons name={button.icon} size={30} color={'#ffffff'} />
//           </TouchableOpacity>
//           <Text style={styles.text}>{button.title}</Text>
//         </View>
//       ))}
//     </View>
//   );
// };

// export default HomeButton;

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 25,
//     paddingBottom: 10,
//     borderBottomColor: '#1f1f1f',
//     borderBottomWidth: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   buttonContainer: {
//     alignItems: 'center',
//   },
//   button: {
//     width: 60,
//     height: 60,
//     borderRadius: 15,
//     justifyContent: 'center',
//     backgroundColor: '#1E3A8A',
//     alignItems: 'center',
//   },
//   text: {
//     color: '#858585',
//     fontSize: 12,
//     fontWeight: '600',
//     paddingTop: 10,
//     textAlign: 'center',
//   },
// });


import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const GroupButton = [
  { id: 1, icon: 'videocam-outline', title: 'Host', screen: 'Host' },
  { id: 2, icon: 'add', title: 'Join', screen: 'Join' },
  { id: 3, icon: 'calendar-outline', title: 'Calendar', screen: 'Calendar' },
  { id: 4, icon: 'share-outline', title: 'Sharing' },
];

const HomeButton = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {GroupButton.map((button) => (
        <View key={button.id} style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              button.title === 'Host' && styles.hostButton, 
            ]}
            onPress={() => navigation.navigate(button.screen)}
          >
            <Ionicons name={button.icon} size={30} color={'#ffffff'} />
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
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
  },
  hostButton: {
    backgroundColor: '#FF6F61', 
  },
  text: {
    color: '#858585',
    fontSize: 12,
    fontWeight: '600',
    paddingTop: 10,
    textAlign: 'center',
  },
});
