import Bus from "../models/Bus.js";
import City from "../models/City.js";

// 1. Add New Bus with Full Fields & City/State Management
export const addBus = async (req, res) => {
  const { 
    busName, 
    busNumber, 
    comfortType,
    seatType,
    source, 
    sourceState, 
    destination, 
    destinationState, 
    departureTime, 
    arrivalTime, 
    price, 
    availableSeats,
    availableDays,
    amenities
  } = req.body;

  try {
    // --- STEP 1: SOURCE CITY UPDATE/CREATE ---
    await City.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${source}$`, 'i') } },
      { name: source, state: sourceState },
      { upsert: true, new: true }
    );

    // --- STEP 2: DESTINATION CITY UPDATE/CREATE ---
    await City.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${destination}$`, 'i') } },
      { name: destination, state: destinationState },
      { upsert: true, new: true }
    );

    // --- STEP 3: SAVE BUS WITH ALL NEW FIELDS ---
    const newBus = new Bus({
      busName,
      busNumber,
      comfortType,
      seatType,
      source,
      destination,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
      availableDays, // Array format: ["Mon", "Tue"]
      amenities,      // Array format: ["WiFi", "AC"]
      date: req.body.date || "Daily" // Default to Daily if not provided
    });

    await newBus.save();

    res.status(201).json({ 
      message: "Bus and Fleet details added successfully!", 
      bus: newBus 
    });

  } catch (err) {
    console.error("Error adding bus:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 2. Search Buses (With Weekly/Daily Logic)
export const searchBuses = async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    let query = {};
    
    // Case-insensitive city search
    if (source) query.source = { $regex: new RegExp(`^${source}$`, "i") };
    if (destination) query.destination = { $regex: new RegExp(`^${destination}$`, "i") };

    // --- WEEKLY LOGIC ---
    if (date) {
      const selectedDate = new Date(date);
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = days[selectedDate.getDay()];
      
      // Sirf wahi bus dikhao jo us din (e.g. "Mon") available ho
      query.availableDays = dayName;
    }

    const buses = await Bus.find(query).sort({ departureTime: 1 });
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get All Buses (Admin View)
export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete Bus
export const deleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Bus deleted successfully from fleet" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};