import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

export default function SelectSeat() {
  const { busId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, date } = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState(["5", "L2", "U1"]); // Mock Data

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  // --- PREMIUM SEAT COMPONENT ---
  const Seat = ({ id, type }) => {
    const isBooked = bookedSeats.includes(id);
    const isSelected = selectedSeats.includes(id);

    let sizeClass = type === "Sleeper" ? "w-16 h-8" : "w-10 h-10";
    let baseClass = `relative transition-all duration-200 cursor-pointer rounded-md border-[1.2px] flex flex-col items-center justify-center font-bold ${sizeClass} `;
    
    if (isBooked) {
      baseClass += "bg-slate-400 border-slate-500 text-white cursor-not-allowed opacity-90";
    } else if (isSelected) {
      baseClass += "bg-sky-500 border-sky-600 text-white shadow-md shadow-sky-200 scale-105 z-20";
    } else {
      baseClass += "bg-white border-slate-200 text-slate-500 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600";
    }

    return (
      <div onClick={() => handleSeatClick(id)} className={baseClass}>
        {!isBooked && !isSelected && <span className="text-[7.5px] text-slate-300 font-medium">₹{bus?.price}</span>}
        
        {isSelected && (
          <div className="absolute -top-8 bg-slate-900 text-white text-[9px] py-1 px-2 rounded shadow-xl flex items-center gap-1 z-30">
             <span className="font-bold">{id}</span>
             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-900 rotate-45"></div>
          </div>
        )}

        <span className={isSelected ? "text-white text-[10px]" : "text-[10px]"}>{id}</span>
        {!isBooked && !isSelected && <div className="absolute bottom-1 w-5 h-0.5 bg-slate-100 rounded-full"></div>}
      </div>
    );
  };

  // --- DYNAMIC BUS LAYOUT ---
  const BusLayout = () => {
    const totalSeatsCount = bus?.availableSeats || 30;

    const SeaterOnly = () => {
      const rows = [];
      const rowCount = Math.ceil(totalSeatsCount / 4);
      for (let i = 0; i < rowCount; i++) {
        const start = i * 4 + 1;
        rows.push(
          <div key={i} className="flex gap-2.5 justify-center">
            {start <= totalSeatsCount && <Seat id={String(start)} type="Seater" />}
            {start + 1 <= totalSeatsCount && <Seat id={String(start + 1)} type="Seater" />}
            <div className="w-8"></div>
            {start + 2 <= totalSeatsCount && <Seat id={String(start + 2)} type="Seater" />}
            {start + 3 <= totalSeatsCount && <Seat id={String(start + 3)} type="Seater" />}
          </div>
        );
      }
      return <div className="flex flex-col gap-2.5">{rows}</div>;
    };

    const SleeperOnly = () => {
      const perDeck = Math.ceil(totalSeatsCount / 2);
      const renderDeck = (prefix, count) => {
        const deckRows = [];
        for (let i = 1; i <= count; i += 3) {
          deckRows.push(
            <div key={i} className="flex gap-6 justify-center">
              <Seat id={`${prefix}${i}`} type="Sleeper" />
              <div className="w-4"></div>
              {i + 1 <= count && <Seat id={`${prefix}${i + 1}`} type="Sleeper" />}
              {i + 2 <= count && <Seat id={`${prefix}${i + 2}`} type="Sleeper" />}
            </div>
          );
        }
        return deckRows;
      };
      return (
        <div className="flex flex-col gap-6 w-full">
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
            <p className="text-center text-[9px] font-black text-slate-400 mb-2 uppercase">Lower Deck</p>
            <div className="flex flex-col gap-2.5">{renderDeck("L", perDeck)}</div>
          </div>
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
            <p className="text-center text-[9px] font-black text-slate-400 mb-2 uppercase">Upper Deck</p>
            <div className="flex flex-col gap-2.5">{renderDeck("U", perDeck)}</div>
          </div>
        </div>
      );
    };

    const SemiSleeper = () => {
      const lowerCount = Math.floor(totalSeatsCount * 0.6);
      const upperCount = totalSeatsCount - lowerCount;
      const renderLower = () => {
        const rows = [];
        for (let i = 1; i <= lowerCount; i += 4) {
          rows.push(
            <div key={i} className="flex gap-2.5 justify-center">
              <Seat id={`L${i}`} type="Seater" />
              {i + 1 <= lowerCount && <Seat id={`L${i + 1}`} type="Seater" />}
              <div className="w-6"></div>
              {i + 2 <= lowerCount && <Seat id={`L${i + 2}`} type="Seater" />}
              {i + 3 <= lowerCount && <Seat id={`L${i + 3}`} type="Seater" />}
            </div>
          );
        }
        return rows;
      };
      const renderUpper = () => {
        const rows = [];
        for (let i = 1; i <= upperCount; i += 3) {
          rows.push(
            <div key={i} className="flex gap-6 justify-center">
              <Seat id={`U${i}`} type="Sleeper" />
              <div className="w-4"></div>
              {i + 1 <= upperCount && <Seat id={`U${i + 1}`} type="Sleeper" />}
              {i + 2 <= upperCount && <Seat id={`U${i + 2}`} type="Sleeper" />}
            </div>
          );
        }
        return rows;
      };
      return (
        <div className="flex flex-col gap-6 w-full">
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
            <p className="text-center text-[9px] font-black text-slate-400 mb-2 uppercase tracking-tighter">Lower Seater</p>
            <div className="flex flex-col gap-2.5">{renderLower()}</div>
          </div>
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
            <p className="text-center text-[9px] font-black text-slate-400 mb-2 uppercase tracking-tighter">Upper Sleeper</p>
            <div className="flex flex-col gap-2.5">{renderUpper()}</div>
          </div>
        </div>
      );
    };

    if (bus?.seatType === "Sleeper") return <SleeperOnly />;
    if (bus?.seatType === "Semi-Sleeper") return <SemiSleeper />;
    return <SeaterOnly />;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-2 md:p-6 flex justify-center items-start text-left">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative">
          <div className="mb-6 flex justify-between items-center px-2">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Select Seat</h2>
              {/* ADDED SEAT TYPE BADGE HERE */}
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest">{bus?.seatType}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bus?.source} → {bus?.destination}</span>
              </div>
            </div>
            <div className="flex gap-3 items-center">
               <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter"><div className="w-3 h-3 bg-white border border-slate-200 rounded-sm"></div> Avail.</div>
               <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter"><div className="w-3 h-3 bg-slate-400 rounded-sm"></div> Booked</div>
               <div className="flex items-center gap-1.5 text-[9px] font-bold text-sky-600 uppercase tracking-tighter"><div className="w-3 h-3 bg-sky-500 rounded-sm"></div> Selected</div>
            </div>
          </div>

          <div className="relative bg-[#FAFBFC] rounded-2xl py-8 px-4 border border-slate-50 flex flex-col items-center">
            <BusLayout />
          </div>
        </div>

        {/* RIGHT PANEL: FULL TICKET FORM */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="bg-white rounded-[2rem] p-8 text-slate-800 shadow-2xl border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 border-b border-slate-50 pb-4 mb-6 tracking-widest uppercase">Booking Details</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[13px]">
                <p className="font-bold text-slate-400 uppercase tracking-widest">Operator</p>
                <p className="font-black text-slate-800 uppercase tracking-tighter">{bus?.busName}</p>
              </div>

              <div className="flex justify-between items-center text-[13px]">
                <p className="font-bold text-slate-400 uppercase tracking-widest">Route</p>
                <p className="font-black text-slate-800 capitalize tracking-tighter">{bus?.source} → {bus?.destination}</p>
              </div>

              <div className="flex justify-between items-center text-[13px]">
                <p className="font-bold text-slate-400 uppercase tracking-widest">Departure</p>
                <p className="font-black text-slate-800 tracking-tighter">{date} | {bus?.departureTime}</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 my-4 shadow-inner">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Your Selection</p>
                <div className="flex flex-wrap gap-2 min-h-[25px]">
                  {selectedSeats.length > 0 ? selectedSeats.map(s => (
                    <span key={s} className="bg-sky-100 text-blue-900 px-3 py-0.5 rounded text-[10px] font-black border border-sky-200 uppercase tracking-tighter">Seat {s}</span>
                  )) : <span className="text-slate-400 text-[11px] italic font-medium tracking-tight">Please pick a seat to proceed...</span>}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center gap-2">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Total Fare</p>
                  <p className="text-3xl font-black text-blue-900 leading-none mt-2">₹{(selectedSeats.length * (bus?.price || 0)).toLocaleString()}</p>
                </div>
                <button 
                  disabled={selectedSeats.length === 0} 
                  onClick={() => navigate("/checkout", { state: { selectedSeats, bus, date, total: selectedSeats.length * bus.price } })} 
                  className={`px-8 py-3 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                    selectedSeats.length === 0 ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" : "bg-sky-500 text-white hover:bg-sky-600 shadow-sky-100"
                  }`}
                >
                  Continue →
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}