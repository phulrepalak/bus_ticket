import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes Imports
import authRoutes from "./routes/authRoutes.js";
//import busRoutes from "./routes/busRoutes.js";

// Load Environment Variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- MIDDLEWARES ---

// CORS allow karna zaroori hai taaki React app (port 5173/3000) backend se baat kar sake
app.use(cors({
  origin: "http://localhost:5173", // Apne Vite/React ka URL yahan check karein
  credentials: true
}));

// Body Parser taaki req.body read ho sake
app.use(express.json());

// --- ROUTES REGISTER ---

// Login, OTP, aur Profile functionality ke liye
app.use("/api/auth", authRoutes);

// Bus search aur filtering ke liye
//app.use("/api/bus", busRoutes);

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});