import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const items = {
    '2024-08-19': [{ name: 'Meeting with Team', height: 80 }],
    '2024-08-20': [{ name: 'Project Deadline', height: 80 }],
    '2024-08-22': [{ name: 'Doctor Appointment', height: 80 }],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Schedule</Text>
      <Agenda
        items={items}
        selected={selectedDate || '2024-08-19'}
        renderItem={(item) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
        renderEmptyDate={() => (
          <View style={styles.emptyDate}>
            <Text style={styles.emptyDateText}>No Events Today</Text>
          </View>
        )}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        theme={{
          backgroundColor: '#1c1c1c',
          calendarBackground: '#1c1c1c',
          selectedDayBackgroundColor: '#3b5998',
          todayTextColor: '#3b5998',
          dayTextColor: '#ffffff',
          textDisabledColor: '#555555',
          dotColor: '#3b5998',
          selectedDotColor: '#ffffff',
          arrowColor: 'orange',
          monthTextColor: '#90caf9',
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
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#3b5998',
    color: '#ffffff',
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#252525',
    padding: 20,
    marginRight: 10,
    marginTop: 17,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  itemText: {
    color: '#ffffff',
  },
  emptyDate: {
    backgroundColor: '#252525',
    padding: 20,
    marginRight: 10,
    marginTop: 17,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyDateText: {
    color: '#ffffff',
  },
});
