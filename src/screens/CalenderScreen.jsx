// import React, { useState } from 'react';
// import { StyleSheet, View, Text } from 'react-native';
// import { Agenda } from 'react-native-calendars';

// const CalendarScreen = () => {
//   const [selectedDate, setSelectedDate] = useState('');

//   const items = {
//     '2024-08-19': [{ name: 'Meeting with Team', height: 80 }],
//     '2024-08-20': [{ name: 'Project Deadline', height: 80 }],
//     '2024-08-22': [{ name: 'Doctor Appointment', height: 80 }],
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Your Schedule</Text>
//       <Agenda
//         items={items}
//         selected={selectedDate || '2024-08-19'}
//         renderItem={(item) => (
//           <View style={styles.item}>
//             <Text style={styles.itemText}>{item.name}</Text>
//           </View>
//         )}
//         renderEmptyDate={() => (
//           <View style={styles.emptyDate}>
//             <Text style={styles.emptyDateText}>No Events Today</Text>
//           </View>
//         )}
//         onDayPress={(day) => {
//           setSelectedDate(day.dateString);
//         }}
//         theme={{
//           backgroundColor: '#1c1c1c',
//           calendarBackground: '#1c1c1c',
//           selectedDayBackgroundColor: '#3b5998',
//           todayTextColor: '#3b5998',
//           dayTextColor: '#ffffff',
//           textDisabledColor: '#555555',
//           dotColor: '#3b5998',
//           selectedDotColor: '#ffffff',
//           arrowColor: 'orange',
//           monthTextColor: '#90caf9',
//           textDayFontFamily: 'monospace',
//           textMonthFontFamily: 'monospace',
//           textDayHeaderFontFamily: 'monospace',
//           textDayFontWeight: '300',
//           textMonthFontWeight: 'bold',
//           textDayHeaderFontWeight: '300',
//           textDayFontSize: 16,
//           textMonthFontSize: 16,
//           textDayHeaderFontSize: 16,
//         }}
//       />
//     </View>
//   );
// };

// export default CalendarScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1c1c1c',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     padding: 16,
//     backgroundColor: '#3b5998',
//     color: '#ffffff',
//     textAlign: 'center',
//   },
//   item: {
//     backgroundColor: '#252525',
//     padding: 20,
//     marginRight: 10,
//     marginTop: 17,
//     borderRadius: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   itemText: {
//     color: '#ffffff',
//   },
//   emptyDate: {
//     backgroundColor: '#252525',
//     padding: 20,
//     marginRight: 10,
//     marginTop: 17,
//     borderRadius: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   emptyDateText: {
//     color: '#ffffff',
//   },
// });


import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { ThemeContext } from '../contexts/theme/ThemeProvider'; // Adjust import path if needed
import { Colors } from '../constants/constants';
const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const { isDarkTheme } = useContext(ThemeContext);
  const currentColors = isDarkTheme ? Colors.dark : Colors.light; // Adjust Colors import if needed

  const items = {
    '2024-08-19': [{ name: 'Meeting with Team', height: 80 }],
    '2024-08-20': [{ name: 'Project Deadline', height: 80 }],
    '2024-08-22': [{ name: 'Doctor Appointment', height: 80 }],
  };

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.header, { backgroundColor: currentColors.primary }]}>
        Your Schedule
      </Text>
      <Agenda
        items={items}
        selected={selectedDate || '2024-08-19'}
        renderItem={(item) => (
          <View style={[styles.item, { backgroundColor: currentColors.background }]}>
            <Text style={[styles.itemText, { color: currentColors.text
             }]}>{item.name}</Text>
          </View>
        )}
        renderEmptyDate={() => (
          <View style={[styles.emptyDate, { backgroundColor: currentColors.background }]}>
            <Text style={[styles.emptyDateText, { color: currentColors.text }]}>No Events Today</Text>
          </View>
        )}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        theme={{
          backgroundColor: currentColors.background,
          calendarBackground: currentColors.background,
          selectedDayBackgroundColor: currentColors.background,
          todayTextColor: currentColors.primary,
          dayTextColor: currentColors.text,
          textDisabledColor: currentColors.textDisabled,
          dotColor: currentColors.dotColor,
          selectedDotColor: currentColors.primary,
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
    </View>
  );
};

export default CalendarScreen;

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
    elevation: 3
  },
  item: {
    padding: 20,
    marginRight: 10,
    marginTop: 17,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  itemText: {
    color: '#ffffff',
  },
  emptyDate: {
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
