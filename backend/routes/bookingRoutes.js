import express from "express";
// Added cancelBooking to imports
import { createBooking, trackBooking, getMyBookings, getActivityStats, cancelBooking } from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Booking create karne ke liye
router.post("/create", createBooking);

// Booking track karne ke liye (PNR + Phone)
router.post("/track", trackBooking);

// --- NEW ROUTES FOR USER DASHBOARD ---
// Logged-in user ke bookings fetch karne ke liye
router.get("/my-bookings", authMiddleware, getMyBookings);

// User ki overall travel activity stats fetch karne ke liye
router.get("/activity-stats", authMiddleware, getActivityStats);

// --- CANCELLATION ROUTE ---
// Ticket cancel karne ke liye
router.put("/cancel/:id", authMiddleware, cancelBooking);

export default router;