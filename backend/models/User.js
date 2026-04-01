import mongoose from "mongoose"; // badla gaya

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  fullName: { type: String, default: "" },
  email: { type: String, default: "" },
  gender: { type: String, default: "" },
  isGuest: { type: Boolean, default: false }, 
  isProfileComplete: { type: Boolean, default: false }, 
  otp: { type: String },
  otpExpires: { type: Date }
}, { timestamps: true });

// Export style badla gaya
const User = mongoose.model("User", userSchema);
export default User;