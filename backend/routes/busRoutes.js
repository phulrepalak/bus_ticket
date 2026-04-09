import express from "express";
import Bus from "../models/Bus.js";
import City from "../models/City.js"; // City model import check kar lena
import { 
  addBus, 
  getAllBuses, 
  updateBus, 
  deleteBus 
} from "../controllers/busController.js";

const router = express.Router();

// --- NEW ROUTE: Boarding & Dropping Points Fetching ---
// Method: GET | URL: /api/bus/points
router.get("/points", async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "From and To cities are required." });
    }

    // 1. Source City se Boarding Points dhoondo (Case-insensitive)
    const sourceCity = await City.findOne({ 
      name: { $regex: new RegExp(`^${from}$`, "i") } 
    });
    
    // 2. Destination City se Dropping Points dhoondo (Case-insensitive)
    const destCity = await City.findOne({ 
      name: { $regex: new RegExp(`^${to}$`, "i") } 
    });

    // Response: Agar city mili toh uske points, nahi toh empty array
    res.status(200).json({
      boardingPoints: sourceCity ? sourceCity.boardingPoints : [],
      droppingPoints: destCity ? destCity.droppingPoints : []
    });
  } catch (err) {
    console.error("Points API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch points from cities collection." });
  }
});

// --- YOUR ORIGINAL SEARCH API (Fixed for Case-Sensitivity) ---
router.get("/search", async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    if (!source || !destination || !date) {
      return res.status(400).json({ message: "Source, destination, and date are required." });
    }

    // STEP 1: Date se Day Name nikalna
    const selectedDate = new Date(date);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = days[selectedDate.getDay()];

    // STEP 2: Query Filter Build Karna
    let query = {
      // Input "delhi" ho ya "Delhi", ye sahi se dhoondega
      source: { $regex: new RegExp(`^${source}$`, "i") },
      destination: { $regex: new RegExp(`^${destination}$`, "i") },
      availableDays: dayName 
    };

    // STEP 3: Database se Fetch aur Sort karna
    const buses = await Bus.find(query).sort({ departureTime: 1 });

    res.status(200).json(buses); // Direct array bhej rahe hain (empty if none)
  } catch (err) {
    console.error("Search API Error:", err.message);
    res.status(500).json({ error: "Something went wrong while searching buses." });
  }
});

// Baaki saare original routes
router.get("/all", getAllBuses);
router.post("/add", addBus);
router.put("/update/:id", updateBus);
router.delete("/delete/:id", deleteBus);

export default router;