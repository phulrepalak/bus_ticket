import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageBus = () => {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();

  // Fetch all active fleet buses from database
  const fetchBuses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bus/all");
      setBuses(res.data);
    } catch (err) {
      console.error("Error fetching fleet data:", err);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // Remove targeted bus from fleet roster
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this bus from the fleet?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bus/delete/${id}`);
        fetchBuses();
      } catch (err) {
        alert("Failed to decommission the vehicle.");
      }
    }
  };

  // Route back to operational control interface with context mapping payloads
  const handleEdit = (bus) => {
    navigate("/admin", { state: { editBus: bus } });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-8 antialiased">
      <div className="max-w-7xl mx-auto">
        
        {/* Dynamic Analytics Header Grid Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Fleet Assets Inventory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Review and manage your active Vehicles.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex flex-col items-start sm:items-end">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-slate-400">Total Operational</span>
              <span className="text-lg sm:text-xl font-black text-blue-800">{buses.length} Vehicles</span>
            </div>
          </div>
        </div>

        {/* Fleet Asset Roster Stacking Area */}
        <div className="space-y-4 w-full">
          {buses.map((bus) => (
            <div 
              key={bus._id} 
              className="group bg-white rounded-3xl p-4 lg:p-2 lg:pr-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 w-full"
            >
              {/* Asset Alignment Marker Side Panel */}
              <div className="lg:w-2 lg:h-20 bg-blue-600 rounded-full hidden lg:block ml-2 shrink-0"></div>

              {/* Primary Identity Segment */}
              <div className="w-full lg:flex-1 px-1 lg:px-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="bg-slate-100 text-slate-600 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider whitespace-nowrap">
                    {bus.busNumber}
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider whitespace-nowrap ${
                    bus.comfortType === 'AC' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {bus.comfortType}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight break-words">{bus.busName}</h3>
              </div>

              {/* Route Connection Layout Map */}
              <div className="w-full lg:flex-1 px-1 lg:px-0 border-t lg:border-t-0 border-slate-50 pt-3 lg:pt-0">
                <p className="text-[9px] sm:text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1.5">Route Connection</p>
                <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                  <span className="text-sm sm:text-base text-slate-700 font-bold truncate">{bus.source}</span>
                  <div className="flex-1 border-t-2 border-dashed border-blue-200 min-w-[24px] relative mx-1">
                     <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-blue-400 text-base select-none">→</span>
                  </div>
                  <span className="text-sm sm:text-base text-slate-700 font-bold truncate">{bus.destination}</span>
                </div>
              </div>

              {/* Capacity and Pricing Diagnostics Blocks */}
              <div className="flex gap-6 sm:gap-8 px-1 lg:px-0 border-t lg:border-t-0 border-slate-50 pt-3 lg:pt-0 w-full lg:w-auto">
                <div className="text-left lg:text-center min-w-[60px]">
                  <p className="text-[9px] sm:text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">Fare</p>
                  <p className="text-base sm:text-lg font-black text-slate-900">₹{bus.price}</p>
                </div>
                <div className="text-left lg:text-center min-w-[60px]">
                  <p className="text-[9px] sm:text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">Capacity</p>
                  <p className="text-base sm:text-lg font-bold text-slate-700">{bus.availableSeats}</p>
                </div>
              </div>

              {/* Configuration Action Trigger Systems */}
              <div className="flex gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-50 w-full lg:w-auto justify-end">
                <button 
                  type="button"
                  onClick={() => handleEdit(bus)}
                  className="p-3 rounded-2xl bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-300 group-hover:shadow-md shrink-0 active:scale-95"
                  title="Modify Configuration"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button 
                  type="button"
                  onClick={() => handleDelete(bus._id)}
                  className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 group-hover:shadow-md shrink-0 active:scale-95"
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