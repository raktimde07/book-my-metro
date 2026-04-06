import express from 'express';
import { bookTicket } from './bookTicketController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';


const router = express.Router();

// POST /api/bookings -> Book a ticket
router.post('/', authMiddleware, bookTicket);

export default router; 