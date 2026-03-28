import { db, collection, addDoc } from "../firebaseConfig.js"; // Ensure correct path
import { sendSMSAlert } from "./sendSMS.js";

// List of nearby users (replace with real numbers)
const nearbyUsers = [
    { name: "pavi", phone: "+919360103915" }, 
    { name: "venkat", phone: "+919962101363" }
];

// Emergency button click event
document.getElementById("emergencyBtn").addEventListener("click", async () => {
    console.log("🚨 Emergency button clicked!");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                console.log(`📍 Location: ${latitude}, ${longitude}`);

                // Save location to Firestore
                try {
                    await addDoc(collection(db, "emergency_locations"), {
                        latitude,
                        longitude,
                        timestamp: new Date(),
                    });
                    console.log("✅ Location saved successfully in Firestore.");
                } catch (error) {
                    console.error("❌ Error saving location:", error);
                    alert("Error saving location. Please try again.");
                    return;
                }

                // Send SMS alerts to nearby users
                for (const user of nearbyUsers) {
                    try {
                        await sendSMSAlert(user.phone, latitude, longitude);
                        console.log(`✅ Alert sent to ${user.name} (${user.phone})`);
                    } catch (error) {
                        console.error(`❌ Failed to send alert to ${user.name}:`, error);
                    }
                }

                // Update UI
                document.getElementById("smsStatus").innerText = "📩 SMS Alert Sent!";
                alert("🚨 Emergency alert sent successfully!");
            },
            (error) => {
                console.error("❌ Location access denied:", error);
                alert("❌ Location access denied. Please enable location services.");
            }
        );
    } else {
        alert("❌ Geolocation is not supported by this browser.");
    }
});
