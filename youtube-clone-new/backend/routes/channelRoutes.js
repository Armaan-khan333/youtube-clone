

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
