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
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const router = express.Router();

router.get("/all", getAllBuses);

router.get("/points", asyncHandler(async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    throw new ApiError(400, "From and To cities are required.");
  }
  const sourceCity = await City.findOne({ 
    name: { $regex: new RegExp(`^${from}$`, "i") } 
  });
  const destCity = await City.findOne({ 
    name: { $regex: new RegExp(`^${to}$`, "i") } 
  });
  return res.status(200).json(new ApiResponse(200, {
    boardingPoints: sourceCity ? sourceCity.boardingPoints : [],
    droppingPoints: destCity ? destCity.droppingPoints : []
  }, "Points retrieved"));
}));

router.get("/search", asyncHandler(async (req, res) => {
  const { source, destination, date } = req.query;
  if (!source || !destination || !date) {
    throw new ApiError(400, "Source, destination, and date are required.");
  }
  const selectedDate = new Date(date);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = days[selectedDate.getDay()];

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
    
    query.departureTime = { $gt: currentTimeString };
  }

  const buses = await Bus.find(query).sort({ departureTime: 1 });
  return res.status(200).json(new ApiResponse(200, buses, "Buses retrieved"));
}));

router.get("/popular", getPopularRoutes);
router.get("/:id", getBusById); 
router.post("/add", addBus);
router.put("/update/:id", updateBus);
router.delete("/delete/:id", deleteBus);

export default router;