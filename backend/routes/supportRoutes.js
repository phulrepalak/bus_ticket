import express from "express";
import { sendSupportTicket } from "../controllers/supportController.js";

const router = express.Router();

router.post("/raise-ticket", sendSupportTicket);

export default router;