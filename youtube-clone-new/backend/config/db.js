// config/db.js - Database connection setup using Mongoose
// This file handles connecting to a local MongoDB instance

import mongoose from 'mongoose'; // Import Mongoose for MongoDB object modeling

const connectDB = async () => {
  try {
    // Connect to local MongoDB instance with 'youtubeclone' database
    await mongoose.connect('mongodb://localhost:27017/youtubeclone', {
      useNewUrlParser: true, // Use new URL parser (required for newer Mongoose)
      useUnifiedTopology: true, // Use new topology engine
    });
    console.log('MongoDB connected successfully to local instance'); // Log success
  } catch (error) {
    console.error('MongoDB connection failed:', error.message); // Log error details
    process.exit(1); // Exit process with failure
  }
};

export default connectDB; // Export the function for use in server.js