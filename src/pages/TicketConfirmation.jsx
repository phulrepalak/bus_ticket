import React, { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TicketConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(); 
  const { ticket } = location.state || {};

  // Trigger storage state configurations if traveler profile is evaluated as guest
  useEffect(() => {
    if (ticket && ticket.isGuest) {
      localStorage.setItem("isGuest", "true");
      window.dispatchEvent(new Event("storage"));
    }
  }, [ticket]);

  // Fallback view state rendered if access payload context is missing
  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center p-6 sm:p-10 bg-white rounded-3xl shadow-sm border border-slate-200 w-full max-w-xs">
          <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">No Ticket Found</p>
          <button type="button" onClick={() => navigate("/")} className="mt-4 w-full bg-blue-900 text-white px-6 py-2.5 rounded-lg font-bold uppercase text-[10px] tracking-wider">Back to Home</button>
        </div>
      </div>
    );
  }

  // Handle temporary view generation and print initialization workflows
  const handleDownload = () => {
    const printContent = ticketRef.current.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>GoBus_Ticket</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { padding: 20px; background: white !important; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body class="bg-white flex justify-center items-start pt-10">
          <div class="max-w-xl w-full">${printContent}</div>
        </body>
      </html>
    `;

    window.print();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-12 px-3 sm:px-4 font-sans text-left text-slate-800 antialiased">
      <div className="max-w-xl mx-auto w-full">
        
        {/* PHYSICAL TICKET VIEW CHASSIS CONTAINER */}
        <div ref={ticketRef} id="ticket-area" className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 w-full">
          
          {/* Header branding block */}
          <div className="bg-blue-900 p-6 sm:p-8 text-white text-center relative w-full">
            <h2 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-1">Official E-Ticket</h2>
            <p className="text-3xl sm:text-4xl font-black tracking-tighter italic">GoBus</p>
            
            <div className="absolute -bottom-5 -left-5 w-10 h-10 bg-slate-50 rounded-full select-none"></div>
            <div className="absolute -bottom-5 -right-5 w-10 h-10 bg-slate-50 rounded-full select-none"></div>
          </div>

          <div className="p-4 sm:p-10 pt-6 sm:pt-12 w-full">
            
            {/* PNR Context Matrix Row */}
            <div className="flex flex-row justify-between items-center border-b border-dashed border-slate-200 pb-4 sm:pb-6 mb-6 sm:mb-8 gap-2 w-full">
              <div>
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">PNR Number</p>
                <p className="text-base sm:text-lg font-black text-blue-900 uppercase italic whitespace-nowrap">GBS-{ticket._id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="text-right text-green-600">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                <p className="font-black uppercase tracking-tighter italic text-xs sm:text-sm whitespace-nowrap">✓ Confirmed</p>
              </div>
            </div>

            {/* Passenger manifestation records grid */}
            <div className="mb-6 sm:mb-8 w-full">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Passenger(s)</p>
              <div className="space-y-3 w-full">
                {ticket.passengerDetails.map((p, index) => (
                  <div key={index} className="flex flex-row justify-between items-center bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100 gap-4 w-full">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-black text-slate-700 uppercase truncate">{index + 1}. {p.name}</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mt-0.5 whitespace-nowrap">{p.age} Years • {p.gender}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase leading-none">Seat</p>
                      <p className="text-xs sm:text-sm font-black text-blue-600 mt-1">{ticket.seats[index] || ticket.seats[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Schedule Point Configurations Matrix */}
            <div className="grid grid-cols-2 gap-4 sm:gap-8 py-5 sm:py-6 border-y border-slate-50 w-full">
              <div>
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Journey Date</p>
                <p className="text-sm sm:text-md font-black text-slate-700 whitespace-nowrap">{ticket.journeyDate}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Seats</p>
                <p className="text-sm sm:text-md font-black text-slate-700">{ticket.seats.length}</p>
              </div>
              <div>
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Boarding Point</p>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase leading-tight break-words">{ticket.boardingPoint}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dropping Point</p>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase leading-tight break-words">{ticket.droppingPoint}</p>
              </div>
            </div>

            {/* Financial ledger breakdown summary banner */}
            <div className="mt-6 sm:mt-8 bg-blue-50 p-4 sm:p-6 rounded-2xl border border-blue-100 flex flex-row justify-between items-center gap-4 w-full">
               <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Payment Method</p>
                  <p className="text-[11px] sm:text-xs font-black text-blue-900 uppercase mt-1.5 whitespace-nowrap">Paid Online</p>
               </div>
               <div className="text-right shrink-0">
                  <p className="text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Total Amount</p>
                  <p className="text-2xl sm:text-3xl font-black text-blue-900 tracking-tighter mt-1">₹{ticket.totalAmount}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Action Triggers Grid Footer */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <button 
            type="button"
            onClick={handleDownload} 
            className="w-full sm:flex-1 py-3.5 bg-white border-2 border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:border-blue-900 hover:text-blue-900 transition-all active:scale-98 shadow-sm text-center"
          >
            Download / Print Ticket
          </button>
          <button 
            type="button"
            onClick={() => navigate("/")} 
            className="w-full sm:flex-1 py-3.5 bg-blue-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all active:scale-98 text-center"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}