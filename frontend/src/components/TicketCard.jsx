import React from "react";

const TicketCard = ({ booking, isPast = false }) => {
  // Unique Booking ID formatting
  const ticketID = `GBS-${booking._id.slice(-6).toUpperCase()}`;

  return (
    <div className="relative bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden mb-6 group transition-all hover:-translate-y-1">
      <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Route & Status */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
              isPast ? "bg-slate-100 text-slate-400" : "bg-[#87a96b]/10 text-[#87a96b]"
            }`}>
              {isPast ? "Completed" : "Upcoming Journey"}
            </span>
            <span className="text-[10px] font-bold text-slate-300">#{ticketID}</span>
          </div>
          
          <h3 className="text-2xl font-black text-blue-900 tracking-tighter uppercase">
            {booking.boardingPoint.split(",")[0]} 
            <span className="text-slate-300 mx-3">→</span> 
            {booking.droppingPoint.split(",")[0]}
          </h3>
          
          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</p>
              <p className="text-sm font-bold text-slate-700">{booking.journeyDate}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Seats</p>
              <p className="text-sm font-bold text-slate-700">{booking.seats.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Perforation Line (Desktop Only) */}
        <div className="hidden md:block border-l-2 border-dashed border-slate-100 h-24 mx-4"></div>

        {/* Price & Action */}
        <div className="w-full md:w-auto text-left md:text-right">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Fare</p>
          <p className="text-3xl font-black text-blue-900 mt-1 mb-4 leading-none">₹{booking.totalAmount}</p>
          
          <button className="w-full md:w-auto px-6 py-3 bg-slate-50 hover:bg-blue-900 hover:text-white text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
            View Details
          </button>
        </div>
      </div>

      {/* Decorative Circles for Ticket Effect */}
      <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-100 -translate-y-1/2"></div>
      <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-50 rounded-full border border-slate-100 -translate-y-1/2"></div>
    </div>
  );
};

export default TicketCard;