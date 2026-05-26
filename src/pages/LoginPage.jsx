import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (input.length !== 10) return; 

    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: input }),
      });

      if (response.ok) {
        navigate("/otp", { state: { phone: input } });
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 items-stretch">
      
      {/* Branding Column - Collapses completely on screens smaller than md breakpoint */}
      <div className="hidden md:flex w-1/2 bg-blue-900 text-white p-10 flex-col justify-center">
        <h2 className="text-sm uppercase tracking-widest text-orange-400 mb-4 font-semibold">Premier Travel</h2>
        <h1 className="text-4xl font-black mb-4 leading-tight">Your journey starts with a simple step.</h1>
        <p className="text-gray-300 font-medium">Experience the future of intercity transit.</p>
      </div>

      {/* Authentication Form Card Wrapper Container */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-4 sm:p-6">
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md">
          <h2 className="text-lg sm:text-xl font-bold text-blue-700 mb-1">GoBus</h2>
          <h1 className="text-2xl sm:text-3xl font-black mb-6 text-slate-800">Login</h1>
          
          {/* Contact Input Composite Layout */}
          <div className="flex gap-2 mb-6 w-full items-center">
             <span className="p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 font-bold text-sm sm:text-base select-none shrink-0">
               +91
             </span>
             <input
                type="text"
                placeholder="Enter your phone number"
                value={input}
                onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base font-semibold text-gray-800 outline-none transition-all placeholder-gray-400"
              />
          </div>
          
          <button
            onClick={handleContinue}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3.5 rounded-lg font-bold text-sm sm:text-base tracking-wide transition-all shadow-md active:scale-98"
          >
            Continue →
          </button>
        </div>
      </div>

    </div>
  );
}