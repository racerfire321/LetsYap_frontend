import React, { useRef, useEffect,useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { ThemeContext } from '../../contexts/theme/ThemeProvider';
import { Colors } from '../../constants/constants';


const { height } = Dimensions.get('window');

const FormModal = ({ visible, onClose, children, title }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const { isDarkTheme } = useContext(ThemeContext);
  const currentColors = isDarkTheme ? Colors.dark : Colors.light; 
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start(),
      ]);
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 400,
          useNativeDriver: true,
        }).start(),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(),
      ]);
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      backgroundColor={currentColors.box}>
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayAnim,
          },
        ]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.modalContent,
          { transform: [{ translateY: slideAnim }],  backgroundColor: currentColors.box },
         
        ]}>
        {title && <Text style={[styles.title, { color: currentColors.secondary }]}>{title}</Text>}
        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  content: {
    width: '100%',
  },
});

export default FormModal;
