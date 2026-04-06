import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stationRoutes from './src/modules/stations/stationRoutes.js';
import userRoutes from './src/modules/users/userRoutes.js';
import bookingRoutes from './src/modules/bookings/bookTicketRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to the Book My Metro API!');
});

// Mount the user routes at /api/users 
app.use('/api/users', userRoutes);

// Mount the station routes at /api/stations
app.use('/api/stations', stationRoutes);

// Mount the booking routes at /api/bookings
app.use('/api/bookings', bookingRoutes);



export default app; 