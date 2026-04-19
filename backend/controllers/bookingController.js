import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createBooking = asyncHandler(async (req, res) => {
  const { 
    busId, seats, passengerDetails, totalAmount, journeyDate, 
    boardingPoint, droppingPoint, contact, paymentId, isGuest, paymentStatus 
  } = req.body;

  if (!busId || !seats || seats.length === 0 || !paymentId) {
    throw new ApiError(400, "Missing required booking details (Bus, Seats, or Payment ID)");
  }

  const bus = await Bus.findById(busId);
  if (!bus) throw new ApiError(404, "Bus not found");

  const formattedSeats = seats.map(s => String(s));
  const isAlreadyBooked = formattedSeats.some(seat => bus.bookedSeats.includes(seat));

  if (isAlreadyBooked) {
    throw new ApiError(400, "One or more selected seats are already booked");
  }

  const formattedPassengerDetails = passengerDetails.map(p => ({
    ...p,
    seat: String(p.seat)
  }));

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

  bus.bookedSeats.push(...formattedSeats);
  await bus.save();

  return res.status(201).json(new ApiResponse(201, { ticket: savedBooking }, "Booking successful!"));
});

export const trackBooking = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) throw new ApiError(400, "Phone number is required");

  const bookings = await Booking.find({ "contact.phone": String(phone).trim() })
    .populate("bus")
    .sort({ createdAt: -1 }); 

  if (!bookings || bookings.length === 0) {
    throw new ApiError(404, "No bookings found for this number.");
  }
  
  return res.status(200).json(new ApiResponse(200, { bookings }, "Bookings retrieved"));
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const { phone } = req.query; 
  if (!phone) throw new ApiError(400, "Phone number is required");

  const bookings = await Booking.find({ "contact.phone": phone })
    .populate("bus")
    .sort({ journeyDate: -1 });

  const today = new Date().toISOString().split('T')[0];
  const upcoming = bookings.filter(b => b.journeyDate >= today && b.paymentStatus === "Completed");
  const past = bookings.filter(b => b.journeyDate < today && b.paymentStatus === "Completed");
  const cancelled = bookings.filter(b => b.paymentStatus === "Cancelled");

  return res.status(200).json(new ApiResponse(200, { upcoming, past, cancelled }, "Bookings retrieved"));
});

export const getActivityStats = asyncHandler(async (req, res) => {
  const { phone } = req.query;
  if (!phone) throw new ApiError(400, "Phone number is required");

  const bookings = await Booking.find({ "contact.phone": phone, paymentStatus: "Completed" });

  const totalTrips = bookings.length;
  const totalSpent = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const uniqueCities = [...new Set(bookings.map(b => b.droppingPoint))].length;

  return res.status(200).json(new ApiResponse(200, {
    totalTrips,
    totalSpent,
    uniqueCities,
    memberSince: bookings.length > 0 ? bookings[0].createdAt : new Date()
  }, "Stats retrieved"));
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) throw new ApiError(404, "Booking not found");

  if (booking.paymentStatus === "Cancelled") {
    throw new ApiError(400, "Booking is already cancelled");
  }

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

  return res.status(200).json(new ApiResponse(200, null, "Booking cancelled and seats released"));
});