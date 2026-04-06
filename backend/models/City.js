import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    index: true 
  },
  state: { 
    type: String, 
    required: true,
    trim: true
  },
  // Naye Fields: Jo points admin bus add karte waqt dalega wo yahan save honge
  boardingPoints: [
    {
      type: String,
      trim: true
    }
  ],
  droppingPoints: [
    {
      type: String,
      trim: true
    }
  ],
  isPopular: { 
    type: Boolean, 
    default: false // Agar koi city main hub hai (like Bhopal/Indore) toh ise true kar sakte hain
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Case-insensitive search ke liye index (optional par recommended)
citySchema.index({ name: 1 });

const City = mongoose.model("City", citySchema);
export default City;