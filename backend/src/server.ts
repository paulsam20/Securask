/**
 * server.ts
 * Entry point for the Securask backend.
 * Responsible for initializing environment variables, connecting to the database, and starting the server.
 */
import dotenv from 'dotenv';
dotenv.config(); // Must stay at the top to ensure variables are available to other modules

import app from './app';
import connectDB from './config/db';
import logger from './utils/logger';

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Start listening for requests
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});