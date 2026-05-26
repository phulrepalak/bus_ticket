import Booking from "../models/Booking.js";

export const getBusOccupancyReport = async (req, res) => {
    try {
        // 1. Fetch all bookings with "Completed" payment status and populate the referenced Bus details
        const bookings = await Booking.find({ paymentStatus: "Completed" })
            .populate("bus")
            .sort({ journeyDate: 1 }); // Sort chronologically by journey date

        // Temporary object to dynamically group bookings by busId and journeyDate
        const report = {};

        // 2. Iterate through each booking to build the nested hierarchical structure
        bookings.forEach((booking) => {
            // Safety check: Skip if the referenced bus document no longer exists in the database
            if (!booking.bus) return;

            const busId = booking.bus._id.toString();
            const date = booking.journeyDate;

            // STEP A: If the bus doesn't exist in the report object yet, initialize its basic structure
            if (!report[busId]) {
                report[busId] = {
                    busId: busId,
                    busName: booking.bus.name,
                    busNumber: booking.bus.busNumber,
                    source: booking.bus.source,
                    destination: booking.bus.destination,
                    dates: {} // Nested object to hold grouping by individual dates
                };
            }

            // STEP B: If this specific journey date doesn't exist under this bus, initialize its structure
            if (!report[busId].dates[date]) {
                report[busId].dates[date] = {
                    date: date,
                    totalTicketsBooked: 0,
                    bookedSeatsList: [], // Array to hold all seat numbers together (e.g., ["1", "2", "5"])
                    passengers: []       // Array to hold individual passenger details for this day
                };
            }

            // STEP C: Increment the total seat count and append the booked seat numbers
            report[busId].dates[date].totalTicketsBooked += booking.seats.length;
            report[busId].dates[date].bookedSeatsList.push(...booking.seats);

            // STEP D: Map and push each passenger's information along with the primary booking contact
            booking.passengerDetails.forEach((p) => {
                report[busId].dates[date].passengers.push({
                    name: p.name,
                    seat: p.seat,
                    gender: p.gender || "N/A", // Fallback if gender is empty
                    age: p.age || "N/A",       // Fallback if age is empty
                    phone: booking.contact?.phone || "N/A" // Primary contact number for tracking
                });
            });
        });

        // 3. Convert the nested objects into a clean array format so the frontend can easily use .map()
        const finalData = Object.values(report).map((bus) => ({
            ...bus,
            dates: Object.values(bus.dates)
        }));

        // 4. Send the structured response back to the client
        res.status(200).json({
            success: true,
            count: finalData.length,
            data: finalData
        });

    } catch (error) {
        // Log error details for server-side debugging
        console.error("ADMIN OCCUPANCY REPORT ERROR:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error: Failed to generate occupancy report.",
            error: error.message
        });
    }
};