import Bus from "../models/Bus.js";
import City from "../models/City.js";

// --- HELPERS (Reusable logic to update city points) ---
const updateCityData = async (cityName, state, points, type) => {
  if (!cityName) return;
  
  // Empty values filter out karein taaki junk data na jaye
  const cleanPoints = points
    .map(p => typeof p === 'object' ? p.location : p)
    .filter(loc => loc && loc.trim() !== "");

  const updateField = type === "source" 
    ? { boardingPoints: { $each: cleanPoints } } 
    : { droppingPoints: { $each: cleanPoints } };

  await City.findOneAndUpdate(
    { name: { $regex: new RegExp(`^${cityName}$`, 'i') } },
    { 
      name: cityName, 
      state: state,
      $addToSet: updateField 
    },
    { upsert: true, new: true }
  );
};

// 1. Add New Bus & Auto-Save City with Points
export const addBus = async (req, res) => {
  const { 
    source, sourceState, destination, destinationState, 
    boardingPoints, droppingPoints 
  } = req.body;

  try {
    // STEP 1 & 2: Update City Collections
    await updateCityData(source, sourceState, boardingPoints, "source");
    await updateCityData(destination, destinationState, droppingPoints, "destination");

    // STEP 3: Save Bus
    const newBus = new Bus({
      ...req.body,
      // Agar front-end se date nahi aayi toh fallback "Daily" (depend on your schema)
    });

    await newBus.save();
    res.status(201).json({ message: "Bus and City details added successfully!", bus: newBus });

  } catch (err) {
    console.error("Add Bus Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 2. Get City Details (Frontend auto-fill ke liye)
export const getCityDetails = async (req, res) => {
  try {
    const { cityName } = req.params;
    // Pura object return karein taaki state aur points dono mil sakein
    const city = await City.findOne({ name: { $regex: new RegExp(`^${cityName}$`, 'i') } });
    
    if (city) {
      res.status(200).json(city);
    } else {
      res.status(404).json({ message: "City not found in database" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Search Buses (Optimized with Weekly Logic)
export const searchBuses = async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    
    if (!source || !destination || !date) {
        return res.status(400).json({ message: "All search fields are required." });
    }

    let query = {
        source: { $regex: new RegExp(`^${source}$`, "i") },
        destination: { $regex: new RegExp(`^${destination}$`, "i") }
    };

    // --- WEEKLY LOGIC ---
    if (date) {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = days[new Date(date).getDay()];
      query.availableDays = dayName; // Check if bus runs on this day
    }

    const buses = await Bus.find(query).sort({ departureTime: 1 });
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Get All Buses (Admin Panel ke liye)
export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Delete Bus
export const deleteBus = async (req, res) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(req.params.id);
    if (!deletedBus) return res.status(404).json({ message: "Bus not found" });
    
    res.status(200).json({ message: "Bus removed from fleet successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};

// 6. Update Bus (Points sync ke saath)
export const updateBus = async (req, res) => {
  try {
    const { 
        source, sourceState, destination, destinationState, 
        boardingPoints, droppingPoints 
    } = req.body;

    // Agar update mein cities change hui hain toh points sync karo
    if (source) await updateCityData(source, sourceState, boardingPoints, "source");
    if (destination) await updateCityData(destination, destinationState, droppingPoints, "destination");

    const updatedBus = await Bus.findByIdAndUpdate(
        req.params.id, 
        { $set: req.body }, 
        { new: true, runValidators: true }
    );

    if (!updatedBus) return res.status(404).json({ message: "Bus not found" });

    res.status(200).json({ message: "Bus configuration updated!", bus: updatedBus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};