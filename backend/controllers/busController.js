import Bus from "../models/Bus.js";
import City from "../models/City.js";

// 1. Add New Bus with Automatic City/State Management
export const addBus = async (req, res) => {
  const { 
    busName, 
    busNumber, 
    source, 
    sourceState, 
    destination, 
    destinationState, 
    departureTime, 
    arrivalTime, 
    price, 
    seats 
  } = req.body;

  try {
    // --- STEP 1: SOURCE CITY KO UPDATE YA CREATE KAREIN ---
    // Agar city nahi hai toh nayi banegi, agar hai toh state update ho jayega
    await City.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${source}$`, 'i') } }, // Case-insensitive search
      { name: source, state: sourceState }, // Data to save
      { upsert: true, new: true } // Upsert: true matlab agar nahi hai toh create karo
    );

    // --- STEP 2: DESTINATION CITY KO UPDATE YA CREATE KAREIN ---
    await City.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${destination}$`, 'i') } },
      { name: destination, state: destinationState },
      { upsert: true, new: true }
    );

    // --- STEP 3: NAYI BUS SAVE KAREIN ---
    // Bus model mein state save nahi hoga kyunki aapne wahan field nahi banayi hai
    const newBus = new Bus({
      busName,
      busNumber,
      source, // Sirf city name
      destination, // Sirf city name
      departureTime,
      arrivalTime,
      price,
      seats,
      date: req.body.date // Ensure karein frontend se date aa rahi hai
    });

    await newBus.save();

    res.status(201).json({ 
      message: "Bus added and City states updated successfully!", 
      bus: newBus 
    });

  } catch (err) {
    console.error("Error adding bus:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 2. Search Buses (Public API)
export const searchBuses = async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    let query = {};
    if (source) query.source = { $regex: new RegExp(`^${source}$`, "i") };
    if (destination) query.destination = { $regex: new RegExp(`^${destination}$`, "i") };
    if (date) query.date = date;

    // Sorting by departure time (Early to Late)
    const buses = await Bus.find(query).sort({ departureTime: 1 });

    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get All Buses (For Admin Dashboard)
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
    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};