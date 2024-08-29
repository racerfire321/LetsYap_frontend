import React from 'react';
import Routes from './src/navigation/index';
import { AuthProvider } from './src/contexts/auth/AuthProvider';
import { ThemeProvider } from './src/contexts/theme/ThemeProvider';
import { NotificationProvider } from './src/contexts/notification/NotificationContext';

const App = () => {
 
  return (
    <ThemeProvider>
    <AuthProvider>
    <NotificationProvider>
      <Routes />
      </NotificationProvider>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
