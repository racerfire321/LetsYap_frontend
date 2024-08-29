// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { AirbnbRating } from 'react-native-ratings';

// const RatingComponent = ({ onRate }) => {
//   const handleRating = (rating) => {
//     onRate(rating);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Rate Your Call</Text>
//       <AirbnbRating
//         count={5}
//         reviews={["Terrible", "Bad", "OK", "Good", "Great"]}
//         defaultRating={0}
//         size={30}
//         onFinishRating={handleRating}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 10,
//   },
// });

// export default RatingComponent;


import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Button } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

const RatingComponent = ({ onRate, onClose }) => {
  const [rating, setRating] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#f5f5f5'); // Default background color
  const [modalVisible, setModalVisible] = useState(true);

  const handleRating = (rating) => {
    setRating(rating);
    switch (rating) {
      case 1:
        setSelectedColor('#ff4d4d'); // Red for Terrible
        break;
      case 2:
        setSelectedColor('#ff6f61'); // Orange for Bad
        break;
      case 3:
        setSelectedColor('#ffcc00'); // Yellow for OK
        break;
      case 4:
        setSelectedColor('#4caf50'); // Green for Good
        break;
      case 5:
        setSelectedColor('#2196f3'); // Blue for Great
        break;
      default:
        setSelectedColor('#f5f5f5');
        break;
    }
  };

  const handleConfirm = () => {
    onRate(rating);
    setModalVisible(false);
    onClose(); // Notify parent to close modal
  };

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.container, { backgroundColor: selectedColor }]}>
          <Text style={styles.title}>Rate Your Call</Text>
          <AirbnbRating
            count={5}
            reviews={["Terrible", "Bad", "OK", "Good", "Great"]}
            defaultRating={0}
            size={30}
            onFinishRating={handleRating}
          />
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  confirmButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196f3',
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RatingComponent;
