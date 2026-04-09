import express from "express";
// Yahan trackBooking ko bhi add kiya hai
import { createBooking, trackBooking } from "../controllers/bookingController.js";

const router = express.Router();

// Booking create karne ke liye
router.post("/create", createBooking);

// Booking track karne ke liye (PNR + Phone)
router.post("/track", trackBooking);

export default router;