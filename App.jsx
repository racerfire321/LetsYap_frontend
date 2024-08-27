import React from 'react';
import Routes from './src/navigation/index';
import { AuthProvider } from './src/contexts/auth/AuthProvider';
import { ThemeProvider } from './src/contexts/theme/ThemeProvider';

const App = () => {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Routes />
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
