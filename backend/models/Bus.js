import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  busName: { 
    type: String, 
    required: true 
  },
  busNumber: { 
    type: String, 
    required: true, 
    unique: true // Ek bus number se do entry nahi ho sakti
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