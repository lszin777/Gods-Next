// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";        
import { getFirestore } from "firebase/firestore";  

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYQ44kRNdAg9e9KHBvKZjbFgkoM7fRSbo",
  authDomain: "gods-next.firebaseapp.com",
  projectId: "gods-next",
  storageBucket: "gods-next.firebasestorage.app",
  messagingSenderId: "612431472801",
  appId: "1:612431472801:web:d9b6c10d48659c6a8828e0",
  measurementId: "G-N44WHDNE9T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportações para os seus componentes usarem
export const auth = getAuth(app);
export const db = getFirestore(app);
