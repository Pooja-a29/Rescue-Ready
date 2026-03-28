// sendSMS.js
export async function sendSMSAlert(phoneNumber, emergencyLat, emergencyLon) {
  try {
    // Build the SMS message
    const message = `🚨 Emergency reported at location: Latitude ${emergencyLat}, Longitude ${emergencyLon}. Please respond if nearby!`;

    const response = await fetch("http://localhost:5000/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: phoneNumber,   // ✅ matches backend
        message: message,  // ✅ matches backend
      }),
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error ${response.status}: ${errData.error || response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log("✅ SMS sent successfully!", result);
    } else {
      console.error("❌ Error sending SMS:", result.error, result.details || "");
    }
  } catch (error) {
    console.error("❌ Network or backend error:", error.message);
  }
}
