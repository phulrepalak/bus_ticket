import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompleteProfile() {
  const navigate = useNavigate();

  // 1. State for form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
  });

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit handler
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
          "Authorization": token, // Backend middleware decoded user id yahan se nikalega
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        navigate("/home");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Profile Update Error:", error);
      alert("Server error, please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg grid md:grid-cols-2 max-w-5xl w-full overflow-hidden">
        
        {/* Left Side */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Personalize your journey with GoBus
          </h2>
          <p className="text-gray-500 mt-3">
            Help us tailor your GoBus experience. Your details ensure
            smoother bookings and exclusive traveler perks.
          </p>
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957"
            alt="Bus"
            className="rounded-xl mt-6 shadow"
          />
          <div className="bg-gray-100 p-4 rounded-lg mt-4 text-sm italic">
            "The most seamless bus booking I've experienced."
            <p className="text-xs mt-1 text-gray-500">— Premium Member</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-8 bg-gray-50">
          <h3 className="text-xl font-semibold mb-6">Complete Profile</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Gender</label>
              <div className="flex gap-3 mt-2">
                {["Male", "Female", "Other"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`flex-1 border py-2 rounded-lg transition ${
                      formData.gender === g
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition"
            >
              Submit
            </button>

            <p
              onClick={() => navigate("/home")}
              className="text-sm text-center text-gray-500 cursor-pointer hover:text-blue-600 mt-3"
            >
              Skip for now
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}