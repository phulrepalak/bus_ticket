import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  busName: { 
    type: String, 
    required: true 
  },
  busNumber: { 
    type: String, 
    required: true, 
    unique: true // Ek bus number se do entries nahi ho sakti
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
  // Naya Field: Weekly Schedule ke liye
  availableDays: {
    type: [String], // ["Mon", "Tue", "Wed"...] format mein save hoga
    required: true
  },
  // Date field ko optional rakha hai kyunki ab hum Weekly Logic use kar rahe hain
  date: { 
    type: String, 
    default: "Daily" 
  },
  availableSeats: { 
    type: Number, 
    default: 30 
  },
  amenities: {
    type: [String], 
    default: ["Water Bottle", "Charging Point"]
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Bus = mongoose.model("Bus", busSchema);
export default Bus;