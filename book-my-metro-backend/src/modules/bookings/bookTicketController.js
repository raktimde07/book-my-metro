import FareService from "../stations/fareService.js";
import { generateQRSignature } from "../../utils/generateQRSignature.js";
import { pool } from "../../config/database.js";
import crypto from 'crypto';

const bookTicket = async (req, res) => {

    console.log("headers.authorization:", req.headers.authorization);
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);

    let client;
    try {
        const { userId } = req.user; // Extracted from JWT token by auth middleware
        const { startStationId, endStationId } = req.body;

        console.log(userId, startStationId, endStationId);

        // Validate input
        if (!userId || !startStationId || !endStationId) {
            return res.status(400).json({ 
                status: 'fail',
                message: 'Please provide userId, startStationId, and endStationId' 
            });
        }

        //Generate the booking id and the qr code string using crypto
        const ticketId = crypto.randomUUID();
        const qrSignature = await generateQRSignature(ticketId, startStationId, endStationId);

        // Calculate fare details using the FareService
        const fareDetails = await FareService.calculateFare(startStationId, endStationId);
        client = await pool.connect();

        await client.query('BEGIN'); // Start transaction

        // Insert booking into the database
        const insertQuery = `
            INSERT INTO bookings (id, user_id, source_station_id, destination_station_id, fare, status, qr_signature)
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id, source_station_id, destination_station_id, fare, qr_signature, valid_until, created_at
        `;
        const result = await client.query(insertQuery, [
            ticketId,
            userId,
            startStationId,
            endStationId,
            fareDetails.fareAmount,
            'ACTIVE',
            qrSignature
        ]);

        await client.query('COMMIT'); // Commit transaction

        const booking = result.rows[0];

        res.status(201).json({
            status: 'success',
            data: {
                userId: userId,
                bookingId: booking.id,
                startStationId: booking.source_station_id,
                endStationId: booking.destination_station_id,
                fareAmount: booking.fare,
                createdAt: booking.created_at,
                validUntil: booking.valid_until,
                qrSignature: booking.qr_signature
            }
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(400).json({ 
            status: 'error',
            message: error.message 
        });
    } finally {
        if (client) client.release();
    }
};

const getBookingHistory = async (req, res) => {
    // This function can be implemented to fetch the booking history for a user
    // It would involve querying the bookings table for all entries related to the userId
    // and returning them in a structured format.

    let client;
    try {
        const { userId } = req.user; // Extracted from JWT token by auth middleware

        if (!userId) {
            return res.status(400).json({ 
                status: 'fail',
                message: 'Please provide userId' 
            });
        }

        client = await pool.connect();

        const query = `
            SELECT id AS booking_id, source_station_id, destination_station_id, fare, status, created_at, valid_until
            FROM bookings
            WHERE user_id = $1
            ORDER BY created_at DESC
        `;
        const result = await client.query(query, [userId]);

        res.status(200).json({
            status: 'success',
            results: result.rowCount,
            data: result.rows
        });

    } catch (error) {
        console.error("Error fetching booking history:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (client) client.release();
    }       

};

export { bookTicket, getBookingHistory };
