import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';

/// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDqenLkFw_oVwcnKw-q3L-_reYkMPMFa4",
  authDomain: "hotel-rooms-management.firebaseapp.com",
  projectId: "hotel-rooms-management",
  storageBucket: "hotel-rooms-management.firebasestorage.app",
  messagingSenderId: "831641232450",
  appId: "1:831641232450:web:7e77819f9241795ce039db",
  measurementId: "G-KSZZXZLDCN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Export Firebase services for use in other parts of the app
export const auth = getAuth(app);
export const db = getFirestore(app);

// This App ID is provided by the environment to namespace Firestore data.
export const appId = 'default-hotel-app';

// Set log level for easier debugging during development
setLogLevel('debug');