// models/Channel.js - Mongoose schema for Channel model

import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,               // Channel display name
    required: true,
    unique: true,               // Ensure no duplicate channel names
    trim: true,
  },
  description: {
    type: String,               // Optional description
    default: '',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User who owns the channel
    ref: 'User',
    required: true,
  },
  subscribers: {
    type: Number,               // Subscriber count
    default: 0,
  },
  videoIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',             // References to Video documents
    }
  ],
}, {
  timestamps: true,             // Adds createdAt and updatedAt
});

const Channel = mongoose.model('Channel', channelSchema);
export default Channel;
