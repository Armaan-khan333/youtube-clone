
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
