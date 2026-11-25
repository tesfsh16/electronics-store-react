import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWDFxWsWRILauwmoNemAU64Ckq0MTMkPI",
  authDomain: "react-electronics-store-85f8c.firebaseapp.com",
  projectId: "react-electronics-store-85f8c",
  storageBucket: "react-electronics-store-85f8c.firebasestorage.app",
  messagingSenderId: "788245198730",
  appId: "1:788245198730:web:b1deed0c916fc5ef7d3a73",
  measurementId: "G-0XN8LG2XG1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
