// import { StyleSheet, Text, View,Image } from 'react-native'
// import Icon from 'react-native-ionicons';
// import React from 'react'


// const Header = () => {
//   return (
//     <View  style={styles.container}>
//      <View style={styles.header}>
//         <Image source={require('../../assets/Bubbles.png')} style={styles.headerImage} />
//       </View>
//        <Icon name="add" size={30} color="#efefef" />
//       <Text style={styles.title}>Let's Yap</Text>
//       <Icon name="chatboxes" size={30} color="#efefef" />
      
//     </View>
//   )
// }

// export default Header

// const styles = StyleSheet.create({
//   container:{
//     flexDirection : 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 50,
//   },
//   header: {
//     position: 'absolute',
//     top: -180,
//     left: -90,
//     zIndex: 999,
//     transform: [{ rotate: '-50deg' }],
//   },
//   headerImage: {
//     width: 550, 
//     height: 300, 
//   },
//   title:{
//     fontSize:20,
//     color: '#efefef'
//   }
// })

// import { StyleSheet, Text, View, Image } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import React from 'react';
// import LottieView from 'lottie-react-native';

// const Header = () => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Image source={require('../../assets/Bubbles.png')} style={styles.headerImage} />
//       </View>

//       <View style={styles.overlayContainer}>
//         <Text style={styles.title}>Let's Yap</Text>
      
//       </View>
//       <LottieView source={require('../../assets/animation/home.json')} autoPlay
//               loop
//               style={styles.homeanimation} />
//     </View>
//   );
// };

// export default Header;

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 50,
//   },
//   header: {
//     position: 'absolute',
//     top: -200,
//     left: -90,
//     zIndex: 1,
//     transform: [{ rotate: '-50deg' }],
//   },
//   headerImage: {
//     width: 550,
//     height: 300,
//   },
//   overlayContainer: {
//     position: 'absolute',
//     zIndex: 2,
//     top: 0,
//     left: 100,
//     right: 0,
//     bottom: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   icon: {
//     zIndex: 3,
//     left: 23
  
//   },
//   title: {
//     fontSize: 24,
//     color: '#efefef',
//     zIndex: 3,
//   },
// });


import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const Header = () => {
  return (
    <>
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/Bubbles.png')} style={styles.headerImage} />
      </View>

      <View style={styles.overlayContainer}>
        <Text style={styles.title}>Let's Yap</Text>
      </View>

      {/* <LottieView
        source={require('../../assets/animation/home.json')}
        autoPlay
        loop
        style={styles.homeAnimation}
      /> */}
    </View>
    <LottieView
    source={require('../../assets/animation/home.json')}
    autoPlay
    loop
    style={styles.homeAnimation}
    speed={4} 
  />
  </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50,
    position: 'relative',
    marginBottom:50
  },
  header: {
    position: 'absolute',
    top: -200,
    left: -90,
    zIndex: 1,
    transform: [{ rotate: '-50deg' }],
  },
  headerImage: {
    width: 550,
    height: 300,
  },
  overlayContainer: {
    position: 'absolute',
    zIndex: 3,
    top: 0,
    left: 100,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: '#efefef',
  },
  homeAnimation: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    left: 120,
    right: 0,
    bottom: 30,
    width: '100%',
    height: 140,
  },
});
