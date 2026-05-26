import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminOccupancy = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBus, setExpandedBus] = useState(null);
  const [expandedDate, setExpandedDate] = useState(null);

  // Fetch the comprehensive bus occupancy report on mount
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/bus-occupancy");
        if (response.data.success) {
          setReportData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching bus occupancy report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  // Toggle outer bus accordion container
  const toggleBus = (busId) => {
    setExpandedBus(expandedBus === busId ? null : busId);
    setExpandedDate(null); 
  };

  // Toggle nested schedule dates accordion row
  const toggleDate = (dateString) => {
    setExpandedDate(expandedDate === dateString ? null : dateString);
  };

  // Render loading feedback viewport
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-base sm:text-lg font-medium text-gray-600">Loading Occupancy Reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-6 bg-gray-50 min-h-screen">
      
      {/* Analytics Dashboard Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Bus Occupancy & Live Reports</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Track comprehensive analytics of tickets booked across all active schedules.</p>
      </div>

      {reportData.length === 0 ? (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm text-center text-gray-500 border border-gray-200">
          <span className="text-3xl sm:text-4xl block mb-2">🚌</span>
          <p className="text-base sm:text-lg font-medium">No active or completed bookings found in the system.</p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* LEVEL 1: ACTIVE BUSES ARCHITECTURE */}
          {reportData.map((bus) => (
            <div key={bus.busId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200">

              {/* Master Bus Info Header Row */}
              <div
                onClick={() => toggleBus(bus.busId)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer bg-white hover:bg-gray-50/80 transition-colors select-none"
              >
                <div className="w-full sm:w-auto">
                  <h3 className="text-lg sm:text-xl font-bold text-blue-600 tracking-tight break-words">{bus.busName}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5 leading-relaxed">
                    {bus.busNumber} <span className="mx-1.5 text-gray-300">|</span> <span className="text-gray-700 font-semibold break-words">{bus.source} &rarr; {bus.destination}</span>
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase shrink-0">
                    {bus.dates.length} Days Booked
                  </span>
                  <span className="text-gray-400 font-semibold text-xs transform transition-transform duration-200">
                    {expandedBus === bus.busId ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* LEVEL 2: SCHEDULED TRIP DATES MATRIX */}
              {expandedBus === bus.busId && (
                <div className="bg-gray-50/50 border-t border-gray-100 p-3 sm:p-5 space-y-3">
                  {bus.dates.map((d) => (
                    <div key={d.date} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs transition-all duration-200">

                      {/* Individual Target Date Trigger Area */}
                      <div
                        onClick={() => toggleDate(d.date)}
                        className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer bg-white hover:bg-gray-50/60 select-none"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg text-blue-500 select-none">📅</span>
                          <span className="font-bold text-gray-700 text-sm sm:text-base">{d.date}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-6">
                          <span className="text-[10px] sm:text-xs font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-md tracking-wide text-center shrink-0">
                            A️ {d.totalTicketsBooked} SEATS FILLED
                          </span>
                          <span className="text-xs font-medium text-gray-400 max-w-full sm:max-w-[150px] lg:max-w-xs truncate hidden sm:inline-block">
                            Seats: {d.bookedSeatsList.sort((a, b) => a - b).join(", ")}
                          </span>
                          <span className="text-gray-400 font-semibold text-xs text-right hidden sm:inline-block">
                            {expandedDate === d.date ? "▲" : "▼"}
                          </span>
                        </div>
                      </div>

                      {/* LEVEL 3: MANIFEST PASSENGER DATA GRID */}
                      {expandedDate === d.date && (
                        <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50/30 overflow-x-auto">
                          <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden shadow-xs border border-gray-100 text-xs sm:text-sm min-w-[500px]">
                            <thead>
                              <tr className="bg-gray-800 text-white font-semibold text-[10px] sm:text-xs uppercase tracking-wider">
                                <th className="p-3 pl-4 sm:pl-5 w-20">Seat No</th>
                                <th className="p-3">Passenger Name</th>
                                <th className="p-3 w-32">Gender / Age</th>
                                <th className="p-3 pr-4 sm:pr-5 w-40">Primary Contact</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium">
                              {d.passengers.map((passenger, index) => (
                                <tr key={index} className="hover:bg-gray-50/50 transition-colors text-gray-700">
                                  <td className="p-3 pl-4 sm:pl-5 font-extrabold text-blue-600 text-sm sm:text-base">
                                    {passenger.seat}
                                  </td>
                                  <td className="p-3 font-semibold text-gray-900 break-words max-w-[155px]">
                                    {passenger.name}
                                  </td>
                                  <td className="p-3 text-gray-600 text-[11px] sm:text-xs whitespace-nowrap">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 mr-1.5 font-bold">{passenger.gender}</span>
                                    {passenger.age} Yrs
                                  </td>
                                  <td className="p-3 pr-4 sm:pr-5 text-gray-600 font-mono tracking-wide text-[11px] sm:text-xs whitespace-nowrap">
                                    {passenger.phone}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOccupancy;