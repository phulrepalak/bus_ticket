import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false); // Loading state resend ke liye
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

  // --- NEW: RESEND OTP FUNCTION ---
  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/send-otp", { // Aapki OTP send karne wali API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: userPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("OTP sent successfully!");
        setOtp(["", "", "", "", "", ""]); // OTP inputs clear kar dein
      } else {
        alert(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend Error:", error);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">GoBus</h2>
        <h1 className="text-2xl font-bold mb-2">Verify OTP</h1>
        <p className="text-gray-500 mb-6">
          OTP sent to: <b>+91 {userPhone}</b>
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-14 border-2 rounded-lg text-center text-xl font-bold focus:border-blue-500 outline-none"
              maxLength={1}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all shadow-lg"
        >
          Verify OTP →
        </button>
        
        {/* UPDATED: Resend OTP Button */}
        <button 
          onClick={handleResendOTP}
          disabled={loading}
          className={`mt-4 text-sm font-medium ${loading ? 'text-gray-400' : 'text-blue-600 hover:underline'}`}
        >
          {loading ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}