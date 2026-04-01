import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  busName: { 
    type: String, 
    required: true 
  },
  busNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // Naya Field: AC ya Non-AC
  comfortType: {
    type: String,
    required: true,
    enum: ["AC", "Non-AC"],
    default: "Non-AC"
  },
  // Naya Field: Sleeper ya Seater
  seatType: {
    type: String,
    required: true,
    enum: ["Sleeper", "Seater", "Semi-Sleeper"],
    default: "Seater"
  },
  source: { 
    type: String, 
    required: true 
  },
  destination: { 
    type: String, 
    required: true 
  },
  departureTime: { 
    type: String, 
    required: true 
  },
  arrivalTime: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: String, // YYYY-MM-DD format mein save hoga
    required: true 
  },
  availableSeats: { 
    type: Number, 
    default: 30 
  },
  amenities: {
    type: [String], // Extra feature (AC, WiFi, etc.)
    default: ["Water Bottle", "Charging Point"]
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Model ko export karein
const Bus = mongoose.model("Bus", busSchema);
export default Bus;