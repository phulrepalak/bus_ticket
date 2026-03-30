import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

// Pages
  import Home from "./pages/Home";
// import Search from "./pages/Search";
// import MyBookings from "./pages/MyBookings";
// import Overview from "./pages/Overview";
// import Profile from "./pages/Profile";
// import Login from "./pages/Login";
// import TrackBooking from "./pages/TrackBooking";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/search" element={<Search />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/overview" element={<Overview />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/track-booking" element={<TrackBooking />} /> */}
      </Routes>
    </Router>
  );
}

export default App;