import express from "express";
import Bus from "../models/Bus.js";
import City from "../models/City.js"; 
import { 
  addBus, 
  getAllBuses, 
  getPopularRoutes,
  updateBus, 
  deleteBus,
  getBusById 
} from "../controllers/busController.js";

const router = express.Router();

// --- 1. STATIC ROUTES (Check these first) ---

router.get("/all", getAllBuses);

router.get("/points", async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "From and To cities are required." });
    }
    const sourceCity = await City.findOne({ 
      name: { $regex: new RegExp(`^${from}$`, "i") } 
    });
    const destCity = await City.findOne({ 
      name: { $regex: new RegExp(`^${to}$`, "i") } 
    });
    res.status(200).json({
      boardingPoints: sourceCity ? sourceCity.boardingPoints : [],
      droppingPoints: destCity ? destCity.droppingPoints : []
    });
  } catch (err) {
    console.error("Points API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch points from cities collection." });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    if (!source || !destination || !date) {
      return res.status(400).json({ message: "Source, destination, and date are required." });
    }
    const selectedDate = new Date(date);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = days[selectedDate.getDay()];

    // Time filtering logic for today's search
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();

    let query = {
      source: { $regex: new RegExp(`^${source}$`, "i") },
      destination: { $regex: new RegExp(`^${destination}$`, "i") },
      availableDays: dayName 
    };

    if (isToday) {
      const currentHours = today.getHours().toString().padStart(2, '0');
      const currentMinutes = today.getMinutes().toString().padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;
      
      // Filter for buses departing after the current time
      query.departureTime = { $gt: currentTimeString };
    }

    const buses = await Bus.find(query).sort({ departureTime: 1 });
    res.status(200).json(buses);
  } catch (err) {
    console.error("Search API Error:", err.message);
    res.status(500).json({ error: "Something went wrong while searching buses." });
  }
});

router.get("/popular", getPopularRoutes);

// --- 2. DYNAMIC PARAMETER ROUTES (Check these last) ---

// This must stay below /all, /search, and /points
router.get("/:id", getBusById); 

// --- 3. OTHER CRUD OPERATIONS ---

router.post("/add", addBus);
router.put("/update/:id", updateBus);
router.delete("/delete/:id", deleteBus);

export default router;