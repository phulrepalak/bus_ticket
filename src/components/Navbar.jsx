import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Sabhi types ke users ke liye storage data
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // 'admin' ya 'user'
  const isGuest = localStorage.getItem("isGuest"); // Ticket book karne ke baad true hoga

  const handleLogout = () => {
    localStorage.clear();
    navigate("/home");
  };

  return (
    <nav className="bg-slate-50 border-b border-slate-200 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">

      {/* Logo Section */}
      <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
        <div className="bg-sky-100 p-2 rounded-2xl">
          <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">GoBus</h1>
      </div>

      {/* DYNAMIC LINKS SECTION */}
      <div className="flex flex-wrap items-center justify-end gap-4 text-slate-700 font-medium">

        <Link
          to="/"
          className={`hover:text-sky-600 transition-colors ${location.pathname === "/" || location.pathname === "/home"
              ? "text-sky-600 font-semibold"
              : ""
            }`}
        >
          Home
        </Link>
        <Link
          to="/search"
          className={`hover:text-sky-600 transition-colors ${location.pathname === "/search"
              ? "text-sky-600 font-semibold"
              : ""
            }`}
        >
          Search
        </Link>

        {/* --- CASE 1: ADMIN LOGGED IN --- */}
        {token && userRole === "admin" && (
          <>
            <Link
              to="/admin"
              className={`hover:text-sky-600 transition-colors ${location.pathname === "/admin"
                  ? "text-sky-600 font-semibold"
                  : ""
                }`}
            >
              Add Bus
            </Link>
            <Link
              to="/manage-bus"
              className={`hover:text-sky-600 transition-colors ${location.pathname === "/manage-bus"
                  ? "text-sky-600 font-semibold"
                  : ""
                }`}
            >
              Manage Bus
            </Link>
            <Link
              to="/admin/occupancy"
              className={`hover:text-sky-600 transition-colors ${location.pathname === "/admin/occupancy"
                ? "text-sky-600 font-semibold"
                : ""
                }`}
            >
              Occupancy Report
            </Link>
          </>
        )}

        {/* --- CASE 2: REGISTERED USER LOGGED IN --- */}
        {token && userRole === "user" && (
          <>
            <Link
              to="/my-bookings"
              className={`hover:text-sky-600 transition-colors ${location.pathname === "/my-bookings"
                  ? "text-sky-600 font-semibold"
                  : ""
                }`}
            >
              My Booking
            </Link>
          </>
        )}

        {/* --- CASE 3: GUEST USER --- */}
        {!token && isGuest === "true" && (
          <Link
            to="/track-booking"
            className={`hover:text-sky-600 transition-colors ${location.pathname === "/track-booking"
                ? "text-sky-600 font-semibold"
                : ""
              }`}
          >
            Track Booking
          </Link>
        )}

        {/* --- AUTH / PROFILE SECTION --- */}
        {token ? (
          <>
            <Link
              to="/profile"
              className={`hover:text-sky-600 transition-colors ${location.pathname === "/profile"
                  ? "text-sky-600 font-semibold"
                  : ""
                }`}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-full transition-all text-sm font-semibold shadow-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={`bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-full transition-all shadow-md ${location.pathname === "/login"
                ? "bg-sky-600"
                : ""
              }`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;