import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, to, date } = location.state || {};
  
  const [allBuses, setAllBuses] = useState([]); 
  const [filteredBuses, setFilteredBuses] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [timeFilter, setTimeFilter] = useState(""); 
  const [typeFilters, setTypeFilters] = useState([]); 

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bus/search?source=${from}&destination=${to}&date=${date}`);
        const data = await res.json();
        const busData = Array.isArray(data) ? data : [];
        setAllBuses(busData);
        setFilteredBuses(busData);
      } catch (err) {
        console.error("Error fetching buses");
      } finally {
        setLoading(false);
      }
    };
    if (from && to) fetchBuses();
    else setLoading(false); // Stop loading if no search data
  }, [from, to, date]);

  useEffect(() => {
    let result = [...allBuses];
    if (timeFilter) {
      result = result.filter((bus) => {
        const hour = parseInt(bus.departureTime.split(":")[0]);
        if (timeFilter === "Morning") return hour >= 5 && hour < 12;
        if (timeFilter === "Afternoon") return hour >= 12 && hour < 17;
        if (timeFilter === "Evening") return hour >= 17 && hour < 21;
        if (timeFilter === "Night") return hour >= 21 || hour < 5;
        return true;
      });
    }
    if (typeFilters.length > 0) {
      result = result.filter((bus) => 
        typeFilters.includes(bus.comfortType) || typeFilters.includes(bus.seatType)
      );
    }
    setFilteredBuses(result);
  }, [timeFilter, typeFilters, allBuses]);

  const toggleTypeFilter = (filter) => {
    setTypeFilters(prev => 
      prev.includes(filter) ? prev.filter(t => t !== filter) : [...prev, filter]
    );
  };

  // SearchResults.jsx ke andar ye function check karein
const handleSelectSeat = (bus) => {
  // Hum navigate kar rahe hain aur sath mein bus ka poora data "state" mein bhej rahe hain
  navigate(`/select-seat/${bus._id}`, { 
    state: { 
      bus: bus, 
      date: date // Jo search bar se date aayi thi
    } 
  });
};
  return (
    <div className="min-h-screen bg-gray-100 pb-10 text-left">
      {/* Header Summary */}
      <div className="bg-white border-b p-6 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-left">
            <p className="text-xs text-orange-500 font-black uppercase tracking-widest mb-1">Active Search</p>
            {from && to ? (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-blue-900 capitalize">{from}</h2>
                <span className="text-gray-400">→</span>
                <h2 className="text-2xl font-black text-blue-900 capitalize">{to}</h2>
              </div>
            ) : (
              <h2 className="text-2xl font-black text-gray-300 italic">No Active Search</h2>
            )}
            <p className="text-gray-500 text-sm font-medium">📅 {date || "---"} • Premium Fleet</p>
          </div>
          <button 
            onClick={() => navigate("/", { state: { from, to, date } })} 
            className="bg-blue-900 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-md"
          >
            {from && to ? "Modify Search" : "Start New Search"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 p-6">
        
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-32 border border-gray-100">
            <h3 className="font-bold text-lg mb-6 border-b pb-2 text-blue-900">Refine Search</h3>
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Departure Time</p>
              <div className="grid grid-cols-2 gap-2">
                {["Morning", "Afternoon", "Evening", "Night"].map((time) => (
                  <button key={time} onClick={() => setTimeFilter(timeFilter === time ? "" : time)}
                    className={`p-2.5 border rounded-xl text-xs font-bold transition-all ${timeFilter === time ? 'bg-blue-900 text-white shadow-lg border-blue-900' : 'bg-white text-gray-600 hover:border-blue-400'}`}
                  > {time} </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Bus Type</p>
              <div className="flex flex-wrap gap-2">
                {["AC", "Non-AC", "Sleeper", "Seater"].map((cls) => (
                  <button key={cls} onClick={() => toggleTypeFilter(cls)}
                    className={`px-4 py-2 border rounded-full text-xs font-bold transition-all ${typeFilters.includes(cls) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'text-gray-600 hover:border-blue-400'}`}
                  > {cls} </button>
                ))}
              </div>
            </div>
            <button onClick={() => {setTimeFilter(""); setTypeFilters([]);}} className="mt-8 w-full py-2 text-xs text-blue-900 font-bold hover:bg-blue-50 rounded-lg transition-all">Clear All Filters</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-5">
          {!from || !to ? (
            /* PROFESSIONAL INITIAL STATE - REDIRECT TO HOME */
            <div className="bg-white p-16 rounded-[40px] text-center border-2 border-dashed border-blue-100 shadow-xl shadow-blue-900/5">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl animate-bounce">📍</span>
              </div>
              <h3 className="text-3xl font-black text-blue-900 mb-4">Ready to Travel?</h3>
              <p className="text-gray-500 max-w-md mx-auto font-medium leading-relaxed mb-8">
                It looks like you haven't selected a destination yet. Please head back to the <b>Home Page</b> to find the best available buses.
              </p>
              <button onClick={() => navigate("/")} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-orange-200 transition-all active:scale-95 mx-auto flex items-center gap-2">
                Go to Home Page →
              </button>
            </div>
          ) : loading ? (
            /* PROFESSIONAL SKELETON LOADER */
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 animate-pulse h-32"></div>
                ))}
            </div>
          ) : filteredBuses.length > 0 ? (
            filteredBuses.map((bus) => (
              <div key={bus._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group">
                <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="w-full md:w-1/4 text-left">
                    <h4 className="font-black text-xl text-blue-900 mb-1 group-hover:text-blue-600 transition-colors">{bus.busName}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[10px] bg-blue-50 px-2 py-1 rounded-md font-black text-blue-600 uppercase tracking-tighter">{bus.comfortType}</span>
                        <span className="text-[10px] bg-orange-50 px-2 py-1 rounded-md font-black text-orange-600 uppercase tracking-tighter">{bus.seatType}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold mt-3 tracking-widest">{bus.busNumber}</p>
                  </div>
                  <div className="flex items-center justify-between flex-1 px-8 w-full bg-gray-50/50 py-4 rounded-2xl border border-dashed border-gray-100">
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-800">{bus.departureTime}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase">{bus.source}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center px-4">
                      <span className="text-[9px] font-black text-blue-500 uppercase mb-1">Direct</span>
                      <div className="w-full h-[2px] bg-gray-200 relative">
                        <div className="absolute w-2 h-2 bg-blue-500 rounded-full top-[-3px] left-1/2 -translate-x-1/2 shadow-sm"></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-800">{bus.arrivalTime}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase">{bus.destination}</p>
                    </div>
                  </div>
                  <div className="w-full md:w-1/4 text-right md:border-l md:pl-8 border-gray-100">
                    <p className="text-3xl font-black text-blue-900">₹{bus.price}</p>
                    <p className="text-[11px] font-black text-green-600 mb-4 bg-green-50 inline-block px-2 py-0.5 rounded-md mt-1">{bus.availableSeats} Seats Left</p>
                    <button 
  onClick={() => handleSelectSeat(bus)} 
  className="w-full bg-orange-500 text-white py-3.5 rounded-2xl font-black hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-95"
>
  Select Seat
</button>
                  </div>
                </div>
                <div className="bg-gray-50/80 px-6 py-3 border-t flex flex-wrap gap-5 items-center">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Premium Amenities:</p>
                   {bus.amenities?.map((item, idx) => (
                     <span key={idx} className="text-[10px] font-black text-gray-500 flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-100">
                       <span className="text-blue-500">✦</span> {item}
                     </span>
                   ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-200 shadow-inner">
              <div className="text-7xl mb-6"></div>
              <h3 className="text-2xl font-black text-blue-900 mb-3"> No Buses Found</h3>
              <p className="text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
                We couldn't find any services matching your filters for <span className="text-blue-600 font-bold">{from} to {to}</span>.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <button onClick={() => navigate("/", { state: { from, to, date } })} className="bg-blue-900 text-white px-8 py-3 rounded-2xl font-black shadow-lg">Modify Search</button>
                <button onClick={() => {setTimeFilter(""); setTypeFilters([]);}} className="bg-gray-100 text-gray-600 px-8 py-3 rounded-2xl font-black">Reset Filters</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}