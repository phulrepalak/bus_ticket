import User from "../models/User.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOTP = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) throw new ApiError(400, "Phone number is required");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  let user = await User.findOne({ phone });
  if (!user) {
    user = new User({ phone, isProfileComplete: false, role: "user" });
  }
  
  user.otp = otp;
  await user.save();

  try {
    await client.messages.create({
      body: `Your GoBus OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}` 
    });
  } catch (err) {
    throw new ApiError(500, "Twilio Error: Please check your credentials.");
  }

  return res.status(200).json(new ApiResponse(200, null, "OTP sent successfully!"));
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;
  const user = await User.findOne({ phone });
  
  if (!user || user.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  user.otp = null; 
  await user.save();

  const userRole = user.role || "user";

  const token = jwt.sign(
    { id: user._id, role: userRole }, 
    process.env.JWT_SECRET, 
    { expiresIn: "7d" }
  );

  return res.status(200).json(
    new ApiResponse(200, {
      token,
      role: userRole, 
      isProfileComplete: user.isProfileComplete
    }, "Login successful!")
  );
});

export const completeProfile = asyncHandler(async (req, res) => {
  const { fullName, email, gender } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id, 
    { fullName, email, gender, isProfileComplete: true },
    { new: true }
  ).select("-otp");

  return res.status(200).json(new ApiResponse(200, { user }, "Profile created successfully"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email, gender } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id, 
    { fullName, email, gender },
    { new: true }
  ).select("-otp");

  if (!user) throw new ApiError(404, "User not found");

  return res.status(200).json(new ApiResponse(200, { user }, "Profile updated successfully"));
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-otp"); 
  if (!user) throw new ApiError(404, "User not found");

  return res.status(200).json(new ApiResponse(200, user, "Profile fetched successfully"));
});