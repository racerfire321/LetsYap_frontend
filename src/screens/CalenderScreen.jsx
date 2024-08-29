import React, { useContext, useState, useEffect } from 'react'; 
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, Button } from 'react-native';
import { Agenda } from 'react-native-calendars';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext } from '../contexts/theme/ThemeProvider';
import { AuthContext } from '../contexts/auth/AuthProvider';
import { Colors } from '../constants/constants';
import FormModal from '../components/modal/FormModal';  

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [items, setItems] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventId, setEventId] = useState(null);
  const { isDarkTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const currentColors = isDarkTheme ? Colors.dark : Colors.light;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);

    if (user) {
      const unsubscribe = firestore()
        .collection('user-events')
        .where('userId', '==', user.uid)
        .onSnapshot(querySnapshot => {
          const events = {};
          querySnapshot.forEach(doc => {
            const data = doc.data();
            const date = data.date;
            if (!events[date]) {
              events[date] = [];
            }
            events[date].push({
              ...data,
              id: doc.id,
            });
          });
          setItems(events);
        });

      return () => unsubscribe();
    }
  }, [user]);

  const handleAddEvent = async () => {
    if (eventName.trim() === '') {
      Alert.alert('Error', 'Event name cannot be empty');
      return;
    }

    try {
      if (eventId) {
        await firestore()
          .collection('user-events')
          .doc(eventId)
          .update({
            name: eventName,
            date: selectedDate,
          });
        console.log('Event updated');
      } else {
        await firestore()
          .collection('user-events')
          .add({
            userId: user.uid,
            name: eventName,
            date: selectedDate,
          });
        console.log('Event added');
      }

      resetModal();
    } catch (error) {
      console.error('Error adding/updating event: ', error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await firestore()
        .collection('user-events')
        .doc(id)
        .delete();
      console.log('Event deleted');
      // Update state to reflect deletion
      setItems(prevItems => {
        const updatedItems = { ...prevItems };
        for (const date in updatedItems) {
          updatedItems[date] = updatedItems[date].filter(item => item.id !== id);
          if (updatedItems[date].length === 0) {
            delete updatedItems[date];
          }
        }
        return updatedItems;
      });
    } catch (error) {
      console.error('Error deleting event: ', error);
    }
  };

  const resetModal = () => {
    setEventName('');
    setEventId(null);
    setModalVisible(false);
  };

  const openEditModal = (item) => {
    setEventName(item.name);
    setEventId(item.id);
    setSelectedDate(item.date);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.header, { backgroundColor: currentColors.primary }]}>
        Your Schedule
      </Text>
      <Agenda
        items={items}
        selected={selectedDate}
        renderItem={(item) => (
          <View key={item.id} style={[styles.itemContainer, { backgroundColor: currentColors.box }]}>
            <TouchableOpacity
              style={[styles.item, { backgroundColor: currentColors.box }]}
              onPress={() => openEditModal(item)}
            >
              <Text style={[styles.itemText, { color: currentColors.text }]}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteEvent(item.id)}>
              <Icon name="delete" size={24} color={currentColors.text} />
            </TouchableOpacity>
          </View>
        )}
        renderEmptyDate={() => (
          <View style={[styles.emptyDate, { backgroundColor: currentColors.box }]}>
            <Text style={[styles.emptyDateText, { color: currentColors.text }]}>No Events Today</Text>
          </View>
        )}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          backgroundColor: currentColors.background,
          calendarBackground: currentColors.background,
          selectedDayBackgroundColor: currentColors.primary,
          todayTextColor: currentColors.primary,
          dayTextColor: currentColors.text,
          textDisabledColor: currentColors.textDisabled,
          dotColor: currentColors.primary,
          selectedDotColor: currentColors.text,
          arrowColor: currentColors.primary,
          monthTextColor: currentColors.primary,
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />

      <TouchableOpacity style={[styles.addButton, { backgroundColor: currentColors.primary }]} onPress={() => setModalVisible(true)}>
        <Icon name="add-circle" size={44} color={currentColors.background} />
      </TouchableOpacity>

      <FormModal
        visible={modalVisible}
        onClose={resetModal}
        title="Add/Edit Event"
      >
        <TextInput
          style={[styles.input, { backgroundColor: currentColors.inputBackground, color: currentColors.text }]}
          placeholder="Event Name"
          placeholderTextColor={currentColors.textDisabled}
          value={eventName}
          onChangeText={setEventName}
        />
        <Text style={{ color: currentColors.text }}>Selected Date: {selectedDate}</Text>
        <View style={styles.modalButtons}>
          <Button title="Cancel" onPress={resetModal} color={currentColors.secondary} />
          <Button title="Save" onPress={handleAddEvent} color={currentColors.primary} />
        </View>
      </FormModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    color: 'white',
    elevation: 3,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    margin: 15,
    elevation: 3,
  },
  item: {
    flex: 1,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
  },
  emptyDate: {
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyDateText: {
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    zIndex: 1,
    borderRadius: 28,
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  modalButtons: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CalendarScreen;
