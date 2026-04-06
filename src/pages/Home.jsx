import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import heroImg from "../assets/hero.png";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [from, setFrom] = useState(location.state?.from || "");
  const [to, setTo] = useState(location.state?.to || "");
  const [date, setDate] = useState(location.state?.date || "");
  
  const [cities, setCities] = useState([]); 
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
    fetchCities();
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

  return (
    <div>
      <div
        className="h-[95vh] bg-cover bg-center flex items-center justify-center text-white relative"
        style={{ backgroundImage: `url(${heroImg})` }}
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
    </div>
  );
};

export default Home;