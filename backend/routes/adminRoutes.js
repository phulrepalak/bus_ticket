import express from "express";
import { 
  addBus, 
  getAllBuses, 
  deleteBus, 
  getCityDetails, 
  updateBus 
} from "../controllers/busController.js";
import City from "../models/City.js";

const router = express.Router();

// 1. Bus add karne ka route
router.post("/add-bus", addBus);

// 2. City details fetch karne ka route (Auto-fill points feature ke liye)
// Frontend call: axios.get(`http://localhost:5000/api/admin/city-details/${cityName}`)
router.get("/city-details/:cityName", getCityDetails);

// 3. Cities ki list fetch karne ka route (Datalist suggestions ke liye)
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

// 5. Bus update/edit karne ka route
router.put("/update-bus/:id", updateBus);

// 6. Bus delete karne ka route
router.delete("/delete-bus/:id", deleteBus);

export default router;