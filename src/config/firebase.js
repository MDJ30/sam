import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAQB58blZRAqkrM4IlcHacgoSxsplSFVRQ",
  authDomain: "samweb-4c65d.firebaseapp.com",
  databaseURL: "https://samweb-4c65d-default-rtdb.firebaseio.com",
  projectId: "samweb-4c65d",
  storageBucket: "samweb-4c65d.firebasestorage.app",
  messagingSenderId: "331535109390",
  appId: "1:331535109390:web:dd7a94abbfea5705cf9b5f",
  measurementId: "G-BKYFXKZ2QD"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);