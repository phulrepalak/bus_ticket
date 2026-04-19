import express from "express";
import { checkout } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/order", checkout);

export default router;
