import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editBus;

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Amenities ki list jo Admin select kar sakta hai
  const amenityOptions = ["Water Bottle", "Charging Point", "WiFi", "Blanket", "Pillow", "Reading Light", "CCTV", "Movies"];

  const [bus, setBus] = useState({
    busName: "",
    busNumber: "",
    comfortType: "Non-AC",
    seatType: "Seater",
    source: "",
    sourceState: "",
    destination: "",
    destinationState: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    availableSeats: 30,
    availableDays: [],
    amenities: ["Water Bottle", "Charging Point"] // Default values as per your model
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setBus(editData);
    }
  }, [editData]);

  const handleDayChange = (day) => {
    const updatedDays = bus.availableDays.includes(day)
      ? bus.availableDays.filter((d) => d !== day)
      : [...bus.availableDays, day];
    setBus({ ...bus, availableDays: updatedDays });
  };

  // Amenities selection logic
  const handleAmenityChange = (amenity) => {
    const updatedAmenities = bus.amenities.includes(amenity)
      ? bus.amenities.filter((a) => a !== amenity)
      : [...bus.amenities, amenity];
    setBus({ ...bus, amenities: updatedAmenities });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bus.availableDays.length === 0) {
      alert("Please select at least one day for the schedule!");
      return;
    }

    setLoading(true);

    // FIX: Sahi URLs aapke busRoutes.js ke hisaab se
    const url = editData 
      ? `http://localhost:5000/api/bus/update/${editData._id}` 
      : "http://localhost:5000/api/bus/add";
    
    const method = editData ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bus),
      });

      const data = await res.json();

      if (res.ok) {
        alert(editData ? "Bus Updated in Database!" : "Bus Added to Database!");
        navigate("/manage-bus");
      } else {
        // Backend se aane wala error message dikhayega
        alert("Server Error: " + (data.message || "Failed to save"));
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl">
        <div className="mb-8 border-b pb-4 text-center">
          <h1 className="text-3xl font-bold text-blue-700">
            {editData ? "Edit Bus Details" : "Add New Bus Details"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Basic Info */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Bus Name</label>
            <input type="text" className="p-3 border rounded-lg outline-none" value={bus.busName} onChange={e => setBus({...bus, busName: e.target.value})} required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Bus Number</label>
            <input type="text" className="p-3 border rounded-lg outline-none" value={bus.busNumber} onChange={e => setBus({...bus, busNumber: e.target.value})} required />
          </div>

          {/* Comfort & Seat */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Comfort Type</label>
            <select className="p-3 border rounded-lg bg-white" value={bus.comfortType} onChange={e => setBus({...bus, comfortType: e.target.value})}>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Seat Type</label>
            <select className="p-3 border rounded-lg bg-white" value={bus.seatType} onChange={e => setBus({...bus, seatType: e.target.value})}>
              <option value="Seater">Seater</option>
              <option value="Sleeper">Sleeper</option>
              <option value="Semi-Sleeper">Semi-Sleeper</option>
            </select>
          </div>

          {/* Source & Destination */}
          <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
            <label className="text-xs font-bold text-blue-600 uppercase">From (Source)</label>
            <input type="text" placeholder="City" className="p-3 border rounded-lg" value={bus.source} onChange={e => setBus({...bus, source: e.target.value})} required />
            <input type="text" placeholder="State" className="p-2 border rounded-lg text-sm" value={bus.sourceState} onChange={e => setBus({...bus, sourceState: e.target.value})} required />
          </div>

          <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
            <label className="text-xs font-bold text-blue-600 uppercase">To (Destination)</label>
            <input type="text" placeholder="City" className="p-3 border rounded-lg" value={bus.destination} onChange={e => setBus({...bus, destination: e.target.value})} required />
            <input type="text" placeholder="State" className="p-2 border rounded-lg text-sm" value={bus.destinationState} onChange={e => setBus({...bus, destinationState: e.target.value})} required />
          </div>

          {/* Price & Seats */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Ticket Price (₹)</label>
            <input type="number" className="p-3 border rounded-lg" value={bus.price} onChange={e => setBus({...bus, price: e.target.value})} required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Available Seats</label>
            <input type="number" className="p-3 border rounded-lg" value={bus.availableSeats} onChange={e => setBus({...bus, availableSeats: e.target.value})} required />
          </div>

          {/* Time */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Departure Time</label>
            <input type="time" className="p-3 border rounded-lg" value={bus.departureTime} onChange={e => setBus({...bus, departureTime: e.target.value})} required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600">Arrival Time</label>
            <input type="time" className="p-3 border rounded-lg" value={bus.arrivalTime} onChange={e => setBus({...bus, arrivalTime: e.target.value})} required />
          </div>

          <div className="md:col-span-2 bg-blue-50 p-5 rounded-2xl border border-blue-100 text-center">
            <label className="text-sm font-bold text-blue-900 mb-3 block uppercase tracking-wider">Schedule Days</label>
            <div className="flex flex-wrap justify-center gap-2">
              {daysOfWeek.map((day) => (
                <button key={day} type="button" onClick={() => handleDayChange(day)}
                  className={`px-5 py-2 rounded-xl font-bold border-2 ${bus.availableDays.includes(day) ? "bg-blue-600 text-white" : "bg-white text-gray-400"}`}>
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* AMENITIES SECTION */}
          <div className="md:col-span-2 bg-gray-50 p-5 rounded-2xl border border-gray-200">
            <label className="text-sm font-bold text-gray-700 mb-3 block uppercase tracking-wider">
                Amenities Provided
            </label>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAmenityChange(item)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                    bus.amenities.includes(item)
                      ? "bg-green-600 text-white border-green-600 shadow-md"
                      : "bg-white text-gray-500 border-gray-300 hover:border-green-400"
                  }`}
                >
                  {bus.amenities.includes(item) ? "✓ " : "+ "} {item}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`md:col-span-2 py-4 mt-4 rounded-2xl text-white font-black text-xl transition-all shadow-xl ${
              loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-200'
            }`}
          >
            {loading ? "Saving..." : "Add Bus to Fleet"}
          </button>
        </form>
      </div>
    </div>
  );
}