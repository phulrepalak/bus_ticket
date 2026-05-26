import React from "react";
import { useNavigate } from "react-router-dom";

export default function AccountCreated() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">

        {/* Promotional Banner Image */}
        <div 
          className="h-40 sm:h-48 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957)"
          }}
        ></div>

        {/* Content Section */}
        <div className="p-5 sm:p-6 text-center">

          {/* Verification Badge */}
          <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-xl mx-auto -mt-12 sm:-mt-10 shadow-lg relative z-10 text-lg font-bold">
            ✓
          </div>

          <p className="text-[10px] sm:text-xs text-gray-500 mt-4 uppercase tracking-wider font-semibold">
            Verification Complete
          </p>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-2 px-2">
            Account Created Successfully
          </h2>

          <p className="text-gray-500 text-xs sm:text-sm mt-2 px-1 leading-relaxed">
            Your journey with GoBus starts here. Your account has been
            verified and you're ready to explore.
          </p>

          {/* User Tier Benefits Grid */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <div className="flex-1 bg-gray-100 p-3 rounded-lg text-sm text-center sm:text-left">
              <p className="font-semibold text-gray-800">Priority Access</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Early booking windows
              </p>
            </div>

            <div className="flex-1 bg-gray-100 p-3 rounded-lg text-sm text-center sm:text-left">
              <p className="font-semibold text-gray-800">Rewards</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Earn points on every trip
              </p>
            </div>
          </div>

          {/* Action Callouts */}
          <button
            onClick={() => navigate("/complete-profile")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 active:scale-[0.99] transition text-sm font-semibold shadow-md"
          >
            Proceed to Complete Profile →
          </button>

          <p 
            onClick={() => navigate("/")}
            className="text-xs sm:text-sm text-gray-500 mt-4 cursor-pointer hover:text-blue-600 font-medium inline-block transition-colors"
          >
            Explore Destinations First
          </p>

        </div>
      </div>
    </div>
  );
}