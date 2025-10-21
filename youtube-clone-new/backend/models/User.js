// // models/User.js - Mongoose schema for User model
// // This defines the structure for user documents in MongoDB, used for authentication and channel/video management
// // Aligns with project requirements: registration/login with JWT, and sample data (e.g., { userId: "user01", username: "JohnDoe", ... })

// import mongoose from 'mongoose'; // Import Mongoose for schema definition
// import bcrypt from 'bcryptjs'; // Import bcrypt for secure password hashing

// // Define the User schema based on assignment requirements
// const userSchema = new mongoose.Schema({
//   userId: {
//     type: String, // Unique identifier (e.g., 'user01' from sample)
//     required: true,
//     unique: true,
//   },
//   username: {
//     type: String, // Display name to show in header after login
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String, // Email for registration and login (via Google form redirect)
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String, // Hashed password for security
//     required: true,
//   },
//   avatar: {
//     type: String, // URL to user's avatar image
//     default: 'https://example.com/default-avatar.png', // Default avatar if not provided
//   },
//   channels: {
//     type: [String], // Array of channelIds owned by the user (for channel management)
//     default: [], // Starts empty until user creates a channel
//   },
//   uploadedVideos: {
//     type: [String], // Array of videoIds uploaded by the user (links to Video model)
//     default: [], // Starts empty
//   },
// }, {
//   timestamps: true, // Automatically adds createdAt and updatedAt fields for tracking
// });

// // Pre-save middleware: Hash password before saving to ensure security
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next(); // Skip if password hasn't changed
//   }
//   const salt = await bcrypt.genSalt(10); // Generate salt for stronger hashing
//   this.password = await bcrypt.hash(this.password, salt); // Hash the password
//   next();
// });

// // Instance method: Compare entered password with stored hash during login
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password); // Returns true if match
// };

// // Create and export the User model for use in controllers
// const User = mongoose.model('User', userSchema);
// export default User;


// models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: 'https://example.com/default-avatar.png',
  },

  // ✅ Updated to use ObjectId references
  channels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
  }],

  uploadedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
  }],
}, {
  timestamps: true,
});

// Pre-save middleware for password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
