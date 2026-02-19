import dotenv from 'dotenv';
dotenv.config(); // Must stay at the top

import app from './app';
import connectDB from './config/db';
import logger from './utils/logger';

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});