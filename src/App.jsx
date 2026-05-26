import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

// Pages
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import OTPPage from "./pages/OTPPage";
import SearchResults from "./pages/SearchResults";
import AccountCreated from "./pages/AccountCreated";
import CompleteProfile from "./pages/CompleteProfile";
import ManageBus from "./pages/ManageBus";
import SelectSeat from "./pages/SelectSeat";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import TicketConfirmation from "./pages/TicketConfirmation";
import TrackBooking from "./pages/TrackBooking";
import MyBookings from "./pages/MyBookings";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminOccupancy from "./pages/AdminOccupancy";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* --- COMMON ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/account-created" element={<AccountCreated />} />
        <Route path="/track-booking" element={<TrackBooking />} />

        {/* Profile & Dashboard Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* --- BOOKING FLOW ROUTES --- */}
        <Route path="/select-seat/:busId" element={<SelectSeat />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />

        {/* Payment ke baad isi page par user redirect hoga */}
        <Route path="/ticket-confirmation" element={<TicketConfirmation />} />

        {/* --- ADMIN ONLY ROUTES --- */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/manage-bus" element={<ManageBus />} />
        <Route path="/admin/occupancy" element={<AdminOccupancy />} />


        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;