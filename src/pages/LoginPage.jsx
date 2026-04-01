import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (input.length !== 10) return; // Bina alert ke silent return

    try {
      const response = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: input }),
      });

      if (response.ok) {
        // Bina alert ke seedha navigate
        navigate("/otp", { state: { phone: input } });
      }
    } catch (error) {
      console.error("Login Error:", error);
      // Fail hone par bhi testing ke liye navigate kar sakte hain agar backend setup na ho
      // navigate("/otp", { state: { phone: input } }); 
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="hidden md:flex w-1/2 bg-blue-900 text-white p-10 flex-col justify-center">
        <h2 className="text-sm uppercase tracking-widest text-orange-400 mb-4">Premier Travel</h2>
        <h1 className="text-4xl font-bold mb-4">Your journey starts with a simple step.</h1>
        <p className="text-gray-300">Experience the future of intercity transit.</p>
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">GoBus</h2>
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <div className="flex gap-2 mb-4">
             <span className="p-3 border rounded-lg bg-gray-50 text-gray-600">+91</span>
             <input
                type="text"
                placeholder="98765 43210"
                value={input}
                onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
          </div>
          <button
            onClick={handleContinue}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}