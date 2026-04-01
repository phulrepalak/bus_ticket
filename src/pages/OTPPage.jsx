import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const location = useLocation();
  const navigate = useNavigate();
  const userPhone = location.state?.phone;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementsByTagName('input')[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return;

    try {
      // Backend API call (Twilio OTP verify karne ke liye)
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: userPhone, otp: finalOtp }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        if (data.isProfileComplete === false) {
          navigate("/account-created");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Verification Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">GoBus</h2>
        <h1 className="text-2xl font-bold mb-2">Verify OTP</h1>
        <p className="text-gray-500 mb-6">OTP sent to: <b>+91 {userPhone}</b></p>
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
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          Verify OTP →
        </button>
      </div>
    </div>
  );
}