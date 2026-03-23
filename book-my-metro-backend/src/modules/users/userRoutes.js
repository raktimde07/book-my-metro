import express from 'express';
import { registerUser, loginUser } from './userController.js';

const router = express.Router();

// POST /api/users/register -> Register a new user
router.post('/register', registerUser);

// POST /api/users/login -> Login an existing user
router.post('/login', loginUser);

export default router;