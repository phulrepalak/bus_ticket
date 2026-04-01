import React, { useState } from "react";

export default function AdminDashboard() {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const [bus, setBus] = useState({
    busName: "",
    busNumber: "",
    source: "",
    sourceState: "",
    destination: "",
    destinationState: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    availableSeats: 30,
    availableDays: [] // Dinon ko store karne ke liye
  });

  const [loading, setLoading] = useState(false);

  // Checkbox (Day) toggle logic
  const handleDayChange = (day) => {
    const updatedDays = bus.availableDays.includes(day)
      ? bus.availableDays.filter((d) => d !== day)
      : [...bus.availableDays, day];
    setBus({ ...bus, availableDays: updatedDays });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Kam se kam ek din select hona chahiye
    if (bus.availableDays.length === 0) {
      alert("Please select at least one day for the schedule!");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/admin/add-bus", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(bus),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Bus Weekly Schedule added successfully!");
        // Form Reset
        setBus({
          busName: "", busNumber: "", source: "", sourceState: "",
          destination: "", destinationState: "", departureTime: "",
          arrivalTime: "", price: "", availableSeats: 30, availableDays: []
        });
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-blue-700">Add Weekly Schedule</h1>
          <p className="text-gray-500">Define the routes and days this bus will operate.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Bus Info */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Bus Name</label>
            <input type="text" placeholder="e.g. Verma Travels" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={bus.busName} onChange={e => setBus({...bus, busName: e.target.value})} required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Bus Number</label>
            <input type="text" placeholder="e.g. MP-04-AB-1234" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={bus.busNumber} onChange={e => setBus({...bus, busNumber: e.target.value})} required />
          </div>

          {/* Source Section */}
          <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">From (Source)</label>
            <input 
              type="text" placeholder="City Name" 
              className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400" 
              value={bus.source} onChange={e => setBus({...bus, source: e.target.value})} required 
            />
            <input 
              type="text" placeholder="State Name" 
              className="p-2 border rounded-lg text-sm bg-white outline-none focus:border-blue-400" 
              value={bus.sourceState} onChange={e => setBus({...bus, sourceState: e.target.value})} required 
            />
          </div>

          {/* Destination Section */}
          <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">To (Destination)</label>
            <input 
              type="text" placeholder="City Name" 
              className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400" 
              value={bus.destination} onChange={e => setBus({...bus, destination: e.target.value})} required 
            />
            <input 
              type="text" placeholder="State Name" 
              className="p-2 border rounded-lg text-sm bg-white outline-none focus:border-blue-400" 
              value={bus.destinationState} onChange={e => setBus({...bus, destinationState: e.target.value})} required 
            />
          </div>

          {/* AVAILABLE DAYS SECTION */}
          <div className="md:col-span-2 bg-blue-50 p-5 rounded-2xl border border-blue-100">
            <label className="text-sm font-bold text-blue-900 mb-4 block uppercase tracking-wider text-center">
              📅 Select Running Days (Weekly Schedule)
            </label>
            <div className="flex flex-wrap justify-center gap-3">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayChange(day)}
                  className={`px-6 py-2.5 rounded-xl font-black transition-all duration-200 border-2 ${
                    bus.availableDays.includes(day)
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                      : "bg-white text-gray-400 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Timing & Price */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Departure Time</label>
            <input type="time" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={bus.departureTime} onChange={e => setBus({...bus, departureTime: e.target.value})} required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Arrival Time</label>
            <input type="time" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={bus.arrivalTime} onChange={e => setBus({...bus, arrivalTime: e.target.value})} required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Ticket Price (₹)</label>
            <input type="number" placeholder="e.g. 750" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={bus.price} onChange={e => setBus({...bus, price: e.target.value})} required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Total Seats</label>
            <input type="number" className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={bus.availableSeats} onChange={e => setBus({...bus, availableSeats: e.target.value})} required />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`md:col-span-2 py-4 mt-4 rounded-2xl text-white font-black text-xl transition-all shadow-xl ${
              loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-200'
            }`}
          >
            {loading ? "Syncing Schedule..." : "Confirm & Save Schedule"}
          </button>
        </form>
      </div>
    </div>
  );
}