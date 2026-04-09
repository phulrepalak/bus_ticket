import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  // Bus ki reference ID (Jo Bus model se connect hogi)
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },
  // Book ki gayi seats ka array (e.g., [8, 12])
  seats: {
    type: [String], // <--- Ise Number ki jagah String kar do
    required: true,
  },
  passengerDetails: [
    {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, required: true },
      seat: { type: String }, // <--- Ise bhi String kar do
    },
  ],
  // Total payment amount
  totalAmount: {
    type: Number,
    required: true,
  },
  // Safar ki tarikh
  journeyDate: {
    type: String, // Ya Date type bhi use kar sakte hain format ke hisaab se
    required: true,
  },
  // Boarding aur Dropping details
  boardingPoint: {
    type: String,
    required: true,
  },
  droppingPoint: {
    type: String,
    required: true,
  },
  // Contact details (Email aur Phone)
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  // Razorpay Payment ID (Verification aur refund ke liye zaroori hai)
  paymentId: {
    type: String,
    required: true,
  },
  // Payment ka status
  paymentStatus: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Completed", "Failed", "Cancelled"],
  },
  // User Type (Guest hai ya Logged-in)
  isGuest: {
    type: Boolean,
    default: false,
  },
  // Booking kab hui
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;