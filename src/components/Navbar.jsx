import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  // const guest = localStorage.getItem("guestBooking"); // Abhi iska use nahi hai par rehne de sakte hain

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login"); // Logout ke baad login page par bhejna better hai
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">

      {/* Logo - Ab ye default "/" (Home) par le jayega */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold text-blue-600 cursor-pointer"
      >
        GoBus
      </h1>

      {/* LINKS */}
      <div className="flex items-center gap-6 text-gray-700 font-medium">

        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/search" className="hover:text-blue-600">Search</Link>

        {/* AUTH USER - Agar token hai toh ye dikhao */}
        {token && (
          <>
            <Link to="/bookings" className="hover:text-blue-600">Bookings</Link>
            <Link to="/profile" className="hover:text-blue-600">Profile</Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md transition-all"
            >
              Logout
            </button>
          </>
        )}

        {/* LOGIN - Agar token NAHI hai toh login button dikhao */}
        {!token && (
          <Link
            to="/login"  /* IMPORTANT: Ise /login kar diya hai */
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;