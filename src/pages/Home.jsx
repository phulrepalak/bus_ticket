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
    <div>
      <div
        className="h-[95vh] bg-cover bg-center flex items-center justify-center text-white relative"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center w-full px-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            Book Your <span className="text-orange-400">Bus</span> Easily
          </h1>
          <div className="mt-12 flex justify-center w-full">
            <div className="bg-white rounded-2xl shadow-2xl px-4 py-4 md:px-6 md:py-5 w-[95%] md:w-[90%] lg:w-[75%] flex flex-col md:flex-row items-center relative">
              
              {/* FROM INPUT (Source field with Swap Arrow inside) */}
              <div className="w-full md:w-1/3 text-left px-2 relative flex items-center">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-bold uppercase">From</p>
                  <input
                    list="from-list"
                    type="text"
                    placeholder="Source"
                    value={from}
                    onChange={(e) => handleFromChange(e.target.value)}
                    className="w-full outline-none text-gray-800 font-semibold pr-10" // added padding-right
                    autoComplete="off"
                  />
                </div>

                {/* SWAP BUTTON - Now inside the Source field on the right */}
                <div className="absolute right-15 top-1/2 -translate-y-1/2 z-20">
                  <button 
                    type="button"
                    onClick={handleSwap}
                    className="bg-white p-1.5 rounded-full hover:bg-gray-100 transition-all active:scale-90 shadow-sm border border-gray-100 flex items-center justify-center mr-1"
                    title="Swap Cities"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#f97316" viewBox="0 0 16 16" className="rotate-90 md:rotate-0">
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

              {/* TO INPUT */}
              <div className="w-full md:w-1/3 text-left px-2 md:ml-4">
                <p className="text-xs text-gray-400 font-bold uppercase">To</p>
                <input
                  list="to-list"
                  type="text"
                  placeholder="Destination"
                  value={to}
                  onChange={(e) => handleToChange(e.target.value)}
                  className="w-full outline-none text-gray-800 font-semibold"
                  autoComplete="off"
                />
                <datalist id="to-list">
                  {toSuggestions.map((city) => (
                    <option key={city._id} value={`${city.name}, ${city.state}`} />
                  ))}
                </datalist>
              </div>

              {/* DATE */}
              <div className="w-full md:w-1/4 text-left px-2 border-t md:border-t-0 md:border-l border-gray-200 pt-2 md:pt-0 mt-2 md:mt-0">
                <p className="text-xs text-gray-400 font-bold uppercase">Date</p>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full outline-none text-gray-800 font-semibold bg-transparent"
                />
              </div>

              <button 
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg whitespace-nowrap mt-4 md:mt-0 ml-0 md:ml-4"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.32em] text-sky-600 font-semibold">
              Quick & Easy Booking
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">
              Bus ticket booking in 3 simple steps
            </h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Search routes, pick your seat, and checkout with confidence. Everything is designed to make your travel booking fast and smooth.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Search your route</h3>
              <p className="text-slate-600 leading-7">
                Enter your source, destination and travel date to find the best buses available for your journey.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 10h16"/><path d="M4 14h9"/><path d="M4 18h12"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Select your seat</h3>
              <p className="text-slate-600 leading-7">
                Choose the perfect seat with real-time availability and clear fare details before you book.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Pay securely</h3>
              <p className="text-slate-600 leading-7">
                Complete your booking with a secure payment flow and receive instant confirmation on your email.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-orange-500 font-semibold">
                Why choose GoBus?
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">
                Everything you need for a smooth bus journey
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl">
                Book fast, travel comfortably, and manage your trips easily with our smart bus booking experience. We make every journey simple and reliable.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex gap-4">
                  <div className="rounded-3xl bg-slate-50 p-4 text-orange-500">
                    <span className="text-2xl font-bold">01</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Flexible cancellation</h3>
                    <p className="text-slate-600 mt-2">
                      Change your plans without stress with easy cancellation and refund support.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="rounded-3xl bg-slate-50 p-4 text-orange-500">
                    <span className="text-2xl font-bold">02</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Live seat selection</h3>
                    <p className="text-slate-600 mt-2">
                      Pick your favorite seat from the live layout and see availability instantly.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="rounded-3xl bg-slate-50 p-4 text-orange-500">
                    <span className="text-2xl font-bold">03</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Secure payments</h3>
                    <p className="text-slate-600 mt-2">
                      Pay safely with multiple options and get instant booking confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6">Popular routes today</h3>
              <div className="space-y-4">
                {popularRoutes.length > 0 ? (
                  popularRoutes.map((route) => (
                    <div
                      key={route.busId}
                      onClick={() => handleRouteClick(route.source, route.destination)}
                      className="rounded-3xl bg-white p-5 border border-slate-200 cursor-pointer transition hover:shadow-md hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{route.source} → {route.destination}</p>
                          <p className="text-sm text-slate-500">{route.busName} • {route.bookings} bookings</p>
                        </div>
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">₹{route.price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl bg-white p-5 border border-slate-200 text-slate-500">
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