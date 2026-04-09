import React, { useRef, useEffect } from "react"; // useEffect add kiya
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function TicketConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(); 
  const { ticket } = location.state || {};

  // --- NAVBAR LOGIC FOR GUEST USER ---
  useEffect(() => {
    // Agar ticket data hai aur wo guest booking hai, toh localStorage update karo
    if (ticket && ticket.isGuest) {
      localStorage.setItem("isGuest", "true");
      // Navbar ko turant update hone ke liye event trigger kar sakte hain
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

  const handleDownload = async () => {
    const element = ticketRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`GoBus_Ticket_${ticket._id.slice(-6).toUpperCase()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-left text-slate-800">
      <div className="max-w-xl mx-auto">
        
        {/* --- TICKET UI START --- */}
        <div ref={ticketRef} className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
          
          <div className="bg-blue-900 p-10 text-white text-center relative">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">E-Ticket Confirmation</h2>
            <p className="text-5xl font-black tracking-tighter italic">GoBus</p>
            
            <div className="absolute -bottom-5 left-0 right-0 flex justify-between px-8">
                <div className="w-10 h-10 bg-slate-50 rounded-full shadow-inner"></div>
                <div className="w-10 h-10 bg-slate-50 rounded-full shadow-inner"></div>
            </div>
          </div>

          <div className="p-12 space-y-8 pt-16">
            <div className="flex justify-between items-start border-b border-dashed border-slate-200 pb-8">
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Booking PNR</p>
                <p className="text-sm font-black text-blue-900 uppercase tracking-tight">#GBS-{ticket._id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</p>
                <p className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-tighter">Confirmed</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-10">
              <div className="col-span-2 border-b border-slate-50 pb-4">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Passenger Details</p>
                <p className="text-lg font-black text-slate-700 uppercase tracking-tighter">{ticket.passengerDetails[0].name}</p>
                <p className="text-[11px] font-bold text-slate-400">{ticket.passengerDetails[0].age} Yrs • {ticket.passengerDetails[0].gender}</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Seat Numbers</p>
                <p className="text-xl font-black text-blue-600 tracking-tighter">{ticket.seats.join(", ")}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Travel Date</p>
                <p className="text-xl font-black text-slate-700 tracking-tighter">{ticket.journeyDate}</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Boarding From</p>
                <p className="text-[12px] font-bold text-slate-600 leading-tight uppercase">{ticket.boardingPoint}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Dropping To</p>
                <p className="text-[12px] font-bold text-slate-600 leading-tight uppercase">{ticket.droppingPoint}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mt-6 text-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Paid Amount</p>
               <p className="text-5xl font-black text-blue-900 leading-none tracking-tighter">₹{ticket.totalAmount}</p>
            </div>

            <div className="pt-6 text-center border-t border-slate-50">
                <p className="text-[9px] font-bold text-slate-400 italic uppercase tracking-[0.1em] leading-relaxed">
                  Note: Original ID proof is mandatory. Please show this e-ticket during boarding.
                </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-5 px-2">
          <button 
            onClick={handleDownload} 
            className="flex-1 py-5 bg-white border border-slate-200 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-slate-600 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            Download PDF
          </button>
          <button 
            onClick={() => navigate("/")} 
            className="flex-1 py-5 bg-blue-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-100 hover:bg-blue-800 transition-all active:scale-95"
          >
            Finish Booking
          </button>
        </div>

      </div>
    </div>
  );
}