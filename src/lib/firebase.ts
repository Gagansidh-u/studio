import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8DfQl0to_r2_KdLO7q2GE9dzINXf_qa4",
  authDomain: "grock-34c5b.firebaseapp.com",
  projectId: "grock-34c5b",
  storageBucket: "grock-34c5b.firebasestorage.app",
  messagingSenderId: "212508574848",
  appId: "1:212508574848:web:64f5bcdf3491b8c585d265",
  measurementId: "G-R9FRWQW5WM"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
