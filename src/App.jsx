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

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* 1. Default Page ab Home khulega */}
        <Route path="/" element={<Home />} />
        
        {/* 2. Login Page ab /login path par chalagaya hai */}
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/otp" element={<OTPPage />} />
        
        {/* /home ko bhi rehne dete hain redirection ke liye */}
        <Route path="/home" element={<Home />} />
        
        <Route path="/search" element={<SearchResults />} />

        <Route path="/account-created" element={<AccountCreated />} />
        <Route path="/profile" element={<CompleteProfile />} />

        {/* 3. Galat URL par seedha Home par bhej dega */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;