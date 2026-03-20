import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stationRoutes from './src/modules/stations/stationRoutes.js';

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

// Mount the station routes at /api/stations
app.use('/api/stations', stationRoutes);

export default app; 