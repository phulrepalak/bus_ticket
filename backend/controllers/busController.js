import Bus from "../models/Bus.js";
import City from "../models/City.js";
import Booking from "../models/Booking.js"; 

// --- HELPERS (Reusable logic to update city points) ---
const updateCityData = async (cityName, state, points, type) => {
  if (!cityName) return;
  const cleanPoints = points
    .map(p => typeof p === 'object' ? p.location : p)
    .filter(loc => loc && loc.trim() !== "");
  const updateField = type === "source" 
    ? { boardingPoints: { $each: cleanPoints } } 
    : { droppingPoints: { $each: cleanPoints } };
  await City.findOneAndUpdate(
    { name: { $regex: new RegExp(`^${cityName}$`, 'i') } },
    { name: cityName, state: state, $addToSet: updateField },
    { upsert: true, new: true }
  );
};

// --- UPDATED: GET BUS DETAILS WITH BOOKED SEATS ---
export const getBusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query; 

    const bus = await Bus.findById(id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    const searchDate = String(date).trim();

    const activeBookings = await Booking.find({
      bus: id,
      journeyDate: searchDate, 
      paymentStatus: "Completed"
    });

    // Debugging logs
    console.log(`Backend searching for: Bus=${id}, Date=${searchDate}`);
    console.log(`Bookings found: ${activeBookings.length}`);

    const bookedSeats = activeBookings.reduce((acc, curr) => {
      const cleaned = curr.seats.map(s => String(s).trim());
      return acc.concat(cleaned);
    }, []);

    res.status(200).json({ bus, bookedSeats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 1. Add New Bus
export const addBus = async (req, res) => {
  const { source, sourceState, destination, destinationState, boardingPoints, droppingPoints } = req.body;
  try {
    await updateCityData(source, sourceState, boardingPoints, "source");
    await updateCityData(destination, destinationState, droppingPoints, "destination");
    const newBus = new Bus({ ...req.body });
    await newBus.save();
    res.status(201).json({ message: "Bus added successfully!", bus: newBus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get City Details
export const getCityDetails = async (req, res) => {
  try {
    const { cityName } = req.params;
    const city = await City.findOne({ name: { $regex: new RegExp(`^${cityName}$`, 'i') } });
    city ? res.status(200).json(city) : res.status(404).json({ message: "City not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Search Buses
export const searchBuses = async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    if (!source || !destination || !date) return res.status(400).json({ message: "Fields required" });
    let query = {
        source: { $regex: new RegExp(`^${source}$`, "i") },
        destination: { $regex: new RegExp(`^${destination}$`, "i") }
    };
    if (date) {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      query.availableDays = days[new Date(date).getDay()]; 
    }
    const buses = await Bus.find(query).sort({ departureTime: 1 });
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Get All Buses
export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Get Popular Routes
export const getPopularRoutes = async (req, res) => {
  try {
    const popularRoutes = await Booking.aggregate([
      { $match: { paymentStatus: "Completed" } },
      { $group: { _id: "$bus", bookings: { $sum: 1 } } },
      { $sort: { bookings: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "buses",
          localField: "_id",
          foreignField: "_id",
          as: "bus",
        },
      },
      { $unwind: "$bus" },
      {
        $project: {
          busId: "$bus._id",
          busName: "$bus.busName",
          source: "$bus.source",
          destination: "$bus.destination",
          price: "$bus.price",
          departureTime: "$bus.departureTime",
          arrivalTime: "$bus.arrivalTime",
          bookings: 1,
        },
      },
    ]);

    if (popularRoutes.length === 0) {
      const fallbackBuses = await Bus.find().sort({ createdAt: -1 }).limit(3);
      return res.status(200).json(
        fallbackBuses.map((bus) => ({
          busId: bus._id,
          busName: bus.busName,
          source: bus.source,
          destination: bus.destination,
          price: bus.price,
          departureTime: bus.departureTime,
          arrivalTime: bus.arrivalTime,
          bookings: 0,
        }))
      );
    }

    res.status(200).json(popularRoutes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Delete Bus
export const deleteBus = async (req, res) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(req.params.id);
    deletedBus ? res.status(200).json({ message: "Bus removed" }) : res.status(404).json({ message: "Not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};

// 6. Update Bus
export const updateBus = async (req, res) => {
  try {
    const { source, sourceState, destination, destinationState, boardingPoints, droppingPoints } = req.body;
    if (source) await updateCityData(source, sourceState, boardingPoints, "source");
    if (destination) await updateCityData(destination, destinationState, droppingPoints, "destination");
    const updatedBus = await Bus.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json({ message: "Updated", bus: updatedBus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};