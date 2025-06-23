// IMPORTANT: Replace the placeholder values with your actual Firebase project configuration.
// You can find this in your Firebase project settings.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZLw5_jDVAi1pzaedX2xDU_1VpG2kUu_Q",
  authDomain: "grock-a257f.firebaseapp.com",
  projectId: "grock-a257f",
  storageBucket: "grock-a257f.appspot.com",
  messagingSenderId: "105655078519",
  appId: "1:105655078519:web:53ee16b0805c8651a25126"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
