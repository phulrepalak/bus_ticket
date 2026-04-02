import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useLocation add kiya
import heroImg from "../assets/hero.png";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Location hook ka use

  // Pehle check karenge ki kya Search results se wapas aaye hain (Modify Search)
  // Agar location.state mein data hai toh wo use hoga, nahi toh empty string
  const [from, setFrom] = useState(location.state?.from || "");
  const [to, setTo] = useState(location.state?.to || "");
  const [date, setDate] = useState(location.state?.date || "");
  
  const [cities, setCities] = useState([]); 
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

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

  const handleSearch = () => {
    if (!from || !to || !date) {
      alert("Please fill all fields");
      return;
    }
    navigate(`/search`, { state: { from, to, date } });
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
            <div className="bg-white rounded-2xl shadow-2xl px-4 py-4 md:px-6 md:py-5 w-[95%] md:w-[80%] lg:w-[65%] flex flex-col md:flex-row items-center gap-4">
              
              {/* FROM INPUT */}
              <div className="w-full md:w-1/4 text-left px-2">
                <p className="text-xs text-gray-400 font-bold uppercase">From</p>
                <input
                  list="from-list"
                  type="text"
                  placeholder="Enter city"
                  value={from}
                  onChange={(e) => handleFromChange(e.target.value)}
                  className="w-full outline-none text-gray-800 font-semibold"
                  autoComplete="off"
                />
                <datalist id="from-list">
                  {fromSuggestions.map((city) => (
                    <option key={city._id} value={city.name} />
                  ))}
                </datalist>
              </div>

              {/* TO INPUT */}
              <div className="w-full md:w-1/4 text-left px-2 border-l border-gray-200">
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
                    <option key={city._id} value={city.name} />
                  ))}
                </datalist>
              </div>

              {/* DATE */}
              <div className="w-full md:w-1/4 text-left px-2 border-l border-gray-200">
                <p className="text-xs text-gray-400 font-bold uppercase">Date</p>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full outline-none text-gray-800 font-semibold"
                />
              </div>

              <button 
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 active:rounded-full text-white px-10 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg"
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