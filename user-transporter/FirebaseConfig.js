// Import the functions you need from the Firebase SDKs
const { initializeApp } = require("firebase/app"); // Import the Firebase app functions
const { getDatabase } = require("firebase/database"); // Import database functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHX7XCl6rqWAzL5g-xN3McdHdV2gfo6TY",
  authDomain: "akhri-aramgah-a1821.firebaseapp.com",
  databaseURL: "https://akhri-aramgah-a1821-default-rtdb.firebaseio.com",
  projectId: "akhri-aramgah-a1821",
  storageBucket: "akhri-aramgah-a1821.appspot.com",
  messagingSenderId: "287269058442",
  appId: "1:287269058442:web:66928bf15f1a4bae9b7a73",
  measurementId: "G-V7B7ERZ2KS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics; // Declare analytics without initializing

// Check if running in a browser environment before initializing Analytics
if (typeof window !== "undefined") {
  const { getAnalytics } = require("firebase/analytics"); // Import analytics functions only if in browser
  analytics = getAnalytics(app); // Initialize Analytics
}

// Initialize Realtime Database
const db = getDatabase(app); // Initialize Realtime Database

// Export the initialized instances for use in other files
module.exports = { app, analytics, db };
