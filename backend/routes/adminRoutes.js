import express from "express";
import Bus from "../models/Bus.js";
import City from "../models/City.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// --- HELPER FUNCTION (City check ya create karne ke liye) ---
const getOrCreateCity = async (cityName) => {
  // Case-insensitive search (e.g., 'harda' aur 'Harda' ko same treat karega)
  let city = await City.findOne({ name: { $regex: new RegExp(`^${cityName}$`, 'i') } });

  if (!city) {
    // Agar city nahi mili, toh nayi city create karo (Formatting: harda -> Harda)
    const formattedName = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
    city = new City({ 
      name: formattedName, 
      state: "Not Specified" // Default state agar provide nahi ki gayi
    });
    await city.save();
  }
  return city;
};

// 1. Nayi Bus Add Karna (With Auto-City Registration)
router.post("/add-bus", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { 
      busName, busNumber, source, destination, 
      departureTime, arrivalTime, price, date, availableSeats 
    } = req.body;

    // --- AUTO-CITY REGISTRATION LOGIC ---
    const sourceCity = await getOrCreateCity(source);
    const destCity = await getOrCreateCity(destination);
    // ------------------------------------

    const newBus = new Bus({
      busName,
      busNumber,
      source: sourceCity.name, // Database wala properly formatted name
      destination: destCity.name,
      departureTime,
      arrivalTime,
      price,
      date,
      availableSeats
    });

    await newBus.save();
    res.status(201).json({ 
      message: "Bus added and Cities updated successfully!", 
      bus: newBus 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Nayi City Add Karna (Manual option bhi rehne dete hain)
router.post("/add-city", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, state } = req.body;
    const existingCity = await City.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    
    if (existingCity) return res.status(400).json({ message: "City already exists" });

    const newCity = new City({ name, state });
    await newCity.save();
    
    res.status(201).json({ message: "City added successfully!", city: newCity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Sabhi Cities ki list (Frontend dropdown ke liye)
router.get("/cities", async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Sabhi Bookings Dekhna
router.get("/all-bookings", authMiddleware, isAdmin, async (req, res) => {
    try {
        res.status(200).json({ message: "Bookings feature coming soon" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;