// Import the functions you need from the SDKs you need
// Import the functions you need from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore'; // 🔹 import this for Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdAYWRDVS-na88-nBRwwxmo3RmjzCZzso",
  authDomain: "vehiman-796a8.firebaseapp.com",
  databaseURL: "https://vehiman-796a8-default-rtdb.firebaseio.com",
  projectId: "vehiman-796a8",
  storageBucket: "vehiman-796a8.firebasestorage.app",
  messagingSenderId: "606391715755",
  appId: "1:606391715755:web:e73824500f2ea467f074ee",
  measurementId: "G-R3WR4CNJHX"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); //initialize Firestore here

// Export the initialized app and db
export { app, db };