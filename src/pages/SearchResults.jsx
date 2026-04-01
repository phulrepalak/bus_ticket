import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, to, date } = location.state || {};
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        // Backend search API call
        const res = await fetch(`http://localhost:5000/api/bus/search?source=${from}&destination=${to}&date=${date}`);
        const data = await res.json();
        
        // Agar backend error message bhejta hai toh empty array set karein
        setBuses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching buses");
      } finally {
        setLoading(false);
      }
    };
    if (from && to) fetchBuses();
  }, [from, to, date]);

  // Seat Selection page par bhejane ke liye function
  const handleSelectSeat = (bus) => {
    navigate(`/select-seat/${bus._id}`, { state: { bus, date } });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* Top Header Summary */}
      <div className="bg-white border-b p-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-orange-500 font-bold uppercase tracking-wider">Active Search</p>
            <h2 className="text-2xl font-bold text-blue-900">{from || "Unknown"} to {to || "Unknown"}</h2>
            <p className="text-gray-500 text-sm font-medium">📅 {date || "N/A"} • 1 Passenger • Premium Fleet</p>
          </div>
          <button 
            onClick={() => navigate("/")} 
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition shadow-md"
          >
            Modify Search
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 p-6">
        
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm h-fit sticky top-24">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <span className="text-blue-600">≡</span> Refine Logistics
          </h3>
          
          <div className="mb-8 text-left">
            <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Departure Time</p>
            <div className="grid grid-cols-2 gap-2">
              {["Morning", "Afternoon", "Evening", "Night"].map((time) => (
                <button key={time} className={`p-3 border rounded-xl text-xs font-bold transition-all ${time === 'Afternoon' ? 'bg-blue-900 text-white' : 'text-gray-600 hover:border-blue-900'}`}>{time}</button>
              ))}
            </div>
          </div>

          <div className="mb-8 text-left">
            <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Vehicle Class</p>
            <div className="flex flex-wrap gap-2">
              {["AC", "Non-AC", "Sleeper", "Seater"].map((cls) => (
                <button key={cls} className={`px-4 py-2 border rounded-full text-xs font-bold transition-all ${cls === 'AC' || cls === 'Sleeper' ? 'bg-blue-900 text-white' : 'text-gray-600 hover:border-blue-900'}`}>{cls}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Bus List Section */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center mb-4 px-2">
            <p className="text-gray-600">Showing <span className="font-bold text-blue-700">{buses.length} services</span> found</p>
            <select className="bg-transparent font-bold text-sm outline-none cursor-pointer">
              <option>Sort By: Earliest First</option>
              <option>Sort By: Lowest Price</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
               <p className="mt-4 font-bold text-gray-500">Searching for premium buses...</p>
            </div>
          ) : buses.length > 0 ? (
            buses.map((bus) => (
              <div key={bus._id} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center border hover:border-blue-300 hover:shadow-md transition-all">
                
                {/* Operator Info */}
                <div className="flex gap-4 items-start w-full md:w-1/3">
                  <div className="bg-blue-100 p-3 rounded-xl text-blue-600 font-bold text-xl">🚌</div>
                  <div className="text-left">
                    <h4 className="font-bold text-lg text-blue-900 leading-tight">{bus.busName}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">{bus.busNumber}</p>
                    <div className="mt-2 flex items-center gap-1">
                       <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">★ 4.8</span>
                    </div>
                  </div>
                </div>

                {/* Route Info */}
                <div className="flex items-center gap-6 w-full md:w-1/3 justify-center py-6 md:py-0">
                  <div className="text-center">
                    <p className="text-xl font-black text-gray-800">{bus.departureTime}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase truncate w-20">{bus.source}</p>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1 max-w-[100px]">
                    <p className="text-[10px] font-bold text-gray-400 mb-1">DIRECT</p>
                    <div className="w-full h-[2px] bg-gray-200 relative">
                      <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xl font-black text-gray-800">{bus.arrivalTime}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase truncate w-20">{bus.destination}</p>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="text-right w-full md:w-1/4 border-t md:border-t-0 pt-4 md:pt-0">
                  <p className="text-xs font-bold text-gray-400">Starting from</p>
                  <p className="text-2xl font-black text-blue-900">₹{bus.price.toLocaleString('en-IN')}</p>
                  <button 
                    onClick={() => handleSelectSeat(bus)}
                    className="mt-3 bg-orange-500 hover:bg-orange-600 text-white w-full py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95"
                  >
                    Select Seat
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-16 rounded-3xl text-center shadow-sm border border-dashed border-gray-300">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800">No Buses Found</h3>
              <p className="text-gray-500 mt-2">Try changing the date or cities for more options.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}