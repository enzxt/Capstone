import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDByjlGFC5Hj2-i_v96Han7vgLvTtSnnsY",
  authDomain: "capstone-7965e.firebaseapp.com",
  databaseURL: "https://capstone-7965e-default-rtdb.firebaseio.com",
  projectId: "capstone-7965e",
  storageBucket: "capstone-7965e.appspot.com",
  messagingSenderId: "650422037801",
  appId: "1:650422037801:web:b997a2e0bb4af40f0b5b38",
  measurementId: "G-2841DBW1NW"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app)

export { firestore, auth };
