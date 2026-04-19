import express from "express";
import { 
  addBus, 
  getAllBuses, 
  deleteBus, 
  getCityDetails, 
  updateBus 
} from "../controllers/busController.js";
import City from "../models/City.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = express.Router();

router.post("/add-bus", addBus);
router.get("/city-details/:cityName", getCityDetails);

router.get("/cities", asyncHandler(async (req, res) => {
  const cities = await City.find().sort({ name: 1 });
  return res.status(200).json(new ApiResponse(200, cities, "Cities retrieved"));
}));

router.get("/all-buses", getAllBuses);
router.put("/update-bus/:id", updateBus);
router.delete("/delete-bus/:id", deleteBus);

export default router;