import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create a new pool instance to manage PostgreSQL connections
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to connect to the PostgreSQL database and verify the connection
const connectDB = async () => {
  try {
    const client =await pool.connect();
    console.log("Connected to PostgreSQL database " + process.env.DB_NAME + " successfully!");
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error("Error connecting to PostgreSQL database:", err);
    process.exit(1); // Exit the process with an error code
  }
};

export { pool, connectDB };

