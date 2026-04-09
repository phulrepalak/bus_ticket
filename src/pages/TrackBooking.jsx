import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TrackBooking() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-left">
      <div className="max-w-lg w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Your Bookings</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Enter phone number to fetch your tickets</p>
        </div>

        {/* --- INPUT FORM --- */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <input 
            type="tel" 
            placeholder="Enter Phone Number"
            className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="bg-blue-900 text-white px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-100"
          >
            {loading ? "..." : "Find"}
          </button>
        </form>

        {/* --- TICKETS LIST --- */}
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {bookings.length > 0 ? (
            bookings.map((t) => (
              <div 
                key={t._id} 
                onClick={() => navigate("/ticket-confirmation", { state: { ticket: t } })}
                className="group p-5 border border-slate-100 rounded-3xl bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">#GBS-{t._id.slice(-6).toUpperCase()}</span>
                  <span className="text-[10px] font-bold text-slate-400 italic">{t.journeyDate}</span>
                </div>
                <h4 className="font-black text-slate-700 text-sm uppercase tracking-tighter">
                  {t.boardingPoint.split(" ")[0]} → {t.droppingPoint.split(" ")[0]}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Seats: {t.seats.join(", ")}</p>
                
                {/* Visual Arrow Icon */}
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-blue-900 text-xl font-bold">→</span>
                </div>
              </div>
            ))
          ) : (
            !loading && <p className="text-center text-slate-300 font-bold text-xs uppercase italic py-10">No recent bookings found</p>
          )}
        </div>

        <div className="mt-10 text-center border-t pt-6 border-slate-50">
           <p className="text-[9px] font-bold text-slate-300 uppercase leading-relaxed tracking-widest">GoBus Secure Ticketing System</p>
        </div>
      </div>
    </div>
  );
}