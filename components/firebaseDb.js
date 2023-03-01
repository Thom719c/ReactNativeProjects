import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5m4AoQNYgtSHeJn4jFbgs9sM04DDkVwk",
    authDomain: "reactnativeproject-baa69.firebaseapp.com",
    projectId: "reactnativeproject-baa69",
    storageBucket: "reactnativeproject-baa69.appspot.com",
    messagingSenderId: "21623297437",
    appId: "1:21623297437:web:54037f7e8a0dcc7454cb74"
};

/**
 * if import is like → import firebase from '../path/firebaseDb';
 * it's uses default export Configeration. → ex. import firebase from '../path/firebaseDb';
 * 
 * Other Options is following:
 * 1. import { db } from '../path/firebaseDb';
 * 2. import { auth } from '../path/firebaseDb';
 * 3. import { storage } from '../path/firebaseDb';
 */
const firebaseApp = initializeApp(firebaseConfig);

/**
 * Export Firebase DB. → ex. import { db } from '../path/firebaseDb';
 * 
 * * Then it can just be used like collection(db, 'notes');
 */
export const db = getFirestore(firebaseApp);

/**
 * Export Authentication. → ex. import { auth } from '../path/firebaseDb';
 */
export const auth = getAuth();

/**
 * Export Firebase storage. → ex. import { storage } from '../path/firebaseDb';
 */
export const storage = getStorage(firebaseApp);

/**
 * Default export Configeration. → ex. import firebase from '../path/firebaseDb';
 */
export default firebaseApp;