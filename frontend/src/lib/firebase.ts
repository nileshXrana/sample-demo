import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBGZ11EwpzGrDvo3a0eKr5RORS3jzA4CL4",
  authDomain: "e-commerce-firebase-ca386.firebaseapp.com",
  projectId: "e-commerce-firebase-ca386",
  storageBucket: "e-commerce-firebase-ca386.firebasestorage.app",
  messagingSenderId: "507759810619",
  appId: "1:507759810619:web:6a7fc2f9a1c234c429a41e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);