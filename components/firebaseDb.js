// import { firebase } from "@react-native-firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5m4AoQNYgtSHeJn4jFbgs9sM04DDkVwk",
    authDomain: "reactnativeproject-baa69.firebaseapp.com",
    projectId: "reactnativeproject-baa69",
    storageBucket: "reactnativeproject-baa69.appspot.com",
    messagingSenderId: "21623297437",
    appId: "1:21623297437:web:54037f7e8a0dcc7454cb74"
};

const firebaseApp = initializeApp(firebaseConfig);
// firebase.firestore();
// const db = getFirestore(firebaseApp)
export const auth = getAuth();
export default firebaseApp;