import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

export default app; 