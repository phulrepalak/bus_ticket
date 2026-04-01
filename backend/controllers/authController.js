import User from "../models/User.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// 1. Send OTP via Twilio
export const sendOTP = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone number is required" });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, isProfileComplete: false });
    }
    
    user.otp = otp;
    await user.save();

    // SMS Bhejna (Only to Verified Numbers in Trial)
    await client.messages.create({
      body: `Your GoBus OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}` 
    });

    console.log(`✅ OTP ${otp} sent to +91${phone}`);
    res.status(200).json({ message: "OTP sent successfully!" });

  } catch (err) {
    console.error("❌ Twilio Error:", err.message);
    res.status(500).json({ error: "Twilio Error: Check if number is verified or Geo-permissions are on." });
  }
};

// 2. Verify OTP
export const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phone });
    
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null; 
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      token,
      isProfileComplete: user.isProfileComplete,
      message: "Login successful!"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Complete Profile
export const completeProfile = async (req, res) => {
  const { fullName, email, gender } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { fullName, email, gender, isProfileComplete: true },
      { new: true }
    );
    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};