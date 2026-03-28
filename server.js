import express from "express";
import twilio from "twilio";
import dotenv from "dotenv";
import cors from "cors";   // <-- add this

dotenv.config();

const app = express();
app.use(cors());           // <-- allow all origins
app.use(express.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// test route
app.post("/send-sms", async (req, res) => {
  try {
    const message = await client.messages.create({
      body: "🚨 Emergency Alert! Help needed immediately.",
      from: process.env.TWILIO_PHONE_NUMBER,  // Twilio number
      to: "+919360103915"                     // your verified number
    });

    res.json({ success: true, sid: message.sid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
