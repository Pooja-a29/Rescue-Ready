import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRtAnnjdXKqP3bTvd2q67Ucvmq23ygqRg",
  authDomain: "rescue-ready-226b1.firebaseapp.com",
  projectId: "rescue-ready-226b1",
  storageBucket: "rescue-ready-226b1.firebasestorage.app",
  messagingSenderId: "751470426833",
  appId: "1:751470426833:web:aad04a131306fd9a1163f0"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export { db };



if (!db) {
  console.error("❌ Firestore database is NOT initialized!");
} else {
  console.log("✅ Firestore database initialized successfully:", db);
}

