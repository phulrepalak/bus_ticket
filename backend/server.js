import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { ApiError } from "./utils/ApiError.js";

dotenv.config();

connectDB();

const app = express();


app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());

app.use("/api/admin", adminRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Internal Server Error" } = err;
    if (!(err instanceof ApiError)) {
        message = err.message || message;
    }
    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});