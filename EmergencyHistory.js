import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

async function fetchEmergencyHistory() {
    try {
        const querySnapshot = await getDocs(collection(db, "emergency_locations"));
        const emergencyList = document.getElementById("emergencyList");

        emergencyList.innerHTML = ""; // Clear previous entries

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Fetched Data:", data); // Debugging line

            // Convert Firestore timestamp to IST (only if it exists)
            let formattedTime = "No Timestamp";
            if (data.timestamp && data.timestamp.seconds) {
                const timestamp = new Date(data.timestamp.seconds * 1000);
                formattedTime = timestamp.toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata", // Ensures it shows in IST
                    hour12: true,             // Uses 12-hour format (AM/PM)
                    weekday: "short",         // Shows day abbreviation
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                });
            }

            // Create list item
            const listItem = document.createElement("li");
            listItem.innerHTML = `📍 <strong>Location:</strong> ${data.latitude}, ${data.longitude} <br> 🕒 <strong>Time:</strong> ${formattedTime}`;
            emergencyList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching emergency history:", error);
    }
}

// ✅ Use this to ensure script runs after the page loads
document.addEventListener("DOMContentLoaded", fetchEmergencyHistory);
