// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "interviewiq-67a5a.firebaseapp.com",
  projectId: "interviewiq-67a5a",
  storageBucket: "interviewiq-67a5a.firebasestorage.app",
  messagingSenderId: "1076870251487",
  appId: "1:1076870251487:web:527749b28ede2895f63a6a",
  measurementId: "G-PVT0SKC3FC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const provider=new GoogleAuthProvider()
const analytics = getAnalytics(app);

export{auth,provider};