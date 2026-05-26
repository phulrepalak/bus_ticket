import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();
  const userPhone = location.state?.phone;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.querySelectorAll("input")[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  // Handle re-dispatching authentication credentials to target destination
  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/send-otp", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: userPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("OTP sent successfully!");
        setOtp(["", "", "", "", "", ""]); 
      } else {
        alert(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend Error:", error);
      alert("Error connecting to server.");
    } finally {
      loading && setLoading(false);
    }
  };

  // Validate operational payloads and synchronize storage vectors
  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: userPhone, otp: finalOtp }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("isGuest");
        localStorage.removeItem("guestTicketId");
        localStorage.setItem("token", data.token);
        
        const userRole = data.role || "user";
        localStorage.setItem("role", userRole);

        if (userRole === "admin") {
          navigate("/");
        } else {
          if (data.isProfileComplete === false) {
            navigate("/account-created");
          } else {
            navigate("/");
          }
        }
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verification Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-3 sm:p-4 antialiased">
      <div className="bg-white shadow-xl rounded-2xl p-5 sm:p-8 w-full max-w-md text-center border border-gray-100">
        <h2 className="text-lg sm:text-xl font-bold text-blue-700 mb-1">GoBus</h2>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">Verify OTP</h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-6 font-medium break-words px-2">
          OTP sent to: <b className="text-slate-800 font-bold whitespace-nowrap">+91 {userPhone}</b>
        </p>

        {/* Responsive OTP Matrix Wrapper */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mb-6 w-full max-w-xs mx-auto">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-full max-w-[44px] h-12 sm:h-14 border-2 border-gray-200 rounded-xl text-center text-lg sm:text-xl font-black bg-white focus:border-blue-500 text-slate-800 outline-none transition-all shadow-inner"
              maxLength={1}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm sm:text-base tracking-wide hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 active:scale-98"
        >
          Verify OTP →
        </button>
        
        <button 
          onClick={handleResendOTP}
          disabled={loading}
          className={`mt-5 text-xs sm:text-sm font-semibold block mx-auto transition-all ${
            loading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 hover:underline'
          }`}
        >
          {loading ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}