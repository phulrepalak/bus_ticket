import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: { 
    type: String, 
    required: true, 
    unique: true 
  },
  fullName: { 
    type: String, 
    default: "" 
  },
  email: { 
    type: String, 
    default: "" 
  },
  gender: { 
    type: String, 
    default: "" 
  },
  // --- ROLE FEATURE ADDED ---
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user"          
  },
  // --------------------------
  isGuest: { 
    type: Boolean, 
    default: false 
  }, 
  isProfileComplete: { 
    type: Boolean, 
    default: false 
  }, 
  otp: { 
    type: String 
  },
  otpExpires: { 
    type: Date 
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;