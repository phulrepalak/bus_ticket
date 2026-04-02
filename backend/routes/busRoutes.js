import express from "express";
import Bus from "../models/Bus.js";
import { 
  addBus, 
  searchBuses, 
  getAllBuses, 
  updateBus, 
  deleteBus 
} from "../controllers/busController.js";

const router = express.Router();

// Bus Search API: /api/bus/search
router.get("/search", async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    if (!source || !destination || !date) {
      return res.status(400).json({ message: "Source, destination, and date are required." });
    }

    // --- STEP 1: Date se Day Name nikalna ---
    // User jo date select karega (e.g., 2026-04-03), hum uska din (Fri) nikalenge
    const selectedDate = new Date(date);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = days[selectedDate.getDay()];

    // --- STEP 2: Query Filter Build Karna ---
    let query = {
      // Case-insensitive search for cities
      source: { $regex: new RegExp(`^${source}$`, "i") },
      destination: { $regex: new RegExp(`^${destination}$`, "i") },
      
      // Weekly Logic: Check karein ki kya bus is din chalti hai
      // Database mein availableDays ek array hai: ["Mon", "Fri", "Sun"]
      availableDays: dayName 
    };

    // --- STEP 3: Database se Fetch aur Sort karna ---
    const buses = await Bus.find(query).sort({ departureTime: 1 });

    // Response handle karna (Empty array if no buses found)
    if (buses.length === 0) {
      return res.status(200).json([]); 
    }

    res.status(200).json(buses);
  } catch (err) {
    console.error("Search API Error:", err.message);
    res.status(500).json({ error: "Something went wrong while searching buses." });
  }
});
//Sabhi buses ko fetch karne ke liye (Manage Bus page par dikhane ke liye)
// Method: GET | URL: /api/bus/all
router.get("/all", getAllBuses);

// Nayi bus add karne ke liye
// Method: POST | URL: /api/bus/add
router.post("/add", addBus);

// Bus ki details update/edit karne ke liye
// Method: PUT | URL: /api/bus/update/:id
router.put("/update/:id", updateBus);

// Bus ko delete karne ke liye
// Method: DELETE | URL: /api/bus/delete/:id
router.delete("/delete/:id", deleteBus);
export default router;