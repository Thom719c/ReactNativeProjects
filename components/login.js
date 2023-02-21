import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from './firebaseDb';
import Authentication from '../navigation/screens/auth/Authentication';
import MainContainer from '../navigation/MainContainer';

const Login = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  });

  const createUser = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === 'auth/weak-password') {
        setError('The password is too weak!')
      } else if (error.code === 'auth/invalid-email') {
        setError('The email is invalid!')
      } else {
        setError('There was a problem creating your account');
      }
    }
  };

  const signin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === 'auth/invalid-email' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/email-already-in-use') {
        setError('Your email or password was incorrect');
      } else {
        console.log('There was a problem with your request');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  if (authenticated) {
    return <MainContainer logout={logout} />;
  }

  return <Authentication signin={signin} createUser={createUser} error={error} />;
}

export default Login