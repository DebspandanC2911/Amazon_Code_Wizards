// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBW7ZZwkC9qvapQyOdenwINSsLRDNMW7NY",
  authDomain: "cw-34e9f.firebaseapp.com",
  projectId: "cw-34e9f",
  storageBucket: "cw-34e9f.firebasestorage.app",
  messagingSenderId: "951290356759",
  appId: "1:951290356759:web:59bca079cc50ff13706852",
  measurementId: "G-E73YM06DT2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export default firebaseConfig;

