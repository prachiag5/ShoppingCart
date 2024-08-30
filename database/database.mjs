import mongoose from 'mongoose';

// Database connection
const mongoURI = 'mongodb+srv://prachiagarwal01:hbmcim423272!@cluster0.ngux4c6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export const mongoConnect = callback => {
    mongoose.connect(mongoURI)
      .then(() => {console.log('MongoDB connected'); callback();})
      .catch(err => console.log('MongoDB connection error:', err));
  };
  
  