import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLV_-nCa68KkAhE-XtmC5z9xK1vBswhrE",
  authDomain: "quizzing-1686c.firebaseapp.com",
  projectId: "quizzing-1686c",
  storageBucket: "quizzing-1686c.appspot.com",
  messagingSenderId: "419950074285",
  appId: "1:419950074285:web:9a338050ce42ed92e26924",
  measurementId: "G-B8FGG1SWV4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
