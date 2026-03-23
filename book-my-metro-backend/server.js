import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './src/config/database.js';

// Load environment variables from .env file
dotenv.config();

//Define the port to run the server on
const PORT = process.env.PORT || 5000;

// Connect to the database before starting the server
const connect_to_db = async () => {
    await connectDB().then(() => {
        console.log('Database connection established successfully!');
        }
    ).catch((err) => {
        console.error('Failed to connect to the database:', err);
        process.exit(1); // Exit the process with an error code
    });
};
connect_to_db();     

//Start the server
app.listen(PORT, () => {
    console.log(`Book my metro backend server is running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Application specific logging, throwing an error, or other logic here
    process.exit(1); // Exit the process with an error code
    }   
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
    process.exit(1); // Exit the process with an error code
    }   
);

// Handle graceful shutdown on SIGTERM
process.on('SIGTERM', async () => {
  console.log('SIGTERM received - gracefully shutting down');
  
  // Close connections
  server.close(() => {
    console.log('HTTP server closed');
  });
  
  // Close database(to be handled after db is created)
  // await mongoose.connection.close();
  
  process.exit(0);
});
