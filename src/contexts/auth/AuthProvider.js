import React, {createContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (authenticatedUser) => {
      setUser(authenticatedUser);

    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  const register = async (firstname, lastname, dob, email, password) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const { uid } = userCredential.user;

      // Add the user to Firestore
      await firestore()
        .collection('users')
        .doc(uid)
        .set({
          firstname: firstname,
          email: email,
          createdAt: firestore.Timestamp.fromDate(new Date()),
          lastname: lastname,
          dob: dob,
        });

      console.log('User added to Firestore with UID:', uid);
    } catch (error) {
      console.log('Something went wrong with sign up: ', error);
    }
  };

  const logout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
