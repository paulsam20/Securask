import dotenv from 'dotenv';
dotenv.config(); // Must stay at the top

import app from './app';
import connectDB from './config/db';

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});