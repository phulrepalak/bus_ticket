import express from "express";
// Added cancelBooking to imports
import { createBooking, trackBooking, getMyBookings, getActivityStats, cancelBooking } from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Booking create 
router.post("/create", createBooking);

// Booking track (PNR + Phone)
router.post("/track", trackBooking);

// --- NEW ROUTES FOR USER DASHBOARD ---
// Logged-in user fetch booking
router.get("/my-bookings", authMiddleware, getMyBookings);

// fetch user activity stats for dashboard
router.get("/activity-stats", authMiddleware, getActivityStats);

// --- CANCELLATION ROUTE ---
// Ticket cancellation by user (only if payment is completed and journey date is in future)
router.put("/cancel/:id", authMiddleware, cancelBooking);

export default router;