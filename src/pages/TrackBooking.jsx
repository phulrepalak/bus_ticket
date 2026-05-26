import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TrackBooking() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Process operational phone payload parameters to scan tickets data records
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/bookings/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (response.ok) {
        setBookings(data.bookings);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error searching tickets.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-3 sm:p-6 font-sans text-left antialiased">
      <div className="max-w-lg w-full bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 border border-slate-100">
        
        {/* Module Section Branding */}
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-black text-blue-900 uppercase tracking-tighter">Your Bookings</h2>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-2">Enter phone number to fetch your tickets</p>
        </div>

        {/* Search Parameter Capture Form Frame */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-6 sm:mb-10 w-full">
          <input 
            type="tel" 
            placeholder="Enter Phone Number"
            className="w-full sm:flex-1 p-3.5 sm:p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm text-gray-800"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto bg-blue-900 text-white px-6 py-3.5 sm:py-0 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 shrink-0 text-center active:scale-98"
          >
            {loading ? "..." : "Find"}
          </button>
        </form>

        {/* Dynamic Log Records Output List Container */}
        <div className="space-y-4 max-h-80 overflow-y-auto pr-1 sm:pr-2 w-full">
          {bookings.length > 0 ? (
            bookings.map((t) => (
              <div 
                key={t._id} 
                onClick={() => navigate("/ticket-confirmation", { state: { ticket: t } })}
                className="group p-4 sm:p-5 border border-slate-100 rounded-3xl bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all cursor-pointer relative overflow-hidden w-full block"
              >
                <div className="flex flex-row justify-between items-center mb-2 gap-2 w-full">
                  <span className="text-[8px] sm:text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 sm:py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                    #GBS-{t._id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 italic whitespace-nowrap">{t.journeyDate}</span>
                </div>
                <h4 className="font-black text-slate-700 text-sm uppercase tracking-tighter truncate max-w-[90%] pr-4">
                  {t.boardingPoint.split(" ")[0]} → {t.droppingPoint.split(" ")[0]}
                </h4>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mt-1 truncate max-w-[90%]">Seats: {t.seats.join(", ")}</p>
                
                {/* Micro Action Layout Indicator Pin */}
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block select-none">
                  <span className="text-blue-900 text-xl font-bold">&rarr;</span>
                </div>
              </div>
            ))
          ) : (
            !loading && <p className="text-center text-slate-300 font-bold text-xs uppercase italic py-10 w-full">No recent bookings found</p>
          )}
        </div>

        {/* Secure Ledger Badge Frame */}
        <div className="mt-8 sm:mt-10 text-center border-t pt-5 sm:pt-6 border-slate-50 w-full">
            <p className="text-[9px] font-bold text-slate-300 uppercase leading-relaxed tracking-widest">GoBus Secure Ticketing System</p>
        </div>
      </div>
    </div>
  );
}