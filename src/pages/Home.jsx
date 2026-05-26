import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const heroImage =
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [from, setFrom] = useState(location.state?.from || "");
  const [to, setTo] = useState(location.state?.to || "");
  const [date, setDate] = useState(location.state?.date || "");
  
  const [cities, setCities] = useState([]); 
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  // Fetch verified cities and popular destination logs from endpoint repository
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/cities");
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Cities fetch error:", error);
      }
    };

    const fetchPopularRoutes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bus/popular");
        const data = await response.json();
        setPopularRoutes(data);
      } catch (error) {
        console.error("Popular routes fetch error:", error);
      }
    };

    fetchCities();
    fetchPopularRoutes();
  }, []);

  const handleFromChange = (value) => {
    setFrom(value);
    if (value.trim().length > 0) {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );
      setFromSuggestions(filtered);
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToChange = (value) => {
    setTo(value);
    if (value.trim().length > 0) {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );
      setToSuggestions(filtered);
    } else {
      setToSuggestions([]);
    }
  };

  const handleSwap = () => {
    const tempFrom = from;
    setFrom(to);
    setTo(tempFrom);
  };

  // Enforce field parameters validation before navigating to search layout
  const handleSearch = () => {
    if (!from || !to || !date) {
      alert("Please fill all fields");
      return;
    }
    const cleanFrom = from.split(",")[0].trim();
    const cleanTo = to.split(",")[0].trim();
    navigate(`/search`, { state: { from: cleanFrom, to: cleanTo, date } });
  };

  const handleRouteClick = (source, destination) => {
    const selectedDate = date || today;
    navigate(`/search`, { state: { from: source, to: destination, date: selectedDate } });
  };

  return (
    <div className="w-full overflow-x-hidden antialiased">
      
      {/* HERO SECTION CONTAINER */}
      <div
        className="min-h-[100vh] md:h-[95vh] bg-cover bg-center flex items-center justify-center text-white relative py-12 md:py-0"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center w-full px-4 max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Book Your <span className="text-orange-400">Bus</span> Easily
          </h1>
          
          {/* COMPOSITE SEARCH CONTROL BAR */}
          <div className="mt-8 md:mt-12 flex justify-center w-full">
            <div className="bg-white rounded-3xl md:rounded-2xl shadow-2xl p-4 sm:p-5 md:px-6 md:py-5 w-[95%] sm:w-[90%] lg:w-[85%] xl:w-[75%] flex flex-col md:flex-row items-stretch md:items-center relative gap-4 md:gap-0">
              
              {/* SOURCE PARAMETER INPUT */}
              <div className="w-full md:w-1/3 text-left px-1 md:px-2 relative flex items-center border-b md:border-b-0 pb-3 md:pb-0 border-gray-100">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">From</p>
                  <input
                    list="from-list"
                    type="text"
                    placeholder="Source City"
                    value={from}
                    onChange={(e) => handleFromChange(e.target.value)}
                    className="w-full outline-none text-gray-800 font-semibold pr-12 bg-transparent text-sm sm:text-base mt-0.5"
                    autoComplete="off"
                  />
                </div>

                {/* SWAP TOGGLE SYSTEM */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
                  <button 
                    type="button"
                    onClick={handleSwap}
                    className="bg-white p-2 rounded-full hover:bg-gray-100 transition-all active:scale-95 shadow-md border border-gray-200 flex items-center justify-center"
                    title="Swap Cities"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f97316" viewBox="0 0 16 16" className="rotate-90 md:rotate-0 transition-transform duration-300">
                      <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
                    </svg>
                  </button>
                </div>

                <datalist id="from-list">
                  {fromSuggestions.map((city) => (
                    <option key={city._id} value={`${city.name}, ${city.state}`} />
                  ))}
                </datalist>
              </div>

              {/* DESTINATION PARAMETER INPUT */}
              <div className="w-full md:w-1/3 text-left px-1 md:px-2 md:ml-4 border-b md:border-b-0 pb-3 md:pb-0 border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">To</p>
                <input
                  list="to-list"
                  type="text"
                  placeholder="Destination City"
                  value={to}
                  onChange={(e) => handleToChange(e.target.value)}
                  className="w-full outline-none text-gray-800 font-semibold text-sm sm:text-base mt-0.5"
                  autoComplete="off"
                />
                <datalist id="to-list">
                  {toSuggestions.map((city) => (
                    <option key={city._id} value={`${city.name}, ${city.state}`} />
                  ))}
                </datalist>
              </div>

              {/* TRAVEL DATE INPUT */}
              <div className="w-full md:w-1/4 text-left px-1 md:px-2 md:border-l border-gray-200 mt-1 md:mt-0 pb-2 md:pb-0">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full outline-none text-gray-800 font-semibold bg-transparent text-sm sm:text-base mt-0.5 cursor-pointer block"
                />
              </div>

              {/* ACTION EXECUTION BUTTON */}
              <button 
                type="button"
                onClick={handleSearch}
                className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl md:rounded-xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg whitespace-nowrap mt-2 md:mt-0 md:ml-4 active:scale-98 text-center shrink-0"
              >
                Search Buses
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* THREE STEPS PROCESS MARKETING BLOCK */}
      <div className="bg-slate-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs sm:text-sm uppercase tracking-[0.32em] text-sky-600 font-black">
              Quick & Easy Booking
            </p>
            <h2 className="mt-3 text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Bus ticket booking in 3 simple steps
            </h2>
            <h3 className="mt-3 text-slate-500 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
              Search routes, pick your seat, and checkout with confidence. Everything is designed to make your travel booking fast and smooth.
            </h3>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 mb-5 sm:mb-6 select-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Search your route</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Enter your source, destination and travel date to find the best buses available for your journey.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-5 sm:mb-6 select-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 10h16"/><path d="M4 14h9"/><path d="M4 18h12"/></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Select your seat</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Choose the perfect seat with real-time availability and clear fare details before you book.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-5 sm:mb-6 select-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pay securely</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Complete your booking with a secure payment flow and receive instant confirmation on your email.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PLATFORM BENEFITS AND POPULAR PATHWAYS ARCHITECTURE */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 items-start w-full">
            
            {/* Features Listing Frame */}
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs sm:text-sm uppercase tracking-[0.32em] text-orange-500 font-black">
                Why choose GoBus?
              </p>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Everything you need for a smooth bus journey
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                Book fast, travel comfortably, and manage your trips easily with our smart bus booking experience. We make every journey simple and reliable.
              </p>

              <div className="mt-8 space-y-6 w-full">
                <div className="flex gap-4 items-start">
                  <div className="rounded-2xl bg-slate-50 p-3 sm:p-4 text-orange-500 font-black text-xl select-none shrink-0">
                    01
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Flexible cancellation</h3>
                    <p className="text-slate-600 text-sm sm:text-base mt-1 leading-relaxed">
                      Change your plans without stress with easy cancellation and refund support.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="rounded-2xl bg-slate-50 p-3 sm:p-4 text-orange-500 font-black text-xl select-none shrink-0">
                    02
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Live seat selection</h3>
                    <p className="text-slate-600 text-sm sm:text-base mt-1 leading-relaxed">
                      Pick your favorite seat from the live layout and see availability instantly.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="rounded-2xl bg-slate-50 p-3 sm:p-4 text-orange-500 font-black text-xl select-none shrink-0">
                    03
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Secure payments</h3>
                    <p className="text-slate-600 text-sm sm:text-base mt-1 leading-relaxed">
                      Pay safely with multiple options and get instant booking confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Route Display Roster Card */}
            <div className="lg:col-span-5 rounded-[2rem] border border-slate-200 bg-slate-50 p-4 sm:p-6 shadow-sm w-full">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-5 tracking-tight">Popular routes today</h3>
              <div className="space-y-4 w-full">
                {popularRoutes.length > 0 ? (
                  popularRoutes.map((route) => (
                    <div
                      key={route.busId}
                      onClick={() => handleRouteClick(route.source, route.destination)}
                      className="rounded-2xl bg-white p-4 border border-slate-200/80 cursor-pointer transition-all hover:shadow-md hover:bg-slate-50/50 w-full"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-base sm:text-lg font-bold text-slate-900 truncate">{route.source} → {route.destination}</p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">{route.busName} • {route.bookings} bookings</p>
                        </div>
                        <span className="rounded-xl bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600 shrink-0">₹{route.price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-white p-5 border border-slate-200 text-slate-400 text-sm font-semibold text-center animate-pulse">
                    Loading popular routes...
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;