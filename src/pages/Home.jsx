import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero.png";

const Home = () => {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    if (!from || !to || !date) {
      alert("Please fill all fields");
      return;
    }

    navigate(`/search?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <div>
      {/* HERO */}
      <div
        className="h-[95vh] bg-cover bg-center flex items-center justify-center text-white relative"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center w-full px-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            Book Your <span className="text-orange-400">Bus</span> Easily
          </h1>
          <p className="mt-4 text-gray-200">Fast • Safe • Comfortable Travel</p>
          {/* SEARCH BAR */}{" "}
          <div className="mt-12 flex justify-center w-full">
            <div className="bg-white rounded-2xl shadow-2xl px-4 py-4 md:px-6 md:py-5 w-[95%] md:w-[80%] lg:w-[65%] flex flex-col md:flex-row items-center gap-4">
              {" "}
              {/* FROM */}{" "}
              <div className="flex items-center gap-3 w-full md:w-1/4 border-b md:border-b-0 md:border-r pb-3 md:pb-0 md:pr-4">
                {" "}
                <span className="text-blue-500 text-xl"></span>{" "}
                <div className="w-full">
                  {" "}
                  <p className="text-xs text-gray-400 font-semibold">
                    FROM
                  </p>{" "}
                  <input
                    type="text"
                    placeholder="Enter city"
                    className="w-full outline-none text-gray-800 font-semibold placeholder-gray-400"
                  />{" "}
                </div>{" "}
              </div>{" "}
              {/* TO */}{" "}
              <div className="flex items-center gap-3 w-full md:w-1/4 border-b md:border-b-0 md:border-r pb-3 md:pb-0 md:px-4">
                {" "}
                <span className="text-blue-500 text-xl"></span>{" "}
                <div className="w-full">
                  {" "}
                  <p className="text-xs text-gray-400 font-semibold">TO</p>{" "}
                  <input
                    type="text"
                    placeholder="Enter destination"
                    className="w-full outline-none text-gray-800 font-semibold placeholder-gray-400"
                  />{" "}
                </div>{" "}
              </div>{" "}
              {/* DATE */}{" "}
              <div className="flex items-center gap-3 w-full md:w-1/4 border-b md:border-b-0 md:border-r pb-3 md:pb-0 md:px-4">
                {" "}
                <span className="text-blue-500 text-xl"></span>{" "}
                <div className="w-full">
                  {" "}
                  <p className="text-xs text-gray-400 font-semibold">
                    DATE
                  </p>{" "}
                  <input
                    type="date"
                    className="w-full outline-none text-gray-800 font-semibold"
                  />{" "}
                </div>{" "}
              </div>{" "}
              {/* BUTTON */}{" "}
              <div className="w-full md:w-auto">
                {" "}
                <button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition duration-300">
                  {" "}
                   Search{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* FEATURES SECTION */}{" "}
      <div className="bg-gray-100 py-14 px-6">
        {" "}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {" "}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
            {" "}
            <h3 className="font-semibold text-lg">2000+ Bus Operators</h3>{" "}
            <p className="text-gray-600 mt-2 text-sm">
              {" "}
              The largest network of trusted logistics partners across the
              nation.{" "}
            </p>{" "}
          </div>{" "}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
            {" "}
            <h3 className="font-semibold text-lg">
              {" "}
              Verified Seats & Operators{" "}
            </h3>{" "}
            <p className="text-gray-600 mt-2 text-sm">
              {" "}
              Each journey is vetted for safety, cleanliness, and
              punctuality.{" "}
            </p>{" "}
          </div>{" "}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
            {" "}
            <h3 className="font-semibold text-lg">
              {" "}
              Best Price Guaranteed{" "}
            </h3>{" "}
            <p className="text-gray-600 mt-2 text-sm">
              {" "}
              Direct deals that ensure you never overpay for your seat.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default Home;
