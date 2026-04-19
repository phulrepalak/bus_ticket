import React, { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TicketConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(); 
  const { ticket } = location.state || {};

  useEffect(() => {
    if (ticket && ticket.isGuest) {
      localStorage.setItem("isGuest", "true");
      window.dispatchEvent(new Event("storage"));
    }
  }, [ticket]);

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-sm border border-slate-200">
          <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">No Ticket Found</p>
          <button onClick={() => navigate("/")} className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-lg font-bold uppercase text-[10px]">Back to Home</button>
        </div>
      </div>
    );
  }

  // --- NEW BULLETPROOF PRINT LOGIC ---
  const handleDownload = () => {
    const printContent = ticketRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    // Sirf ticket content ko print karne ke liye temporary window setup
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
    
    // Page wapas normal karne ke liye reload
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-left text-slate-800">
      <div className="max-w-xl mx-auto">
        
        {/* --- TICKET UI START --- */}
        <div ref={ticketRef} id="ticket-area" className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200">
          
          {/* Header */}
          <div className="bg-blue-900 p-8 text-white text-center relative">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-1">Official E-Ticket</h2>
            <p className="text-4xl font-black tracking-tighter italic">GoBus</p>
            
            <div className="absolute -bottom-5 -left-5 w-10 h-10 bg-slate-50 rounded-full"></div>
            <div className="absolute -bottom-5 -right-5 w-10 h-10 bg-slate-50 rounded-full"></div>
          </div>

          <div className="p-10 pt-12">
            <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-6 mb-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PNR Number</p>
                <p className="text-lg font-black text-blue-900 uppercase italic">GBS-{ticket._id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="text-right text-green-600">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                <p className="font-black uppercase tracking-tighter italic text-sm">✓ Confirmed</p>
              </div>
            </div>

            {/* Multiple Passengers Section */}
            <div className="mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Passenger(s)</p>
              <div className="space-y-3">
                {ticket.passengerDetails.map((p, index) => (
                  <div key={index} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-sm font-black text-slate-700 uppercase">{index + 1}. {p.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{p.age} Years • {p.gender}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Seat</p>
                      <p className="text-sm font-black text-blue-600">{ticket.seats[index] || ticket.seats[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 py-6 border-y border-slate-50">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Journey Date</p>
                <p className="text-md font-black text-slate-700">{ticket.journeyDate}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Seats</p>
                <p className="text-md font-black text-slate-700">{ticket.seats.length}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Boarding Point</p>
                <p className="text-[11px] font-bold text-slate-600 uppercase leading-tight">{ticket.boardingPoint}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dropping Point</p>
                <p className="text-[11px] font-bold text-slate-600 uppercase leading-tight">{ticket.droppingPoint}</p>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 flex justify-between items-center">
               <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Payment Method</p>
                  <p className="text-xs font-black text-blue-900 uppercase">Paid Online</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Amount</p>
                  <p className="text-3xl font-black text-blue-900 tracking-tighter">₹{ticket.totalAmount}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button 
            onClick={handleDownload} 
            className="flex-1 py-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:border-blue-900 hover:text-blue-900 transition-all active:scale-95 shadow-sm"
          >
            Download / Print Ticket
          </button>
          <button 
            onClick={() => navigate("/")} 
            className="flex-1 py-4 bg-blue-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all active:scale-95"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}