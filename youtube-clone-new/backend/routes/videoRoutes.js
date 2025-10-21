// // routes/videoRoutes.js - Defines API routes for video management
// // This file sets up endpoints for uploading, retrieving, liking/disliking, searching/filtering videos

// import express from 'express'; // Import Express router
// import { uploadVideo, getVideo, getAllVideos, likeVideo, dislikeVideo } from '../controllers/videoController.js'; // Import controller functions
// import { protect } from '../middleware/auth.js'; // Import JWT middleware
// import { 
//   uploadVideo, 
//   getVideo, 
//   getAllVideos, 
//   likeVideo, 
//   dislikeVideo,
//   incrementView
// } from '../controllers/videoController.js';



// const router = express.Router();

// // Public route to get all videos (with search/filter)
// router.get('/', getAllVideos);

// // Protected route to upload a video
// router.post('/', protect, uploadVideo);

// // Public route to get video details
// router.get('/:id', getVideo);

// // Protected route to like a video
// router.patch('/:id/like', protect, likeVideo);

// // Protected route to dislike a video
// router.patch('/:id/dislike', protect, dislikeVideo);

// router.patch('/:id/view', incrementView); // 👈 NEW

// export default router; // Export router for use in server.js

// import express from 'express';

// import {
//   uploadVideo,
//   getVideo,
//   getAllVideos,
//   updateVideo,
//   deleteVideo,
//   likeVideo,
//   dislikeVideo,
//   incrementView,
//   addComment,
//   editComment,
//   deleteComment
// } from '../controllers/videoController.js';

// import { protect  } from '../middleware/auth.js';
// import upload from '../middleware/upload.js';

// // Multer setup for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const router = express.Router();

// // 🔓 Public: Get all videos (with optional search/filter)
// router.get('/', getAllVideos);

// // 🔐 Protected: Upload a new video
// router.post('/', protect, upload.single('video'), uploadVideo);

// // 🔓 Public: Get video details (does NOT increment views)
// router.get('/:id', getVideo);

// // 🔓 Public: Increment view count
// router.patch('/:id/view', incrementView);

// // 🔐 Protected: Like a video
// router.patch('/:id/like', protect, likeVideo);

// // 🔐 Protected: Dislike a video
// router.patch('/:id/dislike', protect, dislikeVideo);

// // 🔐 Protected: Deleta a video
// router.delete('/:id', protect, deleteVideo);

// // 🔐 Protected: Update a video
// router.patch('/:id', protect, updateVideo);


// // ✅ Comments

// // 🔐 Protected: Add a comment
// router.post('/:id/comments', protect, addComment);

// // 🔐 Protected: Edit a comment
// router.patch('/:id/comments/:commentId', protect, editComment);

// // 🔐 Protected: Delete a comment
// router.delete('/:id/comments/:commentId', protect, deleteComment);

// router.patch('/:id/views', incrementView); // Optional: move view increment to a separate route


// export default router;


import express from 'express';
import {
  uploadVideo,
  getVideo,
  getAllVideos,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  incrementView,
  addComment,
  editComment,
  deleteComment
} from '../controllers/videoController.js';

import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js'; // ✅ Uses memoryStorage via multer

const router = express.Router();

// ----------------------
// 📺 VIDEO ROUTES
// ----------------------

// 🔓 Get all videos (with search & filters)
router.get('/', getAllVideos);

// 🔓 Get video details (does not increment views here)
router.get('/:id', getVideo);

console.log('videoRoutes loaded');

// 🔐 Upload new video
router.post('/', protect, upload.single('video'), uploadVideo);

// 🔐 Update video details
router.patch('/:id', protect, updateVideo);

// 🔐 Delete a video
router.delete('/:id', protect, deleteVideo);

// 🔓 Increment views (optional: separate patch)
router.patch('/:id/views', incrementView);

// 🔐 Like a video
router.patch('/:id/like', protect, likeVideo);

// 🔐 Dislike a video
router.patch('/:id/dislike', protect, dislikeVideo);

// ----------------------
// 💬 COMMENT ROUTES
// ----------------------

// 🔐 Add a comment
router.post('/:id/comments', protect, addComment);

// 🔐 Edit a comment
router.patch('/:id/comments/:commentId', protect, editComment);

// 🔐 Delete a comment
router.delete('/:id/comments/:commentId', protect, deleteComment);

export default router;
