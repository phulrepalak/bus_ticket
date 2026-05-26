import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HelpCenter() {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState({ name: "", email: "", issue: "", message: "" });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch("http://localhost:5000/api/support/raise-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message || "Support Ticket Submitted successfully!");
        setTicket({ name: "", email: "", issue: "", message: "" }); 
      } else {
        alert(data.message || "Failed to process target validation.");
      }
    } catch (error) {
      console.error("Connection Interface Error:", error);
      alert("Error connecting to backend email server. Check server state.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-12 px-3 sm:px-6 lg:px-8 text-left text-slate-800 antialiased">
      <div className="max-w-3xl mx-auto w-full">
        
        {/* Navigation Action Trigger */}
        <button 
          type="button"
          onClick={() => navigate("/")} 
          className="mb-4 sm:mb-6 text-sm font-semibold text-sky-600 hover:underline inline-block"
        >
          ← Back to Home
        </button>
        
        {/* Section Identity Headers */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mb-1 sm:mb-2 tracking-tight">Help Center</h1>
        <p className="text-slate-500 text-xs sm:text-sm mb-6 sm:mb-8 font-medium">Need help with your booking? We are here for you 24/7.</p>

        {/* Quick Help Categories Card Grid Matrices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 sm:mb-10 w-full">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm w-full">
            <span className="text-2xl select-none">🎫</span>
            <h3 className="font-bold text-slate-900 mt-2 tracking-tight">Booking Issues</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Problems during seat selection or payment failures.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm w-full">
            <span className="text-2xl select-none">❌</span>
            <h3 className="font-bold text-slate-900 mt-2 tracking-tight">Cancellations</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">How to cancel your ticket and check refund status.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm w-full sm:col-span-2 md:col-span-1">
            <span className="text-2xl select-none">👤</span>
            <h3 className="font-bold text-slate-900 mt-2 tracking-tight">Account & OTP</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Issues receiving OTP or managing your profile details.</p>
          </div>
        </div>

        {/* Raise a Support Ticket Composite Input Form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8 border border-slate-100 w-full">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-5 tracking-tight">Raise a Support Ticket</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="w-full">
                <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 px-0.5">Full Name</label>
                <input type="text" required value={ticket.name} onChange={(e) => setTicket({...ticket, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 bg-white text-sm text-gray-800 font-medium rounded-xl outline-none focus:border-sky-500 transition-colors" />
              </div>
              <div className="w-full">
                <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 px-0.5">Email Address</label>
                <input type="email" required value={ticket.email} onChange={(e) => setTicket({...ticket, email: e.target.value})} className="w-full px-4 py-3 border border-slate-200 bg-white text-sm text-gray-800 font-medium rounded-xl outline-none focus:border-sky-500 transition-colors" />
              </div>
            </div>
            
            <div className="w-full">
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 px-0.5">Issue Type</label>
              <select value={ticket.issue} onChange={(e) => setTicket({...ticket, issue: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-sky-500 bg-white text-sm text-gray-800 font-medium">
                <option value="">Select an option</option>
                <option value="Payment Failed">Payment Failed / Deducted</option>
                <option value="Ticket Not Generated">Ticket Not Generated</option>
                <option value="Cancellation/Refund">Cancellation & Refund</option>
                <option value="Other">Other Issues</option>
              </select>
            </div>
            
            <div className="w-full">
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 px-0.5">Describe your Problem</label>
              <textarea rows="4" required value={ticket.message} onChange={(e) => setTicket({...ticket, message: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-sky-500 bg-white text-sm text-gray-800 font-medium resize-none"></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={isSending}
              className={`w-full py-4 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-98 ${isSending ? "bg-slate-400 cursor-not-allowed shadow-none" : "bg-blue-900 hover:bg-blue-800"}`}
            >
              {isSending ? "Processing Email via Server..." : "Submit Ticket →"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}