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
        setTicket({ name: "", email: "", issue: "", message: "" }); // Form parameters flushing
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-left text-slate-800">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate("/")} className="mb-6 text-sm font-semibold text-sky-600 hover:underline">← Back to Home</button>
        
        <h1 className="text-3xl font-black text-slate-950 mb-2">Help Center</h1>
        <p className="text-slate-500 mb-8">Need help with your booking? We are here for you 24/7.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-2xl">🎫</span>
            <h3 className="font-bold text-slate-900 mt-2">Booking Issues</h3>
            <p className="text-xs text-slate-500 mt-1">Problems during seat selection or payment failures.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-2xl">❌</span>
            <h3 className="font-bold text-slate-900 mt-2">Cancellations</h3>
            <p className="text-xs text-slate-500 mt-1">How to cancel your ticket and check refund status.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-2xl">👤</span>
            <h3 className="font-bold text-slate-900 mt-2">Account & OTP</h3>
            <p className="text-xs text-slate-500 mt-1">Issues receiving OTP or managing your profile details.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Raise a Support Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full Name</label>
                <input type="text" required value={ticket.name} onChange={(e) => setTicket({...ticket, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-sky-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                <input type="email" required value={ticket.email} onChange={(e) => setTicket({...ticket, email: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-sky-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Issue Type</label>
              <select value={ticket.issue} onChange={(e) => setTicket({...ticket, issue: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-sky-500 bg-white">
                <option value="">Select an option</option>
                <option value="Payment Failed">Payment Failed / Deducted</option>
                <option value="Ticket Not Generated">Ticket Not Generated</option>
                <option value="Cancellation/Refund">Cancellation & Refund</option>
                <option value="Other">Other Issues</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Describe your Problem</label>
              <textarea rows="4" required value={ticket.message} onChange={(e) => setTicket({...ticket, message: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-sky-500 resize-none"></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={isSending}
              className={`w-full py-4 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all ${isSending ? "bg-slate-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"}`}
            >
              {isSending ? "Processing Email via Server..." : "Submit Ticket →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}