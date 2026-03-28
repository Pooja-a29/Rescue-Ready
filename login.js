// Import Firebase authentication functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { firebaseConfig } from "./firebaseConfig.js";  // Ensure firebaseConfig.js contains Firebase setup

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get UI elements
const loginBtn = document.getElementById("loginBtn");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const statusText = document.getElementById("status");

// Email & Password Login
loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("✅ Logged in:", userCredential.user);
            statusText.innerText = "Login successful!";
            window.location.href = "dashboard.html"; // Redirect after login
        })
        .catch((error) => {
            console.error("❌ Login failed:", error);
            statusText.innerText = "Login failed: " + error.message;
        });
});

// Google Login
googleLoginBtn.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("✅ Google Login:", result.user);
            statusText.innerText = "Google Login successful!";
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            console.error("❌ Google Login failed:", error);
            statusText.innerText = "Google Login failed: " + error.message;
        });
});
