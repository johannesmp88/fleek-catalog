import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5iE7qBcQr-auJozKj46qRpsH2xaTvUGY",
  authDomain: "catalogofleek.firebaseapp.com",
  projectId: "catalogofleek",
  storageBucket: "catalogofleek.firebasestorage.app",
  messagingSenderId: "27499753531",
  appId: "1:27499753531:web:34ce537377f697b09b2c1e",
  measurementId: "G-HK4KYG6ZTC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
