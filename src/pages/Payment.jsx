import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const { passengers, bus, date, total, points, contact, isGuest } = location.state || {};

  // Persist transactional state and booking details to backend database
  const saveBookingToDb = async (paymentId) => {
    const bookingData = {
      busId: bus._id,
      seats: passengers.map(p => p.seat),
      passengerDetails: passengers,
      totalAmount: total,
      journeyDate: date,
      boardingPoint: points.boarding,
      droppingPoint: points.dropping,
      contact: contact,
      paymentId: paymentId,
      paymentStatus: "Completed",
      isGuest: isGuest
    };

    try {
      const response = await fetch("http://localhost:5000/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      if (response.ok) {
        if (isGuest) {
          localStorage.setItem("isGuest", "true");
        }
        
        navigate("/ticket-confirmation", { state: { ticket: data.ticket } });
      } else {
        alert("Booking failed: " + data.message);
      }
    } catch (error) {
      console.error("DB Error:", error);
      alert("Payment successful but booking failed. Please contact support.");
    }
  };

  // Launch Razorpay checkout instance gateway module
  const handleRazorpayPayment = async () => {
    setIsProcessing(true);

    try {
      const orderRes = await fetch("http://localhost:5000/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error("Order creation failed");

      const options = {
        key: "rzp_test_SabJRsrMi6ZAtz", 
        amount: orderData.amount, 
        currency: "INR",
        name: "GoBus",
        description: "Bus Ticket Booking",
        order_id: orderData.id,
        handler: async function (response) {
          console.log("Payment Successful:", response.razorpay_payment_id);
          await saveBookingToDb(response.razorpay_payment_id);
        },
        prefill: {
          name: passengers[0]?.name || "User",
          email: contact?.email || "",
          contact: contact?.phone || "",
        },
        theme: {
          color: "#1e3a8a", 
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment gateway error. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!bus) return <div className="p-10 sm:p-20 text-center font-black">Invalid Session</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-left text-slate-800 antialiased">
      
      {/* Top Banner Context Section */}
      <div className="bg-white shadow-sm border-b mb-6 sm:mb-8 py-4 sm:py-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-row justify-between items-center gap-2">
          <h2 className="text-lg sm:text-xl font-black text-blue-900 uppercase tracking-tighter">Secure Checkout</h2>
          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest text-right shrink-0">Powered by Razorpay</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        
        {/* LEFT COLUMN: PRIMARY TRANSACTION DETAILS */}
        <div className="md:col-span-7 space-y-4 w-full">
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-slate-200 shadow-sm w-full">
            <h3 className="text-xs sm:text-sm font-black text-blue-900 uppercase tracking-widest mb-4 sm:mb-6">Payment Summary</h3>
            
            <div className="space-y-4 text-[11px] sm:text-xs font-bold text-slate-600 uppercase">
              <div className="flex justify-between items-start gap-4 border-b border-slate-50 pb-2">
                <span className="text-slate-400 shrink-0">Route</span>
                <span className="text-right break-words max-w-[70%]">{bus.source} → {bus.destination}</span>
              </div>
              <div className="flex justify-between items-center gap-4 border-b border-slate-50 pb-2">
                <span className="text-slate-400 shrink-0">Date</span>
                <span className="text-right whitespace-nowrap">{date}</span>
              </div>
              <div className="flex justify-between items-start gap-4 border-b border-slate-50 pb-2">
                <span className="text-slate-400 shrink-0">Seats</span>
                <span className="text-right break-all max-w-[70%]">{passengers.map(p => p.seat).join(", ")}</span>
              </div>
            </div>
          </div>

          <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium px-2 sm:px-4 leading-relaxed uppercase tracking-widest italic">
            * Do not refresh the page or press back button during payment.
          </p>
        </div>

        {/* RIGHT COLUMN: ACTION AND PRICING CONTAINER */}
        <div className="md:col-span-5 w-full">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md w-full">
            <h3 className="text-xs sm:text-sm font-black text-slate-800 border-b pb-4 mb-4 uppercase tracking-widest">Grand Total</h3>
            
            <p className="text-4xl sm:text-5xl font-black text-blue-900 tracking-tighter mt-4 mb-6 sm:mb-8">₹{total}</p>

            <button 
              type="button"
              onClick={handleRazorpayPayment}
              disabled={isProcessing}
              className={`w-full py-4 sm:py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 text-center ${
                isProcessing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-900 text-white shadow-blue-100 hover:bg-blue-800'
              }`}
            >
              {isProcessing ? "Opening Secure Gateway..." : "Pay with Razorpay"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}