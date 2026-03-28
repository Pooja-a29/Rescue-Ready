const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");
require("dotenv").config();

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

// Validate Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.error("❌ Missing Twilio credentials. Check your .env file.");
    process.exit(1);
}

const client = twilio(accountSid, authToken);

// Function to send SMS
async function sendSMS(phoneNumber, emergencyLat, emergencyLon) {
    const message = `🚨 Emergency Alert! A person needs help at 📍${emergencyLat}, ${emergencyLon}. If you are nearby, please assist.`;

    try {
        const response = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: phoneNumber
        });
        console.log(`📩 SMS sent to ${phoneNumber}: ${response.sid}`);
    } catch (error) {
        console.error(`❌ Error sending SMS to ${phoneNumber}:`, error.message);
    }
}

// Firestore Trigger: Runs when a new emergency is added
exports.sendEmergencySMS = functions.firestore
    .document("emergency_locations/{docId}")
    .onCreate(async (snap, context) => {
        const data = snap.data();
        if (!data.latitude || !data.longitude) {
            console.error("❌ Missing location data. Skipping SMS.");
            return;
        }

        console.log("🚨 New Emergency:", data);

        // Fetch responders from Firestore (or use a hardcoded list)
        try {
            const respondersSnapshot = await db.collection("responders").get();
            const responders = respondersSnapshot.docs.map(doc => doc.data().phoneNumber);

            if (responders.length === 0) {
                console.warn("⚠️ No responders found in Firestore.");
                return;
            }

            console.log("📡 Notifying responders:", responders);

            // Send SMS to each responder
            for (const responder of responders) {
                await sendSMS(responder, data.latitude, data.longitude);
            }
        } catch (error) {
            console.error("❌ Error fetching responders:", error.message);
        }
    });
