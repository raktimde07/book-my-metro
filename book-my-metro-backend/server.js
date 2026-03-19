import dotenv from 'dotenv';
import app from './app.js';

// Load environment variables from .env file
dotenv.config();

//Define the port to run the server on
const PORT = process.env.PORT || 5000;

//Start the server
app.listen(PORT, () => {
  console.log(`Book my metro backend server is running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Application specific logging, throwing an error, or other logic here
}   );

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
}   );

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
