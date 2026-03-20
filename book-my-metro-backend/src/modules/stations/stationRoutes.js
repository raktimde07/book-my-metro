import express from 'express';
import { getAllStations, calculateFare } from './stationController.js';

const router = express.Router();

// GET /api/stations -> Returns the full metro map
router.get('/', getAllStations);

// POST /api/stations/calculate-fare -> Returns the hops and price
router.post('/calculate-fare', calculateFare);

export default router;