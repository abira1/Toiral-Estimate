import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD66_mayYpFnps8Pe-oHpwH8g8hVFLtjTY",
  authDomain: "toiral-estimate.firebaseapp.com",
  databaseURL: "https://toiral-estimate-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "toiral-estimate",
  storageBucket: "toiral-estimate.firebasestorage.app",
  messagingSenderId: "716687005215",
  appId: "1:716687005215:web:30be3e16368d0fe891272a",
  measurementId: "G-K38QPCSGEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, analytics, auth, database };
