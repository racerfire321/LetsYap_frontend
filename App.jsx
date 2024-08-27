import React from 'react';
import Routes from './src/navigation/index';
import { AuthProvider } from './src/contexts/auth/AuthProvider';

const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
