// // routes/channelRoutes.js - Defines API routes for channel management
// // This file sets up endpoints for creating and retrieving channels

// import express from 'express'; // Import Express router
// import { createChannel, getChannels , getChannelById} from '../controllers/channelController.js'; // Import controller functions
// import { protect } from '../middleware/auth.js'; // Import JWT middleware

// const router = express.Router();

// // Protected route to create a new channel
// router.post('/', protect, createChannel);

// // Protected route to get all channels for the user
// router.get('/', protect, getChannels);

// router.get('/:id',  getChannelById);


// export default router; // Export router for use in server.js

// import express from 'express';
// import multer from 'multer';
// import {
//   uploadVideo,
//   getVideo,
//   updateVideo,
//   deleteVideo
// } from '../controllers/videoController.js';
// import { protect } from '../middleware/auth.js';


// // Multer config
// const storage = multer.memoryStorage(); // stores in memory, used with `fs.writeFileSync`
// const upload = multer({ storage });

// const router = express.Router();

// router.post('/', protect, upload.single('video'), uploadVideo);      // Upload
// router.get('/:id', getVideo);                                        // Playback
// router.put('/:id', protect, updateVideo);                            // Edit
// router.delete('/:id', protect, deleteVideo);                         // Delete

// export default router;

import express from 'express';
import {
  createChannel,
  getChannels,
  getChannelById
} from '../controllers/channelController.js';

import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/channels
// @desc    Create a new channel
// @access  Private
router.post('/', protect, createChannel);

// @route   GET /api/channels
// @desc    Get all channels for authenticated user
// @access  Private
router.get('/', protect, getChannels);

// @route   GET /api/channels/:id
// @desc    Get a single channel by ID with videos
// @access  Private (or Public, up to you)
router.get('/:id',  getChannelById);

export default router;
