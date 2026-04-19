import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Checkout page se aaya hua  data
  const { passengers, bus, date, total, points, contact, isGuest } = location.state || {};

  // --- STEP 1: Backend mein Booking Save karna (After Payment) ---
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
        // --- GUEST STATUS UPDATE FOR NAVBAR ---
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

  // --- STEP 2: Razorpay Popup Logic ---
  const handleRazorpayPayment = async () => {
    setIsProcessing(true);

    try {
      // 1. Backend se Order create karwao
      const orderRes = await fetch("http://localhost:5000/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error("Order creation failed");

      // 2. Razorpay Options Configure karein
      const options = {
        key: "rzp_test_SabJRsrMi6ZAtz", 
        amount: orderData.amount, 
        currency: "INR",
        name: "GoBus",
        description: "Bus Ticket Booking",
        order_id: orderData.id,
        handler: async function (response) {
          // Payment Success hone par ye function chalega
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

  if (!bus) return <div className="p-20 text-center font-black">Invalid Session</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans text-left text-slate-800">
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b mb-8 py-6 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h2 className="text-xl font-black text-blue-900 uppercase tracking-tighter">Secure Checkout</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Powered by Razorpay</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* LEFT: PAYMENT INFO */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-6">Payment Summary</h3>
            
            <div className="space-y-4 text-xs font-bold text-slate-600 uppercase">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400">Route</span>
                <span>{bus.source} → {bus.destination}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400">Date</span>
                <span>{date}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400">Seats</span>
                <span>{passengers.map(p => p.seat).join(", ")}</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium px-4 leading-relaxed uppercase tracking-widest italic">
            * Do not refresh the page or press back button during payment.
          </p>
        </div>

        {/* RIGHT: FARE & PAY BUTTON */}
        <div className="md:col-span-5">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md">
            <h3 className="text-sm font-black text-slate-800 border-b pb-4 mb-4 uppercase tracking-widest">Grand Total</h3>
            
            <p className="text-5xl font-black text-blue-900 tracking-tighter mt-4 mb-8">₹{total}</p>

            <button 
              onClick={handleRazorpayPayment}
              disabled={isProcessing}
              className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
                isProcessing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-900 text-white shadow-blue-100'
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