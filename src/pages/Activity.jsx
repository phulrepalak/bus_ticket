import React, { useState, useEffect } from "react";
import axios from "axios";

const Activity = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        // Get user profile first to get the phone number
        const userRes = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const phone = userRes.data.phone;

        // Fetch analytics stats
        const res = await axios.get(`http://localhost:5000/api/bookings/activity-stats?phone=${phone}`);
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin h-8 w-8 border-4 border-blue-900 border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-5xl font-black text-blue-900 tracking-tighter uppercase">Travel Activity</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Your GoBus Journey at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Total Trips */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Trips</p>
            <h2 className="text-6xl font-black text-blue-900 tracking-tighter">{stats?.totalTrips || 0}</h2>
            <div className="absolute -right-4 -bottom-4 text-blue-50 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
               </svg>
            </div>
          </div>

          {/* Cities Visited */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cities Explored</p>
            <h2 className="text-6xl font-black text-[#87a96b] tracking-tighter">{stats?.uniqueCities || 0}</h2>
            <div className="absolute -right-4 -bottom-4 text-[#87a96b] opacity-10 group-hover:opacity-20 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
               </svg>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Travel Investment</p>
            <h2 className="text-5xl font-black text-blue-900 tracking-tighter">₹{stats?.totalSpent?.toLocaleString() || 0}</h2>
            <div className="absolute -right-4 -bottom-4 text-blue-50 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-2 10a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            </div>
          </div>

        </div>

        {/* Member Card */}
        <div className="bg-blue-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-200">
           <div>
              <p className="text-orange-400 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Verified Explorer</p>
              <h3 className="text-3xl font-black tracking-tighter leading-tight">You’ve been part of the <br />GoBus family since {new Date(stats?.memberSince).getFullYear()}</h3>
           </div>
           <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl text-center border border-white/20 min-w-[200px]">
              <p className="text-[10px] font-black uppercase opacity-60 mb-1">Status</p>
              <p className="text-xl font-black tracking-widest">GOLD MEMBER</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Activity;