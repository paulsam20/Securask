import mongoose from 'mongoose';

/**
 * connectDB
 * Function to establish connection with MongoDB using Mongoose.
 * Exits the process if connection fails.
 */
const connectDB = async () => {
  try {
    // Retrieve connection string from environment variables
    const dbUri = process.env.MONGO_URI;

    if (!dbUri) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    // Connect to MongoDB Atlas or local instance
    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    // Shutdown the server immediately on connection failure
    process.exit(1);
  }
};

export default connectDB;