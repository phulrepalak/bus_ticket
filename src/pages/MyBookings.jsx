import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState({ upcoming: [], past: [], cancelled: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch travel history logs mapped by registered customer profile
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const userRes = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const phone = userRes.data.phone;

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

  // Dispatch cancellation routing process for an upcoming ticket reference
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

  // Fallback interface layout displayed when target array context is empty
  const EmptyState = () => (
    <div className="bg-white rounded-xl p-8 sm:p-16 text-center border border-slate-100 shadow-xs w-full">
      <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-xl text-slate-400 select-none">🚌</span>
      </div>
      <p className="text-slate-600 font-semibold text-sm sm:text-base tracking-tight px-2">
        No {activeTab} journeys found in your account.
      </p>
      <button onClick={() => navigate("/")} className="mt-4 text-blue-600 font-bold text-sm tracking-wide hover:underline decoration-2">
        Book a trip now &rarr;
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-16 px-4 sm:px-6 font-sans antialiased">
      <div className="max-w-5xl mx-auto w-full">

        {/* Dashboard Title Metrics */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            My <span className="text-blue-600 font-black">Journeys</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-medium text-slate-500 tracking-wide mt-2 leading-relaxed">
            View and manage your official travel logs and ticket history.
          </p>
        </div>

        {/* Filter Selection Segment Tabs Control - Responsive scrollable flex layout */}
        <div className="flex gap-1.5 mb-6 sm:mb-8 bg-slate-200/60 p-1.5 rounded-xl w-full sm:w-fit border border-slate-200/20 overflow-x-auto whitespace-nowrap scrollbar-none">
          {["upcoming", "past", "cancelled"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 rounded-lg font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-200 whitespace-nowrap ${activeTab === tab
                ? "bg-white text-blue-600 shadow-sm font-extrabold border border-slate-100 scale-[1.02]"
                : "text-slate-500 hover:text-slate-800"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 sm:py-24 text-xs sm:text-sm font-bold text-slate-400 tracking-widest uppercase animate-pulse">
            Loading your travel records...
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 w-full">
            {bookings[activeTab].length > 0 ? (
              bookings[activeTab].map((t) => (
                <div
                  key={t._id}
                  className="bg-white rounded-xl p-5 sm:p-6 md:p-8 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 w-full"
                >
                  {/* Node Mapping Parameters Section */}
                  <div className="flex flex-row items-center gap-4 sm:gap-6 md:gap-10 w-full md:w-auto justify-between md:justify-start">
                    <div className="text-left max-w-[40%] sm:max-w-none">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Origin</span>
                      <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 tracking-tight truncate">
                        {t.bus?.source || "N/A"}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 truncate max-w-[120px] sm:max-w-none">{t.boardingPoint}</p>
                    </div>

                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-8 sm:w-12 md:w-16 h-[2px] bg-slate-200 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-md shadow-blue-500/50"></div>
                      </div>
                    </div>

                    <div className="text-right md:text-left max-w-[40%] sm:max-w-none">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Destination</span>
                      <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 tracking-tight truncate">
                        {t.bus?.destination || "N/A"}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 truncate max-w-[120px] sm:max-w-none">{t.droppingPoint}</p>
                    </div>
                  </div>

                  {/* Seat Analytics Matrix Log Data */}
                  <div className="flex flex-row gap-6 border-t md:border-t-0 md:border-x border-slate-100 pt-3 md:pt-1 pb-1 px-2 md:px-8 lg:px-12 w-full md:w-auto justify-between md:justify-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                      <p className="text-sm sm:text-base font-extrabold text-slate-700 tracking-tight whitespace-nowrap">{t.journeyDate}</p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Seats</p>
                      <p className="text-sm sm:text-base font-extrabold text-slate-700 tracking-tight break-all max-w-[140px] sm:max-w-none">{t.seats?.join(", ")}</p>
                    </div>
                  </div>

                  {/* Operational Controls Interface System */}
                  <div className="flex flex-row gap-2.5 sm:gap-3 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-0 border-slate-50">
                    <button
                      type="button"
                      onClick={() => navigate("/ticket-confirmation", { state: { ticket: t } })}
                      className="flex-1 md:flex-initial px-4 sm:px-6 py-3 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-200 active:scale-95 text-center whitespace-nowrap"
                    >
                      View Ticket
                    </button>
                    {activeTab === "upcoming" && (
                      <button
                        type="button"
                        onClick={(e) => handleCancel(e, t._id)}
                        className="flex-1 md:flex-initial px-4 sm:px-6 py-3 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg font-bold text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-200 active:scale-95 text-center whitespace-nowrap"
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