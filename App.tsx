import React, { useState } from 'react';
import AppNavigator from './src/navigation/Navigation';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return <AppNavigator isLoggedIn={isLoggedIn} />;
};

export default App;
