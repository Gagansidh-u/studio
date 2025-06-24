
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// IMPORTANT: For Google Sign-In to work, you must add your
// development domain (e.g., localhost) to the list of authorized domains
// in your Firebase project settings. You can find this in the
// Firebase Console under Authentication > Settings > Authorized domains.
// The 'auth/unauthorized-domain' error occurs if the domain is not listed.

const firebaseConfig = {
  apiKey: "AIzaSyA8DfQl0to_r2_KdLO7q2GE9dzINXf_qa4",
  authDomain: "grock-34c5b.firebaseapp.com",
  projectId: "grock-34c5b",
  storageBucket: "grock-34c5b.appspot.com",
  messagingSenderId: "212508574848",
  appId: "1:212508574848:web:64f5bcdf3491b8c585d265",
  measurementId: "G-R9FRWQW5WM",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
