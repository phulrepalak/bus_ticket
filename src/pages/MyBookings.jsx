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
    e.stopPropagation();
    if (window.confirm("Do you really want to cancel this journey?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`http://localhost:5000/api/bookings/cancel/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          alert("Booking cancelled successfully!");
          fetchBookings();
        }
      } catch (err) {
        console.error("Cancel error:", err);
        const errMsg = err.response?.data?.message || "Cancellation failed. Please try again.";
        alert(errMsg);
      }
    }
  };

  const EmptyState = () => (
    <div className="bg-white rounded-xl p-16 text-center border border-slate-100 shadow-xs">
      <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-xl text-slate-400">🚌</span>
      </div>
      <p className="text-slate-600 font-semibold text-base tracking-tight">
        No {activeTab} journeys found in your account.
      </p>
      <button onClick={() => navigate("/")} className="mt-4 text-blue-600 font-bold text-sm tracking-wide hover:underline decoration-2">
        Book a trip now &rarr;
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-6 font-sans antialiased">
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            My <span className="text-blue-600 font-black">Journeys</span>
          </h1>
          <p className="text-base font-medium text-slate-500 tracking-wide mt-2">
            View and manage your official travel logs and ticket history.
          </p>
        </div>

        {/* Tabs Grid */}
        <div className="flex gap-1.5 mb-8 bg-slate-200/60 p-1.5 rounded-xl w-fit border border-slate-200/20">
          {["upcoming", "past", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all duration-200 ${activeTab === tab
                ? "bg-white text-blue-600 shadow-sm font-extrabold border border-slate-100 scale-[1.02]"
                : "text-slate-500 hover:text-slate-800"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24 text-base font-bold text-slate-400 tracking-widest uppercase animate-pulse">
            Loading your travel records...
          </div>
        ) : (
          <div className="grid gap-5">
            {bookings[activeTab].length > 0 ? (
              bookings[activeTab].map((t) => (
                <div
                  key={t._id}
                  className="bg-white rounded-xl p-6 sm:p-8 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  {/* Route Info */}
                  <div className="flex items-center gap-6 sm:gap-10 w-full md:w-auto justify-between md:justify-start">
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Origin</span>
                      <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                        {t.bus?.source || "N/A"}
                      </h3>
                      <p className="text-sm font-semibold text-slate-500 mt-1">{t.boardingPoint}</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-10 sm:w-16 h-[2px] bg-slate-200 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-md shadow-blue-500/50"></div>
                      </div>
                    </div>

                    <div className="text-right md:text-left">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Destination</span>
                      <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                        {t.bus?.destination || "N/A"}
                      </h3>
                      <p className="text-sm font-semibold text-slate-500 mt-1">{t.droppingPoint}</p>
                    </div>
                  </div>

                  {/* Journey Details */}
                  <div className="flex gap-12 md:border-x border-slate-100 px-0 md:px-12 py-1 w-full md:w-auto justify-around md:justify-start">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                      <p className="text-base font-extrabold text-slate-700 tracking-tight">{t.journeyDate}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Seats</p>
                      <p className="text-base font-extrabold text-slate-700 tracking-tight">{t.seats?.join(", ")}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 w-full md:w-auto justify-end">
                    <button
                      onClick={() => navigate("/ticket-confirmation", { state: { ticket: t } })}
                      className="flex-1 md:flex-initial px-6 py-3 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all duration-200 active:scale-95"
                    >
                      View Ticket
                    </button>
                    {activeTab === "upcoming" && (
                      <button
                        onClick={(e) => handleCancel(e, t._id)}
                        className="px-6 py-3 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all duration-200 active:scale-95"
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