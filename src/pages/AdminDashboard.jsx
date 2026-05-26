import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editBus;

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
    amenities: ["Water Bottle", "Charging Point"],
    boardingPoints: [],
    droppingPoints: []
  });

  const [loading, setLoading] = useState(false);

  // Sync state data if opened in edit mode
  useEffect(() => {
    if (editData) {
      setBus({
        ...editData,
        boardingPoints: editData.boardingPoints || [],
        droppingPoints: editData.droppingPoints || []
      });
    }
  }, [editData]);

  // Handle live text inputs for city search and sync components
  const handleCityInput = (value, type) => {
    setBus(prev => ({ ...prev, [type]: value }));
    
    if (value.trim().length === 0) {
      setBus(prev => ({
        ...prev,
        [type === "source" ? "sourceState" : "destinationState"]: "",
        [type === "source" ? "boardingPoints" : "droppingPoints"]: []
      }));
      return;
    }

    if (value.trim().length >= 3) {
      fetchCityData(value, type);
    }
  };

  // Fetch boarding/dropping points and states dynamically from backend
  const fetchCityData = async (cityName, type) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/city-details/${cityName}`);
      if (response.ok) {
        const data = await response.json();
        
        setBus(prev => {
          if (type === "source") {
            const pointsFromDB = data.boardingPoints || [];
            return {
              ...prev,
              sourceState: data.state || "",
              boardingPoints: pointsFromDB.map(p => ({ location: p, time: "" }))
            };
          } else {
            const pointsFromDB = data.droppingPoints || [];
            return {
              ...prev,
              destinationState: data.state || "",
              droppingPoints: pointsFromDB.map(p => ({ location: p, time: "" }))
            };
          }
        });
      } else {
        setBus(prev => ({
          ...prev,
          [type === "source" ? "sourceState" : "destinationState"]: "",
          [type === "source" ? "boardingPoints" : "droppingPoints"]: []
        }));
      }
    } catch (error) {
      console.error("Error fetching city details:", error);
    }
  };

  const handleDayChange = (day) => {
    setBus(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleAmenityChange = (amenity) => {
    setBus(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const addManualPoint = (type) => {
    setBus(prev => ({
      ...prev,
      [type]: [...prev[type], { location: "", time: "" }]
    }));
  };

  const handlePointChange = (type, index, field, value) => {
    setBus(prev => {
      const updatedPoints = [...prev[type]];
      updatedPoints[index] = { ...updatedPoints[index], [field]: value };
      return { ...prev, [type]: updatedPoints };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bus.availableDays.length === 0) {
      alert("Please select at least one day!");
      return;
    }

    setLoading(true);
    const url = editData ? `http://localhost:5000/api/admin/update-bus/${editData._id}` : "http://localhost:5000/api/admin/add-bus";
    const method = editData ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bus),
      });
      
      if (res.ok) {
        alert(editData ? "Bus Updated!" : "Bus Added!");
        navigate("/manage-bus");
      } else {
        const data = await res.json();
        alert("Error: " + (data.message || "Failed to save"));
      }
    } catch (err) {
      alert("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-4 sm:p-8 w-full max-w-4xl">
        <div className="mb-6 sm:mb-8 border-b pb-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
            {editData ? "Edit Bus Details" : "Add New Bus Details"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Bus Name</label>
            <input type="text" className="p-3 border rounded-lg w-full" value={bus.busName} onChange={e => setBus({...bus, busName: e.target.value})} required />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Bus Number</label>
            <input type="text" className="p-3 border rounded-lg w-full" value={bus.busNumber} onChange={e => setBus({...bus, busNumber: e.target.value})} required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Comfort Type</label>
            <select className="p-3 border rounded-lg w-full bg-white" value={bus.comfortType} onChange={e => setBus({...bus, comfortType: e.target.value})}>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Seat Type</label>
            <select className="p-3 border rounded-lg w-full bg-white" value={bus.seatType} onChange={e => setBus({...bus, seatType: e.target.value})}>
              <option value="Seater">Seater</option>
              <option value="Sleeper">Sleeper</option>
              <option value="Semi-Sleeper">Semi-Sleeper</option>
            </select>
          </div>

          {/* Source Parameters Configuration */}
          <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg w-full">
            <label className="text-xs font-bold text-blue-600 uppercase">From (Source)</label>
            <input 
              type="text" 
              placeholder="City Name" 
              className="p-3 border rounded-lg w-full bg-white" 
              value={bus.source} 
              onChange={e => handleCityInput(e.target.value, "source")}
              required 
            />
            <input type="text" placeholder="State" className="p-2 border rounded-lg text-sm bg-white w-full" value={bus.sourceState} onChange={e => setBus({...bus, sourceState: e.target.value})} required />
          </div>

          {/* Destination Parameters Configuration */}
          <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg w-full">
            <label className="text-xs font-bold text-blue-600 uppercase">To (Destination)</label>
            <input 
              type="text" 
              placeholder="City Name" 
              className="p-3 border rounded-lg w-full bg-white" 
              value={bus.destination} 
              onChange={e => handleCityInput(e.target.value, "destination")}
              required 
            />
            <input type="text" placeholder="State" className="p-2 border rounded-lg text-sm bg-white w-full" value={bus.destinationState} onChange={e => setBus({...bus, destinationState: e.target.value})} required />
          </div>

          {/* Boarding Points Mapping Module */}
          <div className="md:col-span-1 bg-green-50 p-3 sm:p-4 rounded-xl border border-green-100 w-full">
            <div className="flex justify-between items-center mb-2 gap-2">
              <label className="text-xs font-bold text-green-700 uppercase">Boarding Points</label>
              <button type="button" onClick={() => addManualPoint("boardingPoints")} className="text-[10px] bg-green-600 text-white px-2 py-1 rounded shrink-0">+ Add</button>
            </div>
            {bus.boardingPoints.map((point, idx) => (
              <div key={idx} className="flex flex-col gap-1 mb-3 bg-white p-2 rounded shadow-sm w-full">
                <input 
                  type="text" 
                  placeholder="Location"
                  className="p-1.5 text-xs border rounded mb-1 w-full"
                  value={point.location}
                  onChange={(e) => handlePointChange("boardingPoints", idx, "location", e.target.value)}
                  required
                />
                <input 
                  type="time" 
                  className="p-1.5 text-xs border rounded outline-blue-500 w-full bg-white" 
                  value={point.time} 
                  onChange={(e) => handlePointChange("boardingPoints", idx, "time", e.target.value)} 
                  required 
                />
              </div>
            ))}
          </div>

          {/* Dropping Points Mapping Module */}
          <div className="md:col-span-1 bg-red-50 p-3 sm:p-4 rounded-xl border border-red-100 w-full">
            <div className="flex justify-between items-center mb-2 gap-2">
              <label className="text-xs font-bold text-red-700 uppercase">Dropping Points</label>
              <button type="button" onClick={() => addManualPoint("droppingPoints")} className="text-[10px] bg-red-600 text-white px-2 py-1 rounded shrink-0">+ Add</button>
            </div>
            {bus.droppingPoints.map((point, idx) => (
              <div key={idx} className="flex flex-col gap-1 mb-3 bg-white p-2 rounded shadow-sm w-full">
                <input 
                  type="text" 
                  placeholder="Location"
                  className="p-1.5 text-xs border rounded mb-1 w-full"
                  value={point.location}
                  onChange={(e) => handlePointChange("droppingPoints", idx, "location", e.target.value)}
                  required
                />
                <input 
                  type="time" 
                  className="p-1.5 text-xs border rounded outline-blue-500 w-full bg-white" 
                  value={point.time} 
                  onChange={(e) => handlePointChange("droppingPoints", idx, "time", e.target.value)} 
                  required 
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Ticket Price (₹)</label>
            <input type="number" className="p-3 border rounded-lg w-full" value={bus.price} onChange={e => setBus({...bus, price: e.target.value})} required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Total Seats</label>
            <input type="number" className="p-3 border rounded-lg w-full" value={bus.availableSeats} onChange={e => setBus({...bus, availableSeats: e.target.value})} required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Full Trip Departure</label>
            <input type="time" className="p-3 border rounded-lg w-full bg-white" value={bus.departureTime} onChange={e => setBus({...bus, departureTime: e.target.value})} required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Full Trip Arrival</label>
            <input type="time" className="p-3 border rounded-lg w-full bg-white" value={bus.arrivalTime} onChange={e => setBus({...bus, arrivalTime: e.target.value})} required />
          </div>

          {/* Schedule Calendar Matrix */}
          <div className="md:col-span-2 bg-blue-50 p-4 sm:p-5 rounded-2xl text-center w-full">
            <label className="text-sm font-bold text-blue-900 mb-3 block uppercase">Schedule Days</label>
            <div className="flex flex-wrap justify-center gap-2">
              {daysOfWeek.map((day) => (
                <button key={day} type="button" onClick={() => handleDayChange(day)}
                  className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-xl font-bold border-2 transition-colors ${bus.availableDays?.includes(day) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-400 border-gray-200"}`}>
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Onboard Amenities Selector Matrix */}
          <div className="md:col-span-2 bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200 w-full">
            <label className="text-sm font-bold text-gray-700 mb-3 block uppercase">Amenities</label>
            <div className="flex flex-wrap gap-2 justify-start sm:justify-items-start">
              {amenityOptions.map((item) => (
                <button key={item} type="button" onClick={() => handleAmenityChange(item)}
                  className={`px-3 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all ${bus.amenities?.includes(item) ? "bg-green-600 text-white border-green-600 shadow-md" : "bg-white text-gray-500 border-gray-300"}`}>
                  {bus.amenities?.includes(item) ? "✓ " : "+ "} {item}
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`md:col-span-2 py-4 mt-2 sm:mt-4 rounded-2xl text-white font-black text-lg sm:text-xl shadow-xl transition-all w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-98'}`}
          >
            {loading ? "Saving..." : (editData ? "Update Bus" : "Add Bus to Fleet")}
          </button>
        </form>
      </div>
    </div>
  );
}