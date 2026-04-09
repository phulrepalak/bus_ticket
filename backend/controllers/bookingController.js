import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";

// --- 1. NEW BOOKING CREATE KARNE KA LOGIC (With Seat Reservation) ---
export const createBooking = async (req, res) => {
  try {
    const { 
      busId, 
      seats, 
      passengerDetails, 
      totalAmount, 
      journeyDate, 
      boardingPoint, 
      droppingPoint, 
      contact, 
      paymentId, 
      isGuest,
      paymentStatus 
    } = req.body;

    // 1. Basic validation: Check ki zaroori cheezein missing toh nahi hain
    if (!busId || !seats || seats.length === 0 || !paymentId) {
      return res.status(400).json({ 
        message: "Missing required booking details (Bus, Seats, or Payment ID)" 
      });
    }

    // 1. Check if bus exists and seats are available
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const formattedSeats = seats.map(s => String(s));
    const isAlreadyBooked = formattedSeats.some(seat => bus.bookedSeats.includes(seat));

    if (isAlreadyBooked) {
      return res.status(400).json({ message: "One or more selected seats are already booked" });
    }

    const formattedPassengerDetails = passengerDetails.map(p => ({
      ...p,
      seat: String(p.seat)
    }));

    // 2. Create and Save Booking
    const newBooking = new Booking({
      bus: busId, 
      seats: formattedSeats,
      passengerDetails: formattedPassengerDetails,
      totalAmount,
      journeyDate,
      boardingPoint,
      droppingPoint,
      contact,
      paymentId,
      paymentStatus: paymentStatus || "Completed",
      isGuest: isGuest || false
    });

    const savedBooking = await newBooking.save();

    // 3. Update Bus model to reserve these seats
    bus.bookedSeats.push(...formattedSeats);
    await bus.save();

    res.status(201).json({ success: true, message: "Booking successful!", ticket: savedBooking });
  } catch (error) {
    console.error("DETAILED BOOKING ERROR:", error);
    res.status(400).json({ message: "Booking validation failed", error: error.message });
  }
};

// --- 2. GUEST USER KE LIYE BOOKING TRACK KARNE KA LOGIC ---
export const trackBooking = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    const bookings = await Booking.find({ "contact.phone": String(phone).trim() })
      .populate("bus")
      .sort({ createdAt: -1 }); 

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this number." });
    }
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// --- 3. GET LOGGED-IN USER BOOKINGS ---
export const getMyBookings = async (req, res) => {
  try {
    const { phone } = req.query; 
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    const bookings = await Booking.find({ "contact.phone": phone })
      .populate("bus")
      .sort({ journeyDate: -1 });

    const today = new Date().toISOString().split('T')[0];
    const upcoming = bookings.filter(b => b.journeyDate >= today && b.paymentStatus === "Completed");
    const past = bookings.filter(b => b.journeyDate < today && b.paymentStatus === "Completed");
    const cancelled = bookings.filter(b => b.paymentStatus === "Cancelled");

    res.status(200).json({ success: true, upcoming, past, cancelled });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// --- 4. GET ACTIVITY STATS ---
export const getActivityStats = async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    const bookings = await Booking.find({ "contact.phone": phone, paymentStatus: "Completed" });

    const totalTrips = bookings.length;
    const totalSpent = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const uniqueCities = [...new Set(bookings.map(b => b.droppingPoint))].length;

    res.status(200).json({
      success: true,
      stats: {
        totalTrips,
        totalSpent,
        uniqueCities,
        memberSince: bookings.length > 0 ? bookings[0].createdAt : new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching activity stats", error: error.message });
  }
};

// --- 5. CANCEL BOOKING LOGIC (With Seat Release) ---
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.paymentStatus === "Cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Release seats from the Bus model
    if (booking.bus) {
      const bus = await Bus.findById(booking.bus);
      if (bus && Array.isArray(bus.bookedSeats)) {
        const seatsToCancel = booking.seats.map(s => String(s));
        bus.bookedSeats = bus.bookedSeats.filter(s => !seatsToCancel.includes(String(s)));
        await bus.save();
      }
    }

    booking.paymentStatus = "Cancelled";
    await booking.save();

    res.status(200).json({ success: true, message: "Booking cancelled and seats released" });
  } catch (error) {
    console.error("CANCELLATION ERROR:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};