import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FAQ() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { q: "Can I book a ticket without creating an account?", a: "Yes! You can use our 'Guest Booking' option by just providing basic traveler details. Your booking state will be tracked temporarily." },
    { q: "How does OTP verification work during login?", a: "When you enter your phone number, a 6-digit secure OTP is simulated/sent. Entering it verified your active profile instantly." },
    { q: "Where can I see my booking history?", a: "Registered users can click on the 'My Booking' tab in the navbar to check their Upcoming, Past, and Cancelled trips." },
    { q: "What should I do if my payment fails but money is deducted?", a: "Don't worry. If money is deducted, it will either be automatically refunded within 3 business days or your ticket status will change to 'Confirmed' shortly. You can check the status using your PNR." },
    { q: "Can I check the specific route of the bus before booking?", a: "Currently, you can search via Source and Destination. Route tracking and intermediary local bus stops feature is in active development for the future scope." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-left text-slate-800">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate("/")} className="mb-6 text-sm font-semibold text-sky-600 hover:underline">← Back to Home</button>
        
        <h1 className="text-3xl font-black text-slate-950 mb-2">Frequently Asked Questions</h1>
        <p className="text-slate-500 mb-8">Find answers to common queries regarding your GoBus travel experience.</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all">
              <button 
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full p-5 text-left font-bold text-slate-900 flex justify-between items-center hover:bg-slate-50"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 text-xl">{activeIndex === index ? "−" : "+"}</span>
              </button>
              {activeIndex === index && (
                <div className="p-5 pt-0 text-sm text-slate-600 border-t border-slate-50 leading-relaxed bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}   