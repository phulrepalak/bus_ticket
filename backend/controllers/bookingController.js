import Booking from "../models/Booking.js";

// --- 1. NEW BOOKING CREATE KARNE KA LOGIC ---
export const createBooking = async (req, res) => {
  try {
    // Frontend se saara data nikalna
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

    // 2. Universal Data Handling: 
    // Har seat ko String mein badal do taaki "1" aur "L1" dono save ho sakein
    const formattedSeats = seats.map(s => String(s));

    // Passenger details ke andar bhi seat number ko String bana do
    const formattedPassengerDetails = passengerDetails.map(p => ({
      ...p,
      seat: String(p.seat)
    }));

    // 3. New Booking Object banana
    const newBooking = new Booking({
      bus: busId, // Model mein field ka naam 'bus' hai
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

    // 4. Database mein save karna
    const savedBooking = await newBooking.save();

    // 5. Success Response
    res.status(201).json({ 
      success: true, 
      message: "Booking successful!", 
      ticket: savedBooking 
    });

  } catch (error) {
    // Terminal mein detail error dekhne ke liye
    console.error("DETAILED BOOKING ERROR:", error);
    
    res.status(400).json({ 
      message: "Booking validation failed", 
      error: error.message 
    });
  }
};

// --- 2. GUEST USER KE LIYE BOOKING TRACK KARNE KA LOGIC (Phone Number Based) ---
export const trackBooking = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validation for phone number input
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Is phone number se linked saari bookings dhoondo (latest pehle dikhegi)
    // .trim() use kiya hai taaki extra space se error na aaye
    const bookings = await Booking.find({ "contact.phone": String(phone).trim() })
      .populate("bus")
      .sort({ createdAt: -1 }); 

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this number." });
    }

    // Success response with array of bookings
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    // Agar server error aaye toh terminal mein check karein
    console.error("TRACKING ERROR:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};