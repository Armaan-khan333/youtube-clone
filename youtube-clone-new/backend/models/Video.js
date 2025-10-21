// // models/Video.js - Mongoose schema for Video model
// // This defines the structure for video documents in MongoDB, used for the Video Player functionality

// import mongoose from 'mongoose'; // Import Mongoose for schema definition

// const videoSchema = new mongoose.Schema({
//   title: {
//     type: String, // Title of the video
//     required: true,
//   },
//   description: {
//     type: String, // Description of the video
//     required: true,
//   },
//   filePath: {
//     type: String, // Local path or URL to the video file
//     required: true,
//   },
//   thumbnailUrl: {
//     type: String, // URL to thumbnail (optional, PDF requires thumbnail)
//     default: 'https://example.com/default-thumbnail.png',
//   },
//   channelId: {
//     type: String, // ID of the channel this video belongs to
//     required: true,
//   },
//   uploaderId: {
//     type: mongoose.Schema.Types.ObjectId, // Reference to the User who uploaded
//     ref: 'User',
//     required: true,
//   },
//   views: {
//     type: Number, // Number of views (starts at 0)
//     default: 0,
//   },
//   likes: {
//     type: Number, // Number of likes (starts at 0)
//     default: 0,
//   },
//   dislikes: {
//     type: Number, // Number of dislikes (starts at 0)
//     default: 0,
//   },
//   category: {
//     type: String, // Category for filter (e.g., Music, Art, Tech)
//     default: 'All',
//   },
//   // comments: {
//   //   type: Array, // Array of comments (ignore nested for now)
//   //   default: [],
//   // },
//     comments: {
//     type: [commentSchema], // ✅ Structured as array of subdocs
//     default: [],
//   },
// }, {
//   timestamps: true, // Automatically adds createdAt and updatedAt fields
// });

// // Create and export the Video model
// const Video = mongoose.model('Video', videoSchema);
// export default Video;

// models/Video.js - Mongoose schema for Video model
// This defines the structure for video documents in MongoDB, used for the Video Player functionality

import mongoose from 'mongoose'; // Import Mongoose for schema definition

// -------------------------
// 💬 Subdocument Schema for Comments
// -------------------------
// const commentSchema = new mongoose.Schema({
//   commentId: {
//     type: String,
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   text: {
//     type: String,
//     required: true,
//   },
// }, { _id: false }); // Disable automatic _id for comments (optional)

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});


// -------------------------
// 📺 Main Video Schema
// -------------------------
const videoSchema = new mongoose.Schema({
  title: {
    type: String, // Title of the video
    required: true,
  },
  description: {
    type: String, // Description of the video
    required: true,
  },
  filePath: {
    type: String, // Local path or URL to the video file
    required: true,
  },
  thumbnailUrl: {
    type: String, // URL to thumbnail (optional)
    default: 'https://example.com/default-thumbnail.png',
  },
  channelId: {
    type: String, // ID of the channel this video belongs to
    required: true,
  },
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User who uploaded
    ref: 'User',
    required: true,
  },
  views: {
    type: Number, // Number of views (starts at 0)
    default: 0,
  },
  viewers: [
  {
    type: String,
  }
],
  likes: {
    type: Number, // Number of likes (starts at 0)
    default: 0,
  },
  dislikes: {
    type: Number, // Number of dislikes (starts at 0)
    default: 0,
  },
  category: {
    type: String, // Category for filtering (optional)
    default: 'All',
  },

  // ✅ Structured array of comment subdocuments
  comments: {
    type: [commentSchema],
    default: [],
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the Video model
const Video = mongoose.model('Video', videoSchema);
export default Video;
