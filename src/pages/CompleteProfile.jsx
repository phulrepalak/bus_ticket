import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompleteProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!formData.fullName || !formData.email || !formData.gender) {
      alert("Please fill all details");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/complete-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile created successfully!");
        navigate("/home");
        window.location.reload(); 
      } else {
        alert(data.message || "Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Profile Update Error:", error);
      alert("Server error, please try again.");
    }
  };

  const handleSkip = () => {
    const phone = localStorage.getItem("tempPhone") || "";
    localStorage.setItem("user", JSON.stringify({ phone: phone, email: "" })); 
    navigate("/"); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-3 sm:p-6 antialiased">
      <div className="bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full overflow-hidden">
        
        {/* Left Informational Column */}
        <div className="p-6 sm:p-8 flex flex-col justify-center bg-white w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight leading-tight">
            Personalize your journey with <span className="text-blue-600">GoBus</span>
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-3 leading-relaxed">
            Help us tailor your GoBus experience. Your details ensure
            smoother bookings and exclusive traveler perks.
          </p>
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957"
            alt="Bus"
            className="rounded-xl mt-5 sm:mt-6 shadow w-full object-cover h-40 sm:h-auto hidden xs:block"
          />
          <div className="bg-gray-100 p-4 rounded-lg mt-4 text-xs sm:text-sm italic text-gray-600 border border-transparent">
            "The most seamless bus booking I've experienced."
            <p className="text-[10px] sm:text-xs mt-1 text-gray-400 not-italic font-semibold">— Premium Member</p>
          </div>
        </div>

        {/* Right Input Form Column */}
        <div className="p-6 sm:p-8 bg-gray-50 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 w-full">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-5 sm:mb-6 tracking-tight">Complete Profile</h3>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="w-full">
              <label className="text-xs sm:text-sm font-semibold text-gray-600">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full mt-1.5 p-3 border border-gray-200 rounded-lg bg-white text-sm text-gray-800 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="w-full">
              <label className="text-xs sm:text-sm font-semibold text-gray-600">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gobus.com"
                className="w-full mt-1.5 p-3 border border-gray-200 rounded-lg bg-white text-sm text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="w-full">
              <label className="text-xs sm:text-sm font-semibold text-gray-600">Gender</label>
              <div className="flex gap-2 sm:gap-3 mt-2 w-full">
                {["Male", "Female", "Other"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-bold border transition-all truncate ${
                      formData.gender === g
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg mt-6 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-98 text-sm sm:text-base tracking-wide"
            >
              Submit
            </button>

            <p
              onClick={handleSkip}
              className="text-xs sm:text-sm text-center text-gray-400 hover:text-blue-600 cursor-pointer mt-4 font-medium transition-colors inline-block w-full"
            >
              Skip for now
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}