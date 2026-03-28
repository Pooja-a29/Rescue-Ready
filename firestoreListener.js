import { db } from "./firebaseConfig.js";
import { collection, onSnapshot } from "firebase/firestore";

const emergencyList = document.getElementById("emergencyList");

// Listen for emergency signals
const emergencyCollection = collection(db, "emergencies");
onSnapshot(emergencyCollection, (snapshot) => {
    emergencyList.innerHTML = ""; // Clear previous list
    snapshot.forEach((doc) => {
        const data = doc.data();
        const listItem = document.createElement("li");
        listItem.textContent = `Emergency at ${data.location} - ${data.timestamp}`;
        emergencyList.appendChild(listItem);
    });
});
