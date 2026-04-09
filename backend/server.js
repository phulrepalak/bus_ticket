import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Razorpay from "razorpay"; // Import format sahi kiya
import connectDB from "./config/db.js";

// Routes Imports
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// Load Environment Variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- RAZORPAY INSTANCE ---
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- MIDDLEWARES ---
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());

// --- RAZORPAY ORDER ROUTE ---
// Frontend (Payment.jsx) isi URL ko call karega
app.post("/api/payment/order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Number(amount * 100), // Rupee to Paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ message: "Internal Server Error in Razorpay" });
  }
});

// --- ROUTES REGISTER ---
app.use("/api/admin", adminRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/bookings", bookingRoutes);

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});