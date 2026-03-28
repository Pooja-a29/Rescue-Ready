import { 
    collection, 
    addDoc, 
    serverTimestamp, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { db } from "./firebaseConfig.js"; 
import { sendSMSAlert } from "./sendSMS.js";

const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
    const emergencyBtn = document.getElementById("emergencyBtn");
    const emergencyList = document.getElementById("emergencyList");

    if (!emergencyBtn) {
        console.error("❌ Emergency button not found!");
        return;
    }

    // ✅ Ensure user is logged in (Anonymous Sign-In)
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            signInAnonymously(auth)
                .then((userCredential) => {
                    console.log("✅ Signed in anonymously:", userCredential.user.uid);
                    setupEmergencyButton(userCredential.user);
                })
                .catch((error) => {
                    console.error("❌ Error signing in anonymously:", error);
                });
        } else {
            console.log("✅ User logged in:", user.isAnonymous ? "Anonymous" : user.email);
            setupEmergencyButton(user);
        }
    });

    fetchEmergencyHistory(); 
});

// ✅ Emergency Button Setup
function setupEmergencyButton(user) {
    document.getElementById("emergencyBtn").addEventListener("click", () => {
        console.log("🚨 Emergency button clicked!");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => showLocation(position, user),
                showError,
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            document.getElementById("status").innerText = "Geolocation not supported.";
        }
    });
}

// ✅ Store Location & Trigger SMS
async function showLocation(position, user) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const email = user?.email || "Anonymous";

    document.getElementById("status").innerText = `Emergency Triggered! 📍 ${latitude}, ${longitude}`;

    try {
        if (!db) throw new Error("Firestore not initialized.");
        const emergencyRef = collection(db, "emergency_locations");

        await addDoc(emergencyRef, {
            latitude,
            longitude,
            email,
            timestamp: serverTimestamp(),
        });

        console.log("✅ Location saved in Firestore!");

        // Send SMS Alert
        sendSMSAlert("+91XXXXXXXXXX", latitude, longitude); // Replace with your verified number

    } catch (error) {
        console.error("❌ Error storing location:", error);
    }
}

// ⚠️ Handle Location Errors
function showError(error) {
    alert(`❌ Location Error: ${error.message}`);
    document.getElementById("status").innerText = "Unable to fetch location. Please enable GPS.";
}

// 📌 Fetch Emergency History
function fetchEmergencyHistory() {
    const emergencyList = document.getElementById("emergencyList");

    if (!db) return console.error("❌ Firestore not initialized.");

    const emergencyRef = collection(db, "emergency_locations");

    onSnapshot(emergencyRef, (snapshot) => {
        emergencyList.innerHTML = "";
        snapshot.forEach((doc) => {
            const data = doc.data();
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                📍 <b>Lat:</b> ${data.latitude}, 
                <b>Long:</b> ${data.longitude} <br> 
                📧 <b>Email:</b> ${data.email || "Unknown"} <br> 
                🕒 <b>Time:</b> ${data.timestamp?.toDate().toLocaleString() || "Unknown"}
            `;
            emergencyList.appendChild(listItem);
        });
    }, (error) => console.error("❌ Error fetching history:", error));
}
