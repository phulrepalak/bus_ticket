import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SelectSeat() {
  const { busId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { bus: initialBus, date, boardingFilter, droppingFilter } = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]); 
  const [bus, setBus] = useState(initialBus);
  const [loading, setLoading] = useState(true);
  
  // Synchronize latest structural seat reservation state arrays from backend repositories
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        setLoading(true);
        let formattedDate = "";
        if (date) {
          formattedDate = String(date).split('T')[0]; 
        }

        const response = await axios.get(`http://localhost:5000/api/bus/${busId}?date=${formattedDate}`);
        
        if (response.data) {
          const seatsFromDB = (response.data.bookedSeats || []).map(s => String(s).trim());
          setBookedSeats(seatsFromDB);
          if (!bus) setBus(response.data.bus || response.data);
        }
      } catch (error) {
        console.error("Seat status fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (busId) {
      fetchBookedSeats();
    }
  }, [busId, date]);

  const handleSeatClick = (seatId) => {
    const isAlreadyBooked = bookedSeats.includes(String(seatId).trim());
    if (isAlreadyBooked) return;
    
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  // Atomic Seating Matrix Component Frame
  const Seat = ({ id, type }) => {
    const isBooked = bookedSeats.includes(String(id).trim());
    const isSelected = selectedSeats.includes(id);

    let sizeClass = type === "Sleeper" ? "w-14 h-7 sm:w-16 sm:h-8" : "w-9 h-9 sm:w-10 sm:h-10";
    let baseClass = `relative transition-all duration-200 cursor-pointer rounded-md border-[1.2px] flex flex-col items-center justify-center font-bold text-xs ${sizeClass} `;

    if (isBooked) {
      baseClass += "bg-slate-400 border-slate-500 text-white cursor-not-allowed opacity-90";
    } else if (isSelected) {
      baseClass += "bg-sky-500 border-sky-600 text-white shadow-md shadow-sky-200 scale-105 z-20";
    } else {
      baseClass += "bg-white border-slate-200 text-slate-500 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600";
    }

    return (
      <div 
        onClick={() => !isBooked && handleSeatClick(id)} 
        className={baseClass}
      >
        {!isBooked && !isSelected && (
          <span className="text-[7px] sm:text-[7.5px] text-slate-300 font-medium">Hex</span>
        )}
        {isSelected && (
          <div className="absolute -top-8 bg-slate-900 text-white text-[9px] py-1 px-2 rounded shadow-xl flex items-center gap-1 z-30">
            <span className="font-bold">{id}</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-900 rotate-45"></div>
          </div>
        )}
        <span className={isSelected ? "text-white text-[9px] sm:text-[10px]" : "text-[9px] sm:text-[10px]"}>{id}</span>
        {!isBooked && !isSelected && (
          <div className="absolute bottom-1 w-4 sm:w-5 h-0.5 bg-slate-100 rounded-full"></div>
        )}
      </div>
    );
  };

  // Structural Factory Interface computing current target vehicle configuration profiles
  const BusLayout = () => {
    const totalSeatsCount = bus?.availableSeats || 30;

    const SeaterOnly = () => {
      const rows = [];
      const rowCount = Math.ceil(totalSeatsCount / 4);
      for (let i = 0; i < rowCount; i++) {
        const start = i * 4 + 1;
        rows.push(
          <div key={i} className="flex gap-2 sm:gap-2.5 justify-center items-center w-full">
            {start <= totalSeatsCount && <Seat id={String(start)} type="Seater" />}
            {start + 1 <= totalSeatsCount && <Seat id={String(start + 1)} type="Seater" />}
            <div className="w-6 sm:w-8"></div>
            {start + 2 <= totalSeatsCount && <Seat id={String(start + 2)} type="Seater" />}
            {start + 3 <= totalSeatsCount && <Seat id={String(start + 3)} type="Seater" />}
          </div>
        );
      }
      return <div className="flex flex-col gap-2 sm:gap-2.5 w-full">{rows}</div>;
    };

    const SleeperOnly = () => {
      const perDeck = Math.ceil(totalSeatsCount / 2);
      const renderDeck = (prefix, count) => {
        const deckRows = [];
        for (let i = 1; i <= count; i += 3) {
          deckRows.push(
            <div key={i} className="flex gap-3 sm:gap-6 justify-center items-center w-full">
              <Seat id={`${prefix}${i}`} type="Sleeper" />
              <div className="w-2 sm:w-4"></div>
              {i + 1 <= count && <Seat id={`${prefix}${i + 1}`} type="Sleeper" />}
              {i + 2 <= count && <Seat id={`${prefix}${i + 2}`} type="Sleeper" />}
            </div>
          );
        }
        return deckRows;
      };
      return (
        <div className="flex flex-col gap-6 w-full">
          <div className="p-2 sm:p-3 bg-slate-50/50 rounded-xl border border-slate-100 w-full">
            <p className="text-center text-[9px] font-black text-slate-400 mb-2 uppercase">Lower Deck</p>
            <div className="flex flex-col gap-2 sm:gap-2.5 w-full">{renderDeck("L", perDeck)}</div>
          </div>
          <div className="p-2 sm:p-3 bg-slate-50/50 rounded-xl border border-slate-100 w-full">
            <p className="text-center text-[9px] font-black text-slate-400 mb-2 uppercase">Upper Deck</p>
            <div className="flex flex-col gap-2 sm:gap-2.5 w-full">{renderDeck("U", perDeck)}</div>
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
            <div key={i} className="flex gap-2 sm:gap-2.5 justify-center items-center w-full">
              <Seat id={`L${i}`} type="Seater" />
              {i + 1 <= lowerCount && <Seat id={`L${i + 1}`} type="Seater" />}
              <div className="w-4 sm:w-6"></div>
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
            <div key={i} className="flex gap-3 sm:gap-6 justify-center items-center w-full">
              <Seat id={`U${i}`} type="Sleeper" />
              <div className="w-2 sm:w-4"></div>
              {i + 1 <= upperCount && <Seat id={`U${i + 1}`} type="Sleeper" />}
              {i + 2 <= upperCount && <Seat id={`U${i + 2}`} type="Sleeper" />}
            </div>
          );
        }
        return rows;
      };
      return (
        <div className="flex flex-col gap-6 w-full">
          <div className="p-2 sm:p-3 bg-slate-50/50 rounded-xl border border-slate-100 w-full">
            <p className="text-center text-[9px] font-black text-slate-400 mb-2 uppercase tracking-tighter">Lower Seater</p>
            <div className="flex flex-col gap-2 sm:gap-2.5 w-full">{renderLower()}</div>
          </div>
          <div className="p-2 sm:p-3 bg-slate-50/50 rounded-xl border border-slate-100 w-full">
            <p className="text-center text-[9px] font-black text-slate-400 mb-2 uppercase tracking-tighter">Upper Sleeper</p>
            <div className="flex flex-col gap-2 sm:gap-2.5 w-full">{renderUpper()}</div>
          </div>
        </div>
      );
    };

    if (bus?.seatType === "Sleeper") return <SleeperOnly />;
    if (bus?.seatType === "Semi-Sleeper") return <SemiSleeper />;
    return <SeaterOnly />;
  };

  if (!bus && loading) return <div className="p-10 sm:p-20 text-center font-black uppercase italic tracking-widest text-slate-300 text-sm sm:text-base">Synchronizing Seats...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6 flex justify-center items-start text-left antialiased">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* LEFT COMPONENT: BUS DECK CHASSIS */}
        <div className="col-span-1 lg:col-span-7 bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-slate-100 relative w-full">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1 w-full">
            <div className="w-full sm:w-auto">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter uppercase break-all">{bus?.busName}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded border border-blue-100 uppercase tracking-widest whitespace-nowrap">{bus?.seatType}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[180px] sm:max-w-none">{bus?.source} → {bus?.destination}</span>
              </div>
            </div>
            
            {/* Legend indicators row with fluid wrapping */}
            <div className="flex flex-wrap gap-2.5 items-center justify-start sm:justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-50">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap">
                <div className="w-3 h-3 bg-white border border-slate-200 rounded-sm"></div> Avail.
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap">
                <div className="w-3 h-3 bg-slate-400 rounded-sm"></div> Booked
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-sky-600 uppercase tracking-tighter whitespace-nowrap">
                <div className="w-3 h-3 bg-sky-500 rounded-sm"></div> Selected
              </div>
            </div>
          </div>
          
          <div className="relative bg-[#FAFBFC] rounded-2xl py-6 sm:py-8 px-2 sm:px-4 border border-slate-50 flex flex-col items-center w-full overflow-x-auto">
            <div className="min-w-[260px] sm:min-w-0 w-full flex flex-col items-center">
              <BusLayout />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: STICKY TRIP BREAKDOWN METRICS */}
        <div className="col-span-1 lg:col-span-5 lg:sticky lg:top-6 w-full">
          <div className="bg-white rounded-[2rem] p-5 sm:p-8 text-slate-800 shadow-2xl border border-slate-100 w-full">
            <h3 className="text-lg sm:text-xl font-black text-slate-800 border-b border-slate-50 pb-4 mb-5 sm:mb-6 tracking-widest uppercase">Booking Details</h3>
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center text-xs sm:text-[13px] gap-4">
                <p className="font-bold text-slate-400 uppercase tracking-widest shrink-0">Operator</p>
                <p className="font-black text-slate-800 uppercase tracking-tighter truncate max-w-[60%]">{bus?.busName}</p>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-[13px] gap-4">
                <p className="font-bold text-slate-400 uppercase tracking-widest shrink-0">Route</p>
                <p className="font-black text-slate-800 capitalize tracking-tighter truncate max-w-[60%]">{bus?.source} → {bus?.destination}</p>
              </div>
              <div className="flex justify-between items-start text-xs sm:text-[13px] gap-4">
                <p className="font-bold text-slate-400 uppercase tracking-widest shrink-0">Departure</p>
                <p className="font-black text-slate-800 tracking-tighter text-right break-words max-w-[65%]">{date} | {bus?.departureTime}</p>
              </div>

              {/* Real-time selection badge tray view */}
              <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-100 my-4 shadow-inner min-h-[80px] w-full">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Your Selection</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((s) => (
                      <span key={s} className="bg-sky-100 text-blue-900 px-2.5 py-0.5 rounded text-[10px] font-black border border-sky-200 uppercase tracking-tighter whitespace-nowrap">Seat {s}</span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-[11px] italic font-medium tracking-tight">Please pick a seat to proceed...</span>
                  )}
                </div>
              </div>

              {/* Transaction billing actions trigger */}
              <div className="pt-4 border-t border-slate-100 flex flex-row items-center justify-between gap-4 w-full">
                <div className="shrink-0">
                  <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Total Fare</p>
                  <p className="text-2xl sm:text-3xl font-black text-blue-900 leading-none mt-2">₹{(selectedSeats.length * (bus?.price || 0)).toLocaleString()}</p>
                </div>
                <button
                  type="button"
                  disabled={selectedSeats.length === 0}
                  onClick={() =>
                    navigate("/checkout", {
                      state: {
                        selectedSeats,
                        bus,
                        date,
                        boardingFilter: boardingFilter || [],
                        droppingFilter: droppingFilter || [],
                        total: selectedSeats.length * (bus?.price || 0),
                      },
                    })
                  }
                  className={`px-5 sm:px-8 py-3.5 rounded-2xl font-black text-[11px] sm:text-[12px] uppercase tracking-widest transition-all shadow-lg active:scale-95 text-center whitespace-nowrap ${
                    selectedSeats.length === 0
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-sky-500 text-white hover:bg-sky-600 shadow-sky-100"
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