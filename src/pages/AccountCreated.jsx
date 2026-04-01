import React from "react";
import { useNavigate } from "react-router-dom";

export default function AccountCreated() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">

        {/* Image */}
        <div className="h-48 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957)"
          }}
        ></div>

        {/* Content */}
        <div className="p-6 text-center">

          <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-xl mx-auto -mt-10 shadow-lg">
            ✓
          </div>

          <p className="text-xs text-gray-500 mt-4 uppercase">
            Verification Complete
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            Account Created Successfully
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Your journey with GoBus starts here. Your account has been
            verified and you're ready to explore.
          </p>

          {/* Features */}
          <div className="flex gap-4 mt-6">
            <div className="flex-1 bg-gray-100 p-3 rounded-lg text-sm">
              <p className="font-semibold">Priority Access</p>
              <p className="text-gray-500 text-xs">
                Early booking windows
              </p>
            </div>

            <div className="flex-1 bg-gray-100 p-3 rounded-lg text-sm">
              <p className="font-semibold">Rewards</p>
              <p className="text-gray-500 text-xs">
                Earn points on every trip
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition"
          >
            Proceed to Complete Profile →
          </button>

          <p className="text-sm text-gray-500 mt-3 cursor-pointer">
            Explore Destinations First
          </p>

        </div>
      </div>
    </div>
  );
}