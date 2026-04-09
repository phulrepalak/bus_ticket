import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state || {};
  const { 
    selectedSeats = [], 
    bus = null, 
    date = "N/A", 
    total = 0, 
    boardingFilter = [], 
    droppingFilter = [] 
  } = stateData;

  const [passengers, setPassengers] = useState(
    selectedSeats?.length > 0 
      ? selectedSeats.map((seat) => ({ seat, name: "", age: "", gender: "M" }))
      : []
  );

  const [contact, setContact] = useState({ email: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);

  const [points, setPoints] = useState({ 
    boarding: bus?.boardingPoints?.find(p => boardingFilter?.includes(p.location))?.location || "", 
    dropping: bus?.droppingPoints?.find(p => droppingFilter?.includes(p.location))?.location || "" 
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          const data = await response.json();
          if (response.ok) {
            setContact({ email: data.email || "", phone: data.phone || "" });
          }
        } catch (error) {
          console.error("Fetch Error:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserData();
    }
  }, []);

  const handleInputChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const isFormValid = 
    !isLoading &&
    points.boarding && 
    points.dropping && 
    contact.email && 
    contact.phone?.length >= 10 &&
    passengers.every(p => p.name?.trim() !== "" && p.age !== "");

  const handleConfirmBooking = () => {
    if (!isFormValid) return;
    navigate("/payment", { 
      state: { 
        passengers, 
        bus, 
        date, 
        total: total + 45, 
        points, 
        contact,
        isGuest: !localStorage.getItem("token")
      } 
    });
  };

  if (!bus || selectedSeats.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-10 rounded-3xl shadow-sm text-center border border-slate-200">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Session Expired</h2>
          <button onClick={() => navigate("/")} className="mt-6 bg-blue-900 text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all hover:bg-blue-800">Back to Search</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-left text-slate-800 tracking-tight">
      
      {/* Header - Clean and Professional */}
      <div className="bg-white shadow-sm border-b mb-8 py-6 px-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tighter leading-none">{bus?.busName}</h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              {bus?.seatType} • {bus?.source} → {bus?.destination}
            </p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Journey Date</p>
             <p className="text-lg font-black text-slate-700 mt-1 uppercase leading-none">{date}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. CONTACT INFO - Balanced Spacing */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-3">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-900 transition-all" placeholder="Enter Email" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input type="text" value={contact.phone} onChange={(e) => setContact({...contact, phone: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-900 transition-all" placeholder="Enter Mobile" />
              </div>
            </div>
          </div>

          {/* 2. BOARDING & DROPPING  */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-3">Selection Points</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Boarding From</label>
                <select className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-900" value={points.boarding} onChange={(e) => setPoints({...points, boarding: e.target.value})}>
                  <option value="">Choose Boarding Point</option>
                  {bus?.boardingPoints?.map((p, i) => <option key={i} value={p.location}>{p.location} ({p.time})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dropping To</label>
                <select className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-900" value={points.dropping} onChange={(e) => setPoints({...points, dropping: e.target.value})}>
                  <option value="">Choose Dropping Point</option>
                  {bus?.droppingPoints?.map((p, i) => <option key={i} value={p.location}>{p.location} ({p.time})</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 3. PASSENGER INFORMATION */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-8 border-b border-slate-50 pb-3">Passenger Information</h3>
            {passengers.map((p, index) => (
              <div key={index} className="mb-8 last:mb-0 pb-8 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 mb-5">
                  <span className="bg-blue-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black">{p.seat}</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seat Number {p.seat}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-6 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Full Name</label>
                    <input type="text" placeholder="Enter Name" className="w-full p-3.5 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-900" onChange={(e) => handleInputChange(index, "name", e.target.value)} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Age</label>
                    <input type="number" placeholder="00" className="w-full p-3.5 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-900" onChange={(e) => handleInputChange(index, "age", e.target.value)} />
                  </div>
                  <div className="md:col-span-4 flex gap-2">
                    {["M", "F"].map((g) => (
                      <button key={g} onClick={() => handleInputChange(index, "gender", g)} className={`flex-1 py-3.5 border rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${p.gender === g ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-400 border-slate-200'}`}>{g === "M" ? "Male" : "Female"}</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4. CANCELLATION POLICY  */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-3">Cancellation Policy</h3>
            <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
               <div className="grid grid-cols-2 bg-slate-50 p-3 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Time before Departure</span>
                  <span className="text-right">Refund Percentage</span>
               </div>
               <div className="grid grid-cols-2 p-4 border-b border-slate-50 text-xs font-bold text-slate-600 italic">
                  <span>More than 24 Hours</span>
                  <span className="text-right text-green-600 uppercase font-black">90% Refund</span>
               </div>
               <div className="grid grid-cols-2 p-4 text-xs font-bold text-slate-600 italic">
                  <span>Within 24 Hours</span>
                  <span className="text-right text-red-500 uppercase font-black">No Refund</span>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN  */}
        <div className="lg:col-span-4 space-y-6">
           <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-4 mb-6 uppercase tracking-widest font-sans">Fare Summary</h3>
                <div className="space-y-4 pb-4 border-b border-dashed border-slate-100">
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                    <span>Base Fare (x{passengers.length})</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                    <span>Taxes & Service Fee</span>
                    <span>₹45</span>
                  </div>
                </div>
                <div className="pt-5">
                   <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-2 tracking-widest">Total Payable Amount</p>
                   <p className="text-3xl font-black text-blue-900 mt-1 tracking-tighter leading-none">₹{total + 45}</p>
                </div>
                <button 
                  onClick={handleConfirmBooking} 
                  disabled={!isFormValid || isLoading} 
                  className={`w-full py-5 mt-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${isFormValid ? 'bg-blue-900 text-white shadow-blue-100 hover:bg-blue-800' : 'bg-slate-100 text-slate-300'}`}
                > 
                  Proceed to Payment 
                </button>
              </div>

              {/* AMENITIES - Compact Grid */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest border-b pb-2">Included Amenities</p>
                 <div className="flex flex-wrap gap-2">
                    {bus?.amenities?.map((a, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-tight"> {a} </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}