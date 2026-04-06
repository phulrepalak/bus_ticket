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
  comfortType: {
    type: String,
    required: true,
    enum: ["AC", "Non-AC"],
    default: "Non-AC"
  },
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
  sourceState: { 
    type: String, 
    required: true 
  },
  destination: { 
    type: String, 
    required: true 
  },
  destinationState: { 
    type: String, 
    required: true 
  },
  // --- Naye Fields: Boarding aur Dropping Points ---
  boardingPoints: [
    {
      location: { type: String, required: true },
      time: { type: String, required: true }
    }
  ],
  droppingPoints: [
    {
      location: { type: String, required: true },
      time: { type: String, required: true }
    }
  ],
  // -----------------------------------------------
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
  availableDays: {
    type: [String], 
    required: true
  },
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