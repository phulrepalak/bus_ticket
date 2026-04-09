import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // Sabhi types ke users ke liye storage data
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // 'admin' ya 'user'
  const isGuest = localStorage.getItem("isGuest"); // Ticket book karne ke baad true hoga

  const handleLogout = () => {
    localStorage.clear();
    navigate("/home");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      
      {/* Logo Section */}
      <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-blue-600">GoBus</h1>
      </div>

      {/* DYNAMIC LINKS SECTION */}
      <div className="flex items-center gap-6 text-gray-700 font-medium">
        
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <Link to="/search" className="hover:text-blue-600 transition-colors">Search</Link>

        {/* --- CASE 1: ADMIN LOGGED IN --- */}
        {token && userRole === "admin" && (
          <>
            <Link to="/admin" className=" hover:text-blue-800">Add Bus</Link>
            <Link to="/manage-bus" className="hover:text-blue-600 transition-colors">Manage Bus</Link>
          </>
        )}

        {/* --- CASE 2: REGISTERED USER LOGGED IN --- */}
        {token && userRole === "user" && (
          <>
            <Link to="/bookings" className="hover:text-blue-600 transition-colors">My Booking</Link>
            <Link to="/activity" className="hover:text-blue-600 transition-colors">Activity</Link>
          </>
        )}

        {/* --- CASE 3: GUEST USER  --- */}
        {!token && isGuest === "true" && (
          <Link to="/track-booking" className="hover:text-blue-600 transition-colors">
            Track Booking
          </Link>
        )}

        {/* --- AUTH / PROFILE SECTION --- */}
        {token ? (
          <>
            <Link to="/profile" className="hover:text-blue-600 transition-colors">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition-all text-sm font-semibold shadow-sm"
            >
              Logout
            </button>
          </>
        ) : (
          /* --- LOGIN: Agar guest hai ya unknown user --- */
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all shadow-md"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;