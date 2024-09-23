import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Database connection
console.log("mongo url", process.env.port);
const mongoURI = process.env.MONGO_URI;
export const mongoConnect = callback => {
    mongoose.connect(mongoURI)
      .then(() => {console.log('MongoDB connected'); callback();})
      .catch(err => console.log('MongoDB connection error:', err));
  };
  
  