import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // check if the URI exists in the environment variables
    const dbUri = process.env.MONGO_URI;

    if (!dbUri) {
      throw new Error("MONGO_URI is not defined in .env file");
    }
// connect to MongoDB
    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
};

export default connectDB;