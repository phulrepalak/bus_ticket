import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageBus = () => {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  const fetchBuses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bus/all");
      setBuses(res.data);
    } catch (err) {
      console.error("Data laane mein error:", err);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this bus from the fleet?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bus/delete/${id}`);
        fetchBuses();
      } catch (err) {
        alert("Delete karne mein dikkat aayi");
      }
    }
  };

  const handleEdit = (bus) => {
    navigate("/admin", { state: { editBus: bus } });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Fleet Assets Inventory
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Review and manage your active Vehicles.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest font-bold text-dark-600">Total Operational</span>
              <span className="text-xl font-black text-blue-800">{buses.length} Vehicles</span>
            </div>
          </div>
        </div>

        {/* Modern List Layout - Less "Boxy", More "List-Item" Feel */}
        <div className="space-y-4">
          {buses.map((bus) => (
            <div 
              key={bus._id} 
              className="group bg-white rounded-3xl p-2 pr-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col lg:flex-row lg:items-center gap-6"
            >
              {/* Bus Status Tag (The Vertical Bar look) */}
              <div className="lg:w-2 lg:h-20 bg-blue-600 rounded-full hidden lg:block ml-2"></div>

              {/* Main Info */}
              <div className="flex-1 px-4 lg:px-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {bus.busNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    bus.comfortType === 'AC' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {bus.comfortType}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">{bus.busName}</h3>
              </div>

              {/* Route Info */}
              <div className="flex-1 px-4 lg:px-0">
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">Route Connection</p>
                <div className="flex items-center gap-3">
                  <span className="text-slate-700 font-bold">{bus.source}</span>
                  <div className="flex-1 border-t-2 border-dashed border-blue-800 min-w-[30px] relative">
                     <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-blue-1000 text-lg">→</span>
                  </div>
                  <span className="text-slate-700 font-bold">{bus.destination}</span>
                </div>
              </div>

              {/* Price & Seats */}
              <div className="flex gap-8 px-4 lg:px-0">
                <div className="text-center">
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">Fare</p>
                  <p className="text-lg font-black text-slate-900">₹{bus.price}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">Capacity</p>
                  <p className="text-lg font-bold text-slate-700">{bus.availableSeats}</p>
                </div>
              </div>

              {/* Action Buttons - Modern Rounded Style */}
              <div className="flex gap-2 p-4 lg:p-0">
                <button 
                  onClick={() => handleEdit(bus)}
                  className="p-3 rounded-2xl bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-300 group-hover:shadow-md"
                  title="Modify Configuration"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleDelete(bus._id)}
                  className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 group-hover:shadow-md"
                  title="Decommission Vehicle"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageBus;