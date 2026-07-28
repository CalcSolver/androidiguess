import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0I_UMv332X35KonD8rsT3b_8FxOt4ABo",
  authDomain: "avmseqta.firebaseapp.com",
  projectId: "avmseqta",
  storageBucket: "avmseqta.firebasestorage.app",
  messagingSenderId: "976895366427",
  appId: "1:976895366427:web:ba41ca62fced6797e4efbe",
  measurementId: "G-W7CCPP0927"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth & Firestore services for App.jsx
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;