import React, { useState } from "react";

export default function AdminDashboard() {
  const [bus, setBus] = useState({
    busName: "",
    busNumber: "",
    source: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    date: "",
    availableSeats: 30
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert(" Bus added successfully!");
        // Form reset karein
        setBus({
          busName: "", busNumber: "", source: "", destination: "",
          departureTime: "", arrivalTime: "", price: "", date: "", availableSeats: 30
        });
      } else {
        alert(" Error: " + data.message);
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
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Add New Bus</h1>
          <p className="text-gray-500">Enter bus details to add it to the search results.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Bus Name */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Bus Name</label>
            <input type="text" placeholder="e.g. Verma Travels" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={bus.busName} onChange={e => setBus({...bus, busName: e.target.value})} required />
          </div>

          {/* Bus Number */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Bus Number</label>
            <input type="text" placeholder="e.g. MP-04-AB-1234" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={bus.busNumber} onChange={e => setBus({...bus, busNumber: e.target.value})} required />
          </div>

          {/* From */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Source (From)</label>
            <input type="text" placeholder="e.g. Harda" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={bus.source} onChange={e => setBus({...bus, source: e.target.value})} required />
          </div>

          {/* To */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Destination (To)</label>
            <input type="text" placeholder="e.g. Bhopal" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={bus.destination} onChange={e => setBus({...bus, destination: e.target.value})} required />
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Journey Date</label>
            <input type="date" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={bus.date} onChange={e => setBus({...bus, date: e.target.value})} required />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Ticket Price (₹)</label>
            <input type="number" placeholder="500" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={bus.price} onChange={e => setBus({...bus, price: e.target.value})} required />
          </div>

          {/* Departure Time */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Departure Time</label>
            <input type="time" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={bus.departureTime} onChange={e => setBus({...bus, departureTime: e.target.value})} required />
          </div>

          {/* Arrival Time */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Arrival Time</label>
            <input type="time" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={bus.arrivalTime} onChange={e => setBus({...bus, arrivalTime: e.target.value})} required />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`md:col-span-2 py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg mt-4 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? "Adding Bus..." : "Add Bus to Schedule"}
          </button>
        </form>
      </div>
    </div>
  );
}