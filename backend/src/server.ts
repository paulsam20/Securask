import dotenv from 'dotenv';
// 1. Load env variables first!
dotenv.config(); 

import app from "./app";
import connectDB from "./config/db";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB(); // Now this will find the MONGO_URI string
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

startServer();