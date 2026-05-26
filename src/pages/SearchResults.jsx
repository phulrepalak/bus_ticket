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

  // Fetch match query parameters for fleet vehicles and geographical stop-points
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

  // Evaluate query filter parameters iteratively over datasets
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

  const handleSelectSeat = (bus) => {
    let formattedDate = date;
    
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
    <div className="min-h-screen bg-gray-100 pb-10 text-left antialiased">
      
      {/* Session Active Queries Header Panel */}
      <div className="bg-white border-b p-4 sm:p-6 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-left w-full md:w-auto">
            <p className="text-[10px] sm:text-xs text-orange-500 font-black uppercase tracking-widest mb-1">Active Search</p>
            {from && to ? (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-blue-900 capitalize break-words">{from}</h2>
                <span className="text-gray-400 font-bold">&rarr;</span>
                <h2 className="text-xl sm:text-2xl font-black text-blue-900 capitalize break-words">{to}</h2>
              </div>
            ) : (
              <h2 className="text-xl sm:text-2xl font-black text-gray-300 italic">No Active Search</h2>
            )}
            <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1">📅 {date || "---"} • Premium Fleet</p>
          </div>
          <button 
            type="button"
            onClick={() => navigate("/", { state: { from, to, date } })} 
            className="w-full md:w-auto text-center bg-blue-900 hover:bg-blue-800 text-white px-6 sm:px-8 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md active:scale-98 shrink-0"
          >
            {from && to ? "Modify Search" : "Start New Search"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 p-4 sm:p-6 w-full">
        
        {/* LEFT COLUMN: REFINEMENT FILTERS ENGINE */}
        <div className="col-span-1 w-full">
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm lg:sticky lg:top-32 border border-gray-100 max-h-none lg:max-h-[80vh] overflow-y-auto custom-scrollbar w-full">
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:text-blue-900 border-b pb-2">Refine Search</h3>
            
            <div className="mb-6">
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Departure Time</p>
              <div className="grid grid-cols-2 gap-2">
                {["Morning", "Afternoon", "Evening", "Night"].map((time) => (
                  <button key={time} type="button" onClick={() => setTimeFilter(timeFilter === time ? "" : time)}
                    className={`p-2.5 border rounded-xl text-[11px] sm:text-xs font-bold transition-all truncate ${timeFilter === time ? 'bg-blue-900 text-white shadow-lg border-blue-900' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'}`}
                  > {time} </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Bus Type</p>
              <div className="flex flex-wrap gap-2">
                {["AC", "Non-AC", "Sleeper", "Seater"].map((cls) => (
                  <button key={cls} type="button" onClick={() => toggleTypeFilter(cls)}
                    className={`px-3 sm:px-4 py-2 border rounded-full text-[11px] sm:text-xs font-bold transition-all truncate ${typeFilters.includes(cls) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'}`}
                  > {cls} </button>
                ))}
              </div>
            </div>

            <div className="mb-6 border-t pt-4">
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Boarding Point</p>
              <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                {availableBoardingPoints.map((point) => (
                  <label key={point} className="flex items-center gap-2.5 cursor-pointer group select-none">
                    <input type="checkbox" className="accent-blue-900 w-4 h-4 shrink-0 rounded" checked={boardingFilter.includes(point)} onChange={() => toggleBoardingFilter(point)} />
                    <span className="text-xs font-medium text-gray-600 group-hover:text-blue-900 break-words max-w-[85%]">{point}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6 border-t pt-4">
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Dropping Point</p>
              <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                {availableDroppingPoints.map((point) => (
                  <label key={point} className="flex items-center gap-2.5 cursor-pointer group select-none">
                    <input type="checkbox" className="accent-blue-900 w-4 h-4 shrink-0 rounded" checked={droppingFilter.includes(point)} onChange={() => toggleDroppingFilter(point)} />
                    <span className="text-xs font-medium text-gray-600 group-hover:text-blue-900 break-words max-w-[85%]">{point}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button type="button" onClick={() => {setTimeFilter(""); setTypeFilters([]); setBoardingFilter([]); setDroppingFilter([]);}} className="mt-4 w-full py-2.5 text-xs text-blue-900 font-bold bg-slate-50 hover:bg-blue-50 rounded-xl transition-all border border-slate-100">Clear All Filters</button>
          </div>
        </div>

        {/* RIGHT COLUMN: RENDER SCHEDULER CARDS LIST */}
        <div className="lg:col-span-3 space-y-5 w-full">
          {!from || !to ? (
            <div className="bg-white p-6 sm:p-16 rounded-[2rem] sm:rounded-[40px] text-center border-2 border-dashed border-blue-100 shadow-xl shadow-blue-900/5 w-full">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 select-none">
                <span className="text-3xl sm:text-5xl animate-bounce">📍</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-blue-900 mb-2 sm:mb-4">Ready to Travel?</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-xs sm:text-sm font-medium mb-6 sm:mb-8">It looks like you haven't selected a destination yet.</p>
              <button type="button" onClick={() => navigate("/")} className="bg-orange-500 text-white px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base shadow-lg mx-auto flex items-center gap-2 active:scale-98 transition-all">Go to Home Page →</button>
            </div>
          ) : loading ? (
            <div className="space-y-4 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 animate-pulse h-40 w-full"></div>
              ))}
            </div>
          ) : filteredBuses.length > 0 ? (
            filteredBuses.map((bus) => (
              <div key={bus._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all duration-300 group w-full">
                <div className="p-4 sm:p-6 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-5 lg:gap-6 w-full">
                  
                  {/* Vehicle Meta Core Details */}
                  <div className="w-full lg:w-1/4 text-left px-1">
                    <h4 className="font-black text-lg sm:text-xl text-blue-900 mb-1 group-hover:text-blue-600 transition-colors break-words">{bus.busName}</h4>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[9px] bg-blue-50 px-2 py-0.5 rounded font-black text-blue-600 uppercase tracking-tight">{bus.comfortType}</span>
                      <span className="text-[9px] bg-orange-50 px-2 py-0.5 rounded font-black text-orange-600 uppercase tracking-tight">{bus.seatType}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold mt-2.5 tracking-wider font-mono">{bus.busNumber}</p>
                  </div>
                  
                  {/* Travel Distance Timeline Segment */}
                  <div className="flex flex-row items-center justify-between flex-1 px-3 sm:px-6 md:px-8 w-full bg-gray-50/70 py-4 rounded-2xl border border-dashed border-gray-200">
                    <div className="text-left sm:text-center min-w-[70px]">
                      <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none">{bus.departureTime}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase mt-1.5 truncate max-w-[80px] sm:max-w-none">{bus.source}</p>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center px-2">
                      <span className="text-[9px] font-black text-blue-500 uppercase mb-1 tracking-wider select-none">Direct</span>
                      <div className="w-full h-[2px] bg-slate-200 relative">
                        <div className="absolute w-2 h-2 bg-blue-500 rounded-full top-[-3px] left-1/2 -translate-x-1/2 shadow-sm select-none"></div>
                      </div>
                    </div>
                    
                    <div className="text-right sm:text-center min-w-[70px]">
                      <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none">{bus.arrivalTime}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase mt-1.5 truncate max-w-[80px] sm:max-w-none">{bus.destination}</p>
                    </div>
                  </div>
                  
                  {/* Cost Analysis and Select Seat Redirects */}
                  <div className="w-full lg:w-1/4 text-left lg:text-right lg:border-l lg:pl-6 xl:pl-8 border-gray-100 px-1 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3">
                    <div className="text-left lg:text-right">
                      <p className="text-2xl sm:text-3xl font-black text-blue-900 tracking-tighter">₹{bus.price}</p>
                      <p className="text-[10px] font-black text-green-600 bg-green-50 inline-block px-2 py-0.5 rounded mt-0.5 whitespace-nowrap">{bus.availableSeats} Seats Left</p>
                    </div>
                    <button type="button" onClick={() => handleSelectSeat(bus)} className="w-1/2 lg:w-full bg-orange-500 text-white py-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-orange-600 shadow-md transition-all active:scale-95 text-center mt-0 lg:mt-3">Select Seat</button>
                  </div>

                </div>

                {/* Sub-panel Amenities Tray */}
                <div className="bg-gray-50/40 px-4 sm:px-6 py-3 border-t border-gray-100 flex flex-wrap gap-2.5 sm:gap-4 items-center">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider shrink-0 select-none">Amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {bus.amenities?.map((item, idx) => (
                      <span key={idx} className="text-[9px] font-bold text-gray-500 flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-200/60 whitespace-nowrap">
                        <span className="text-blue-500 font-bold select-none">✦</span> {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 sm:p-20 rounded-[2rem] sm:rounded-[40px] text-center border-2 border-dashed border-gray-200 shadow-inner w-full">
              <h3 className="text-xl sm:text-2xl font-black text-blue-900 mb-2">No Buses Found</h3>
              <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto font-medium leading-relaxed">Try changing your active filtration limits or resetting constraints parameters.</p>
              <button type="button" onClick={() => {setTimeFilter(""); setTypeFilters([]); setBoardingFilter([]); setDroppingFilter([]);}} className="mt-6 bg-blue-900 text-white px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-md active:scale-98 transition-all">Reset Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}