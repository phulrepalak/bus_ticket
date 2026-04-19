import Bus from "../models/Bus.js";
import City from "../models/City.js";
import Booking from "../models/Booking.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

export const getBusById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date } = req.query; 

  const bus = await Bus.findById(id);
  if (!bus) throw new ApiError(404, "Bus not found");

  const searchDate = String(date).trim();

  const activeBookings = await Booking.find({
    bus: id,
    journeyDate: searchDate, 
    paymentStatus: "Completed" 
  });

  const bookedSeats = activeBookings.reduce((acc, curr) => {
    const cleaned = curr.seats.map(s => String(s).trim());
    return acc.concat(cleaned);
  }, []);

  return res.status(200).json(new ApiResponse(200, { bus, bookedSeats }, "Bus retrieved"));
});

export const addBus = asyncHandler(async (req, res) => {
  const { source, sourceState, destination, destinationState, boardingPoints, droppingPoints } = req.body;
  await updateCityData(source, sourceState, boardingPoints, "source");
  await updateCityData(destination, destinationState, droppingPoints, "destination");
  
  const newBus = new Bus({ ...req.body });
  await newBus.save();
  
  return res.status(201).json(new ApiResponse(201, { bus: newBus }, "Bus added successfully!"));
});

export const getCityDetails = asyncHandler(async (req, res) => {
  const { cityName } = req.params;
  const city = await City.findOne({ name: { $regex: new RegExp(`^${cityName}$`, 'i') } });
  
  if (!city) throw new ApiError(404, "City not found");
  
  return res.status(200).json(new ApiResponse(200, city, "City details retrieved"));
});

export const searchBuses = asyncHandler(async (req, res) => {
  const { source, destination, date } = req.query;
  if (!source || !destination || !date) throw new ApiError(400, "Fields required");
  
  let query = {
      source: { $regex: new RegExp(`^${source}$`, "i") },
      destination: { $regex: new RegExp(`^${destination}$`, "i") }
  };
  
  if (date) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    query.availableDays = days[new Date(date).getDay()]; 
  }
  
  const buses = await Bus.find(query).sort({ departureTime: 1 });
  return res.status(200).json(new ApiResponse(200, buses, "Buses retrieved"));
});

export const getAllBuses = asyncHandler(async (req, res) => {
  const buses = await Bus.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, buses, "All buses retrieved"));
});

export const getPopularRoutes = asyncHandler(async (req, res) => {
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
    const fallbacks = fallbackBuses.map((bus) => ({
      busId: bus._id,
      busName: bus.busName,
      source: bus.source,
      destination: bus.destination,
      price: bus.price,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      bookings: 0,
    }));
    return res.status(200).json(new ApiResponse(200, fallbacks, "Popular routes retrieved"));
  }

  return res.status(200).json(new ApiResponse(200, popularRoutes, "Popular routes retrieved"));
});

export const deleteBus = asyncHandler(async (req, res) => {
  const deletedBus = await Bus.findByIdAndDelete(req.params.id);
  if (!deletedBus) throw new ApiError(404, "Bus not found");
  
  return res.status(200).json(new ApiResponse(200, null, "Bus removed"));
});

export const updateBus = asyncHandler(async (req, res) => {
  const { source, sourceState, destination, destinationState, boardingPoints, droppingPoints } = req.body;
  if (source) await updateCityData(source, sourceState, boardingPoints, "source");
  if (destination) await updateCityData(destination, destinationState, droppingPoints, "destination");
  
  const updatedBus = await Bus.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  
  return res.status(200).json(new ApiResponse(200, { bus: updatedBus }, "Updated bus successfully"));
});