import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes Imports
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import busRoutes from "./routes/busRoutes.js"; // <--- Naya Import

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

// Public Bus Search functionality ke liye (Home/Search page)
app.use("/api/bus", busRoutes); // <--- Is line ko add kiya gaya hai

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});