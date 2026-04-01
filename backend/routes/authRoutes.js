import express from "express";
const router = express.Router();
import { sendOTP, verifyOTP, completeProfile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/send-otp", sendOTP); 
router.post("/verify-otp", verifyOTP);
router.put("/complete-profile", authMiddleware, completeProfile);

export default router;