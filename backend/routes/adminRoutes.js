import express from "express";
import { addBus, getAllBuses, deleteBus } from "../controllers/busController.js";
import City from "../models/City.js";

const router = express.Router();

// 1. Bus add karne ka route
router.post("/add-bus", addBus);

// 2. Cities ki list fetch karne ka route (Suggestions ke liye)
router.get("/cities", async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Saari buses get karne ka route
router.get("/all-buses", getAllBuses);

// 4. Bus delete karne ka route
router.delete("/delete-bus/:id", deleteBus);

export default router;