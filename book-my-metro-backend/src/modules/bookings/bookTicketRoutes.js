import express from 'express';
import { bookTicket, getBookingHistory } from './bookTicketController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';


const router = express.Router();

// POST /api/bookings -> Book a ticket
router.post('/', authMiddleware, bookTicket);
router.get('/', authMiddleware, getBookingHistory);

export default router;