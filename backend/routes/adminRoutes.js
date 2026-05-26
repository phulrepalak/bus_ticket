import express from "express";
import {
  addBus,
  getAllBuses,
  deleteBus,
  getCityDetails,
  updateBus
} from "../controllers/busController.js";
import City from "../models/City.js";
import { getBusOccupancyReport } from "../controllers/adminController.js";

const router = express.Router();

router.post("/add-bus", addBus);

router.get("/city-details/:cityName", getCityDetails);

router.get("/cities", async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all-buses", getAllBuses);

router.put("/update-bus/:id", updateBus);

router.delete("/delete-bus/:id", deleteBus);

router.get("/bus-occupancy", getBusOccupancyReport);

export default router;