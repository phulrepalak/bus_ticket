import React from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const query = new URLSearchParams(useLocation().search);

  const from = query.get("from");
  const to = query.get("to");
  const date = query.get("date");

  const buses = [
    { name: "Volvo AC", price: 1200, time: "10:00 PM" },
    { name: "Sleeper Bus", price: 800, time: "6:00 AM" },
  ];

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold">
        {from} → {to}
      </h1>

      <p className="text-gray-500 mb-5">Date: {date}</p>

      <div className="space-y-4">
        {buses.map((bus, i) => (
          <div key={i} className="p-4 bg-white shadow rounded flex justify-between">

            <div>
              <h2 className="font-semibold">{bus.name}</h2>
              <p>{bus.time}</p>
            </div>

            <div className="text-right">
              <p className="text-orange-500 font-bold">₹{bus.price}</p>
              <button className="bg-blue-500 text-white px-3 py-1 rounded">
                Book
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default SearchResults;