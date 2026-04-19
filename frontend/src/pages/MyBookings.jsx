import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState({ upcoming: [], past: [], cancelled: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      // 1. Fetch user profile to get the phone number
      const userRes = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const phone = userRes.data.phone;

      // 2. Fetch bookings using phone and token
      const res = await axios.get(`http://localhost:5000/api/bookings/my-bookings?phone=${phone}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setBookings({
          upcoming: res.data.upcoming || [],
          past: res.data.past || [],
          cancelled: res.data.cancelled || []
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchBookings(); 
  }, []);

  const handleCancel = async (e, id) => {
    e.stopPropagation(); // Card click event ko rokne ke liye
    if (window.confirm("Do you really want to cancel this journey?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`http://localhost:5000/api/bookings/cancel/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          alert("Booking cancelled successfully!");
          fetchBookings(); // Refresh list after cancellation
        }
      } catch (err) {
        console.error("Cancel error:", err);
        const errMsg = err.response?.data?.message || "Cancellation failed. Please try again.";
        alert(errMsg);
      }
    }
  };

  const EmptyState = () => (
    <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl text-slate-300">✈️</span>
      </div>
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] italic">
        No {activeTab} journeys found
      </p>
      <button onClick={() => navigate("/")} className="mt-6 text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline">
        Book a trip now →
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-6xl font-black text-blue-900 tracking-tighter uppercase leading-none">
            My <span className="text-blue-500">Journeys</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4 ml-1">
            Official Travel Records & History
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 bg-slate-100/50 p-1.5 rounded-[2rem] w-fit border border-slate-200/50">
          {["upcoming", "past", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-3.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab 
                ? "bg-white text-blue-900 shadow-xl shadow-blue-900/5 border border-slate-100" 
                : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20 italic font-black text-slate-300 animate-pulse tracking-widest">
            AUTHENTICATING RECORDS...
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings[activeTab].length > 0 ? (
              bookings[activeTab].map((t) => (
                <div 
                  key={t._id}
                  onClick={() => navigate("/ticket-confirmation", { state: { ticket: t } })}
                  className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all cursor-pointer flex flex-col md:flex-row items-center justify-between gap-8"
                >
                  {/* Route Info */}
                  <div className="flex items-center gap-8">
                    <div className="text-center md:text-left">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Origin</p>
                      <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">
                        {t.bus?.source || "N/A"}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400">{t.boardingPoint}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-[2px] bg-slate-100 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Destination</p>
                      <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">
                        {t.bus?.destination || "N/A"}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400">{t.droppingPoint}</p>
                    </div>
                  </div>

                  {/* Journey Details */}
                  <div className="flex gap-12 border-x border-slate-50 px-12 py-2">
                    <div className="text-center">
                      <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Date</p>
                      <p className="text-sm font-black text-slate-700">{t.journeyDate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Seats</p>
                      <p className="text-sm font-black text-slate-700">{t.seats?.join(", ")}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="px-6 py-3.5 bg-blue-50 text-blue-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-900 hover:text-white transition-all">
                      View Ticket
                    </button>
                    {activeTab === "upcoming" && (
                      <button 
                        onClick={(e) => handleCancel(e, t._id)}
                        className="px-6 py-3.5 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;