import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import OTPPage from "./pages/OTPPage";
import SearchResults from "./pages/SearchResults";
import AccountCreated from "./pages/AccountCreated";
import CompleteProfile from "./pages/CompleteProfile";
import ManageBus from "./pages/ManageBus";
import SelectSeat from "./pages/SelectSeat";
import Profile from "./pages/Profile"

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard"; // Isme Add Bus ka form hai
// import ManageBus from "./pages/ManageBus";           // Future page for edit/delete
// import ViewBookings from "./pages/ViewBookings";     // Future page to see all tickets

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
        <Route path="/select-seat/:busId" element={<SelectSeat />} />

        {/* --- ADMIN ONLY ROUTES --- */}
        {/* Jab Navbar mein 'Add Bus' click hoga toh ye khulega */}
        <Route path="/admin" element={<AdminDashboard />} /> 
        
        {/* Manage Bus page ka path */}
        <Route path="/manage-bus" element={<ManageBus />} />
        
        {/* Saari bookings dekhne ka path */}
        {/* <Route path="/view-bookings" element={<ViewBookings />} /> */}

        {/* Naya Display Page yahan hona chahiye */}
        <Route path="/profile" element={<Profile />} />  
        
        {/* Form wala page alag path par rakhein */}
        <Route path="/complete-profile" element={<CompleteProfile />} />      

        {/* --- REDIRECTS --- */}
        <Route path="*" element={<Navigate to="/" />} />
       
      </Routes>
    </Router>
  );
}

export default App;   