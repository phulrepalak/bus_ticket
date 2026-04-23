import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import img22 from "../assets/img22.png";

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState({
    upcoming: [],
    past: [],
    cancelled: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      // 1. Fetch user profile to get the phone number
      const userRes = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const phone = userRes.data.phone;

      // 2. Fetch bookings using phone and token
      const res = await axios.get(
        `http://localhost:5000/api/bookings/my-bookings?phone=${phone}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        setBookings({
          upcoming: res.data.upcoming || [],
          past: res.data.past || [],
          cancelled: res.data.cancelled || [],
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
        const res = await axios.put(
          `http://localhost:5000/api/bookings/cancel/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (res.data.success) {
          alert("Booking cancelled successfully!");
          fetchBookings(); // Refresh list after cancellation
        }
      } catch (err) {
        console.error("Cancel error:", err);
        const errMsg =
          err.response?.data?.message ||
          "Cancellation failed. Please try again.";
        alert(errMsg);
      }
    }
  };

  const EmptyState = () => (
    <div className="bg-white rounded-[3.5rem] p-16 md:p-24 text-center border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center">
      <div className="w-70 flex justify-center mb-10">
        <img
          src={img22}
          alt="No Bookings"
          className="opacity-100 transition-all duration-500"
          style={{
            width: "100%" /* Container ki puri width le lega */,
            maxWidth:
              "550px" /* Lekin 550px se bada nahi hoga (adjust as you like) */,
            height: "auto",
            display: "block",
          }}
        />
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">
        No Journeys Found
      </h3>
      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
        Your {activeTab} travel logs are empty
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-8 px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        Book a trip now →
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-16 pb-16 px-5 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
              My{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-800">
                Journeys
              </span>
            </h1>
          </div>

          {/* TABS */}
          {/* Tabs - Updated to Orange Theme */}
          <div className="flex bg-white p-1.5 rounded-[2rem] shadow-sm border border-slate-100 w-fit">
            {["upcoming", "past", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-[#FF6A00] text-white shadow-[0_10px_20px_rgba(255,106,0,0.3)] scale-105"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="h-12 w-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="font-black text-[10px] text-slate-400 uppercase tracking-[0.3em]">
              Synchronizing Records
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            {bookings[activeTab].length > 0 ? (
              bookings[activeTab].map((t) => (
                <div
                  key={t._id}
                  onClick={() =>
                    navigate("/ticket-confirmation", { state: { ticket: t } })
                  }
                  className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.07)] transition-all cursor-pointer"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* LEFT: ROUTE DETAIL */}
                    <div className="flex-1 p-10 flex items-center justify-between gap-8">
                      <div className="flex-1">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">
                          Departure
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                          {t.bus?.source || "N/A"}
                        </h3>
                        <p className="text-xs font-bold text-indigo-500 mt-1">
                          {t.boardingPoint}
                        </p>
                      </div>

                      <div className="flex flex-col items-center px-4">
                        <div className="h-px w-16 bg-slate-100 relative">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors"></div>
                        </div>
                      </div>

                      <div className="flex-1 text-right">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">
                          Arrival
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                          {t.bus?.destination || "N/A"}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 mt-1">
                          {t.droppingPoint}
                        </p>
                      </div>
                    </div>

                    {/* MIDDLE: VIRTUAL PERFORATION (Ticket Look) */}
                    <div className="hidden lg:flex flex-col justify-between py-6">
                      <div className="w-6 h-6 bg-[#F8FAFC] rounded-full -mr-3 border border-slate-100"></div>
                      <div className="h-full w-px border-l-2 border-dashed border-slate-100 mx-auto my-2"></div>
                      <div className="w-6 h-6 bg-[#F8FAFC] rounded-full -mr-3 border border-slate-100"></div>
                    </div>

                    {/* RIGHT: INFO & ACTIONS */}
                    <div className="bg-slate-50/50 lg:w-[350px] p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100">
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Journey Date
                          </p>
                          <p className="text-sm font-black text-slate-700">
                            {t.journeyDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Seats
                          </p>
                          <p className="text-sm font-black text-slate-700">
                            {t.seats?.join(", ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all duration-300">
                          Details
                        </button>
                        {activeTab === "upcoming" && (
                          <button
                            onClick={(e) => handleCancel(e, t._id)}
                            className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
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
