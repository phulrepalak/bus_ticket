import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminOccupancy = () => {
    // State to store the structured report data fetched from backend
    const [reportData, setReportData] = useState([]);

    // State to manage the loading behavior during the API call
    const [loading, setLoading] = useState(true);

    // UI Accordion States: tracks which Bus and which Date is currently expanded/opened
    const [expandedBus, setExpandedBus] = useState(null);
    const [expandedDate, setExpandedDate] = useState(null);

    // Fetch the bus occupancy report on component mount
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

    // Handler to toggle Bus Accordion expansion
    const toggleBus = (busId) => {
        setExpandedBus(expandedBus === busId ? null : busId);
        setExpandedDate(null); // Reset date expansion when toggling buses to avoid UI overflow
    };

    // Handler to toggle Date Accordion expansion
    const toggleDate = (dateString) => {
        setExpandedDate(expandedDate === dateString ? null : dateString);
    };

    // Loading indicator screen
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-600">Loading Occupancy Reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Title Section */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Bus Occupancy & Live Reports</h2>
                <p className="text-sm text-gray-500 mt-1">Track comprehensive analytics of tickets booked across all active schedules.</p>
            </div>

            {reportData.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500 border border-gray-200">
                    <span className="text-4xl block mb-2">🚌</span>
                    <p className="text-lg font-medium">No active or completed bookings found in the system.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* LEVEL 1: ACTIVE BUSES */}
                    {reportData.map((bus) => (
                        <div key={bus.busId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200">

                            {/* Bus Card Header Row */}
                            <div
                                onClick={() => toggleBus(bus.busId)}
                                className="p-5 flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50/80 transition-colors select-none"
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-blue-600 tracking-tight">{bus.busName}</h3>
                                    <p className="text-sm text-gray-500 font-medium mt-0.5">
                                        {bus.busNumber} <span className="mx-2 text-gray-300">|</span> <span className="text-gray-700 font-semibold">{bus.source} &rarr; {bus.destination}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                                        {bus.dates.length} Days Booked
                                    </span>
                                    <span className="text-gray-400 font-semibold text-xs transition-transform duration-200">
                                        {expandedBus === bus.busId ? "▲" : "▼"}
                                    </span>
                                </div>
                            </div>

                            {/* LEVEL 2: DATES DROPDOWN  */}
                            {expandedBus === bus.busId && (
                                <div className="bg-gray-50/50 border-t border-gray-100 p-5 space-y-3">
                                    {bus.dates.map((d) => (
                                        <div key={d.date} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs transition-all duration-200">

                                            {/* Individual Date Header Row */}
                                            <div
                                                onClick={() => toggleDate(d.date)}
                                                className="p-4 flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50/60 select-none"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-xl text-blue-500">📅</span>
                                                    <span className="font-bold text-gray-700 text-base">{d.date}</span>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-md tracking-wide">
                                                        🎟️ {d.totalTicketsBooked} SEATS FILLED
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-400 max-w-[200px] lg:max-w-xs truncate hidden sm:inline-block">
                                                        Seats: {d.bookedSeatsList.sort((a, b) => a - b).join(", ")}
                                                    </span>
                                                    <span className="text-gray-400 font-semibold text-xs">
                                                        {expandedDate === d.date ? "▲" : "▼"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* LEVEL 3: PASSENGER  TABLE  */}
                                            {expandedDate === d.date && (
                                                <div className="p-4 border-t border-gray-100 bg-gray-50/30 overflow-x-auto">
                                                    <table className="w-full text-left border-collapse bg-white rounded-lg overflow-hidden shadow-xs border border-gray-100 text-sm">
                                                        <thead>
                                                            <tr className="bg-gray-800 text-white font-semibold text-xs uppercase tracking-wider">
                                                                <th className="p-3.5 pl-5">Seat No</th>
                                                                <th className="p-3.5">Passenger Name</th>
                                                                <th className="p-3.5">Gender / Age</th>
                                                                <th className="p-3.5 pr-5">Primary Contact</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100 font-medium">
                                                            {d.passengers.map((passenger, index) => (
                                                                <tr key={index} className="hover:bg-gray-50/50 transition-colors text-gray-700">
                                                                    <td className="p-3.5 pl-5 font-extrabold text-blue-600 text-base">
                                                                        {passenger.seat}
                                                                    </td>
                                                                    <td className="p-3.5 text-gray-900 font-semibold">
                                                                        {passenger.name}
                                                                    </td>
                                                                    <td className="p-3.5 text-gray-600 text-xs">
                                                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 mr-2 font-bold">{passenger.gender}</span>
                                                                        {passenger.age} Yrs
                                                                    </td>
                                                                    <td className="p-3.5 pr-5 text-gray-600 font-mono tracking-wide text-xs">
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