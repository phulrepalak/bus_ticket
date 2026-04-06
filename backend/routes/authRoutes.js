import express from "express";
const router = express.Router();
import { sendOTP, verifyOTP, completeProfile, getProfile,updateProfile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/send-otp", sendOTP); 
router.post("/verify-otp", verifyOTP);
router.put("/complete-profile", authMiddleware, completeProfile);
router.get("/me", authMiddleware, getProfile);
router.put("/update-profile", authMiddleware, updateProfile);
export default router;