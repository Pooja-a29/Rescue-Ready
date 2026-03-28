import { db } from "./firebaseConfig"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const updateLocation = async () => {
    console.log("📢 updateLocation() function called!");

    if (!navigator.geolocation) {
        console.error("❌ Geolocation is NOT supported.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            console.log("✅ Location access granted!");
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`📍 Location Fetched: ${latitude}, ${longitude}`);

            try {
                const docRef = await addDoc(collection(db, "emergency_locations"), {
                    latitude,
                    longitude,
                    timestamp: serverTimestamp(),
                });
                console.log("✅ Emergency location stored with ID:", docRef.id);
            } catch (error) {
                console.error("❌ Error storing emergency location:", error.message);
            }
        },
        (error) => {
            console.error("❌ Geolocation error:", error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
};

export default updateLocation;
