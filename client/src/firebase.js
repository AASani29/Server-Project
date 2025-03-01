// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "taxchain-e7c1b.firebaseapp.com",
  projectId: "taxchain-e7c1b",
  storageBucket: "taxchain-e7c1b.firebasestorage.app",
  messagingSenderId: "528000955596",
  appId: "1:528000955596:web:ef3546604214dc27befe69"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
