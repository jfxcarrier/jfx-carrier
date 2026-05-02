import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDOySGXJlcgkE35oCzDmcOSH9FW2E84Xw",
  authDomain: "jfx-carrier.firebaseapp.com",
  projectId: "jfx-carrier",
  storageBucket: "jfx-carrier.firebasestorage.app",
  messagingSenderId: "414857563650",
  appId: "1:414857563650:web:e613dfc0c53d620550211b",
  measurementId: "G-33R15F10JB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
