import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Database connection
// const mongoURI = 'mongodb+srv://prachiagarwal01:hbmcim423272!@cluster0.ngux4c6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
console.log("mongo url", process.env.port);
const mongoURI = process.env.MONGO_URI;
export const mongoConnect = callback => {
    mongoose.connect(mongoURI)
      .then(() => {console.log('MongoDB connected'); callback();})
      .catch(err => console.log('MongoDB connection error:', err));
  };
  
  