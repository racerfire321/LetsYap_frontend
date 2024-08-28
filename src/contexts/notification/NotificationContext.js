import React, { createContext, useContext, useEffect, useState } from 'react';
import notifee from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../auth/AuthProvider';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const storedSetting = await AsyncStorage.getItem('isNotificationsEnabled');
        if (storedSetting !== null) {
          setIsNotificationsEnabled(JSON.parse(storedSetting));
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    };

    loadNotificationSettings();
  }, []);

  useEffect(() => {
    const saveNotificationSettings = async () => {
      try {
        await AsyncStorage.setItem('isNotificationsEnabled', JSON.stringify(isNotificationsEnabled));
      } catch (error) {
        console.error('Error saving notification settings:', error);
      }
    };

    saveNotificationSettings();
  }, [isNotificationsEnabled]);

  useEffect(() => {
    let notificationInterval;

    const fetchAndSendNotifications = async () => {
      console.log('Fetching and sending notifications...');
      if (user && isNotificationsEnabled) {
        try {
          const today = new Date().toISOString().split('T')[0];

          const notificationSent = await AsyncStorage.getItem('notificationSent');
          const notificationSentDate = await AsyncStorage.getItem('notificationSentDate');

          if (notificationSent === today) {
            console.log('Notification for today has already been sent.');
            return;
          }

          const eventsQuerySnapshot = await firestore()
            .collection('user-events')
            .where('date', '==', today)
            .get();

          if (!eventsQuerySnapshot.empty) {
            const newEvents = [];
            eventsQuerySnapshot.forEach((doc) => {
              const event = doc.data();
              newEvents.push(event);
            });

            if (newEvents.length > 0) {
              await sendNotificationsForEvents(newEvents);
              await AsyncStorage.setItem('notificationSent', today);
              await AsyncStorage.setItem('notificationSentDate', new Date().toISOString());
            }
          } else {
            console.log('No events found for today.');
          }
        } catch (error) {
          console.error('Error fetching events or sending notifications:', error);
        }
      }
    };

    const sendNotificationsForEvents = async (events) => {
      for (const event of events) {
        console.log(`Sending notification for event: ${event.name}`);
        await sendNotification(event.name);
      }
    };

    if (isNotificationsEnabled) {
      notificationInterval = setInterval(async () => {
        const lastNotificationDate = await AsyncStorage.getItem('notificationSentDate');
        const now = new Date();
        if (lastNotificationDate) {
          const lastDate = new Date(lastNotificationDate);
          const hoursDiff = Math.floor((now - lastDate) / (1000 * 60 * 60));

          if (hoursDiff >= 4) {
            await fetchAndSendNotifications();
          }
        } else {
          await fetchAndSendNotifications();
        }
      }, 4 * 60 * 60 * 1000); // Check every 4 hours
    } else {
      if (notificationInterval) clearInterval(notificationInterval);
    }

    const unsubscribe = firestore()
      .collection('user-events')
      .where('date', '==', new Date().toISOString().split('T')[0])
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const event = change.doc.data();
            console.log(`New event added: ${event.name}`);
            if (isNotificationsEnabled) {
              await sendNotification(event.name);
            }
          }
        });
      });

    return () => {
      if (notificationInterval) clearInterval(notificationInterval);
      unsubscribe();
    };
  }, [user, isNotificationsEnabled]);

  const sendNotification = async (eventName) => {
    console.log(`Preparing to send notification for event: ${eventName}`);
    try {
      await notifee.createChannel({
        id: 'default', 
  name: 'Default Channel',
  sound: 'notification',
      });

      await notifee.displayNotification({
        title: 'Are you ready for upcoming events?',
        body: `${eventName}`,
        android: {
            channelId: 'default', 
            sound: 'notification',
        }
      });

      console.log(`Notification sent for event: ${eventName}`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ isNotificationsEnabled, setIsNotificationsEnabled }}>
      {children}
    </NotificationContext.Provider>
  );
};
