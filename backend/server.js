import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes Imports
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";  // Import check karein

// Load Environment Variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- MIDDLEWARES ---

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

// Body Parser zaroori hai admin data read karne ke liye
app.use(express.json());

// --- ROUTES REGISTER ---

// Admin panel (Bus/City management) ke liye
app.use("/api/admin", adminRoutes); 

// Login, OTP, aur Profile functionality ke liye
app.use("/api/auth", authRoutes);

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});