import { pool } from '../../config/database.js';
import FareService from './fareService.js';

// 1. Get all stations and their lines
const getAllStations = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                lines.name AS metro_line,
                stations.id AS station_id,
                stations.name AS station_name,
                station_routes.sequence_number
            FROM station_routes
            JOIN lines ON station_routes.line_id = lines.id
            JOIN stations ON station_routes.station_id = stations.id
            ORDER BY lines.name, station_routes.sequence_number;
        `);

        res.status(200).json({
            status: 'success',
            results: result.rowCount,
            data: result.rows
        });
    } catch (error) {
        console.error("Error fetching stations:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 2. Calculate fare between two stations
const calculateFare = async (req, res) => {
    try {
        // Extract the IDs from the incoming JSON request
        const { startStationId, endStationId } = req.body;

        // Basic validation
        if (!startStationId || !endStationId) {
            return res.status(400).json({ 
                status: 'fail',
                message: 'Please provide both startStationId and endStationId' 
            });
        }

        // Call our BFS Graph algorithm
        const fareDetails = await FareService.calculateFare(startStationId, endStationId);

        // Send the result back to the user
        res.status(200).json({
            status: 'success',
            data: fareDetails
        });

    } catch (error) {
        console.error("Fare Calculation Error:", error);
        res.status(400).json({ 
            status: 'error',
            message: error.message 
        });
    }
};

export { getAllStations, calculateFare };