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
  
  const [boardingFilter, setBoardingFilter] = useState([]);
  const [droppingFilter, setDroppingFilter] = useState([]);
  const [availableBoardingPoints, setAvailableBoardingPoints] = useState([]);
  const [availableDroppingPoints, setAvailableDroppingPoints] = useState([]);

  useEffect(() => {
    const fetchBusesAndPoints = async () => {
      try {
        setLoading(true);
        const busRes = await fetch(`http://localhost:5000/api/bus/search?source=${from}&destination=${to}&date=${date}`);
        const busData = await busRes.json();
        const buses = Array.isArray(busData) ? busData : [];
        setAllBuses(buses);
        setFilteredBuses(buses);

        const pointsRes = await fetch(`http://localhost:5000/api/bus/points?from=${from}&to=${to}`);
        const pointsData = await pointsRes.json();
        setAvailableBoardingPoints(pointsData.boardingPoints || []);
        setAvailableDroppingPoints(pointsData.droppingPoints || []);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (from && to) fetchBusesAndPoints();
    else setLoading(false);
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

    if (boardingFilter.length > 0) {
      result = result.filter((bus) => 
        bus.boardingPoints?.some(p => boardingFilter.includes(p.location))
      );
    }

    if (droppingFilter.length > 0) {
      result = result.filter((bus) => 
        bus.droppingPoints?.some(p => droppingFilter.includes(p.location))
      );
    }

    setFilteredBuses(result);
  }, [timeFilter, typeFilters, boardingFilter, droppingFilter, allBuses]);

  const toggleTypeFilter = (filter) => {
    setTypeFilters(prev => 
      prev.includes(filter) ? prev.filter(t => t !== filter) : [...prev, filter]
    );
  };

  const toggleBoardingFilter = (point) => {
    setBoardingFilter(prev => 
      prev.includes(point) ? prev.filter(p => p !== point) : [...prev, point]
    );
  };

  const toggleDroppingFilter = (point) => {
    setDroppingFilter(prev => 
      prev.includes(point) ? prev.filter(p => p !== point) : [...prev, point]
    );
  };

  // --- UPDATED handleSelectSeat Logic ---
  const handleSelectSeat = (bus) => {
    let formattedDate = date;
    
    // Date ko hamesha YYYY-MM-DD string mein convert karke bhej rahe hain
    if (date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }

    navigate(`/select-seat/${bus._id}`, { 
      state: { 
        bus, 
        date: formattedDate, 
        boardingFilter, 
        droppingFilter  
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10 text-left">
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
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-32 border border-gray-100 max-h-[80vh] overflow-y-auto custom-scrollbar">
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
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Bus Type</p>
              <div className="flex flex-wrap gap-2">
                {["AC", "Non-AC", "Sleeper", "Seater"].map((cls) => (
                  <button key={cls} onClick={() => toggleTypeFilter(cls)}
                    className={`px-4 py-2 border rounded-full text-xs font-bold transition-all ${typeFilters.includes(cls) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'text-gray-600 hover:border-blue-400'}`}
                  > {cls} </button>
                ))}
              </div>
            </div>
            <div className="mb-8 border-t pt-4">
              <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Boarding Point</p>
              <div className="space-y-2">
                {availableBoardingPoints.map((point) => (
                  <label key={point} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="accent-blue-900 w-4 h-4" checked={boardingFilter.includes(point)} onChange={() => toggleBoardingFilter(point)} />
                    <span className="text-xs font-medium text-gray-600 group-hover:text-blue-900">{point}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-8 border-t pt-4">
              <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Dropping Point</p>
              <div className="space-y-2">
                {availableDroppingPoints.map((point) => (
                  <label key={point} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="accent-blue-900 w-4 h-4" checked={droppingFilter.includes(point)} onChange={() => toggleDroppingFilter(point)} />
                    <span className="text-xs font-medium text-gray-600 group-hover:text-blue-900">{point}</span>
                  </label>
                ))}
              </div>
            </div>
            <button onClick={() => {setTimeFilter(""); setTypeFilters([]); setBoardingFilter([]); setDroppingFilter([]);}} className="mt-8 w-full py-2 text-xs text-blue-900 font-bold hover:bg-blue-50 rounded-lg transition-all">Clear All Filters</button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-5">
          {!from || !to ? (
            <div className="bg-white p-16 rounded-[40px] text-center border-2 border-dashed border-blue-100 shadow-xl shadow-blue-900/5">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl animate-bounce">📍</span>
              </div>
              <h3 className="text-3xl font-black text-blue-900 mb-4">Ready to Travel?</h3>
              <p className="text-gray-500 max-w-md mx-auto font-medium mb-8">It looks like you haven't selected a destination yet.</p>
              <button onClick={() => navigate("/")} className="bg-orange-500 text-white px-10 py-4 rounded-2xl font-black shadow-lg mx-auto flex items-center gap-2">Go to Home Page →</button>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 animate-pulse h-32"></div>
              ))}
            </div>
          ) : filteredBuses.length > 0 ? (
            filteredBuses.map((bus) => (
              <div key={bus._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
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
                    <button onClick={() => handleSelectSeat(bus)} className="w-full bg-orange-500 text-white py-3.5 rounded-2xl font-black hover:bg-orange-600 shadow-lg transition-all active:scale-95">Select Seat</button>
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
              <h3 className="text-2xl font-black text-blue-900 mb-3">No Buses Found</h3>
              <p className="text-gray-500 max-w-sm mx-auto font-medium">Try changing your filters.</p>
              <button onClick={() => {setTimeFilter(""); setTypeFilters([]); setBoardingFilter([]); setDroppingFilter([]);}} className="mt-8 bg-blue-900 text-white px-8 py-3 rounded-2xl font-black">Reset Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}