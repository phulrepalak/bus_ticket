import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch session data from localStorage
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); 
  const isGuest = localStorage.getItem("isGuest"); 

  const handleLogout = () => {
    localStorage.clear();
    navigate("/home");
  };

  return (
    <nav className="bg-slate-50 border-b border-slate-200 shadow-sm px-4 sm:px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap md:flex-nowrap">
        
        {/* Logo Section */}
        <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
          <div className="bg-sky-100 p-2 rounded-2xl">
            <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">GoBus</h1>
        </div>

        {/* Hamburger Menu Button for Mobile Devices */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-slate-700 hover:text-sky-600 focus:outline-none transition-colors"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Navigation Links Area */}
        <div className={`
          ${isOpen ? "flex" : "hidden"} 
          md:flex flex-col md:flex-row items-start md:items-center justify-end gap-4 text-slate-700 font-medium
          w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200
        `}>
          
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`hover:text-sky-600 transition-colors w-full md:w-auto ${
              location.pathname === "/" || location.pathname === "/home" ? "text-sky-600 font-semibold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/search"
            onClick={() => setIsOpen(false)}
            className={`hover:text-sky-600 transition-colors w-full md:w-auto ${
              location.pathname === "/search" ? "text-sky-600 font-semibold" : ""
            }`}
          >
            Search
          </Link>

          {/* CASE 1: ADMIN LOGGED IN */}
          {token && userRole === "admin" && (
            <>
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={`hover:text-sky-600 transition-colors w-full md:w-auto ${
                  location.pathname === "/admin" ? "text-sky-600 font-semibold" : ""
                }`}
              >
                Add Bus
              </Link>
              <Link
                to="/manage-bus"
                onClick={() => setIsOpen(false)}
                className={`hover:text-sky-600 transition-colors w-full md:w-auto ${
                  location.pathname === "/manage-bus" ? "text-sky-600 font-semibold" : ""
                }`}
              >
                Manage Bus
              </Link>
              <Link
                to="/admin/occupancy"
                onClick={() => setIsOpen(false)}
                className={`hover:text-sky-600 transition-colors w-full md:w-auto ${
                  location.pathname === "/admin/occupancy" ? "text-sky-600 font-semibold" : ""
                }`}
              >
               Report
              </Link>
            </>
          )}

          {/* CASE 2: REGISTERED USER LOGGED IN */}
          {token && userRole === "user" && (
            <Link
              to="/my-bookings"
              onClick={() => setIsOpen(false)}
              className={`hover:text-sky-600 transition-colors w-full md:w-auto ${
                location.pathname === "/my-bookings" ? "text-sky-600 font-semibold" : ""
              }`}
            >
              My Booking
            </Link>
          )}

          {/* CASE 3: GUEST USER */}
          {!token && isGuest === "true" && (
            <Link
              to="/track-booking"
              onClick={() => setIsOpen(false)}
              className={`hover:text-sky-600 transition-colors w-full md:w-auto ${
                location.pathname === "/track-booking" ? "text-sky-600 font-semibold" : ""
              }`}
            >
              Track Booking
            </Link>
          )}

          {/* AUTHENTICATION / PROFILE MODULE */}
          {token ? (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={`hover:text-sky-600 transition-colors w-full md:w-auto pt-2 md:pt-0 ${
                  location.pathname === "/profile" ? "text-sky-600 font-semibold" : ""
                }`}
              >
                Profile
              </Link>
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-full transition-all text-sm font-semibold shadow-sm w-full md:w-auto text-center mt-2 md:mt-0"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className={`bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-full transition-all shadow-md w-full md:w-auto text-center mt-2 md:mt-0 ${
                location.pathname === "/login" ? "bg-sky-600" : ""
              }`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;