// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Constants from "expo-constants";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF9WfkqrwxyQzU8sby3_xSqL_JKva_6RU",
  authDomain: "clubin-d61c8.firebaseapp.com",
  projectId: "clubin-d61c8",
  storageBucket: "clubin-d61c8.appspot.com",
  messagingSenderId: "698969517289",
  appId: "1:698969517289:web:16b57d009937dd8f52d478",
  measurementId: "G-4L5K739KRS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export { auth };
