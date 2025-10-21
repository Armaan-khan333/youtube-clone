

import Channel from '../models/Channel.js';
import User from '../models/User.js'; // Needed for .channels on user

// @desc    Create a new channel for the authenticated user
// @route   POST /api/channels
// @access  Private
export const createChannel = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Channel name is required' });
    }

    const user = req.user; // Comes from protect middleware

    // Check if user already has a channel with the same name
    const existing = await Channel.findOne({ name, owner: user._id });
    if (existing) {
      return res.status(400).json({ message: 'You already have a channel with this name.' });
    }

    const newChannel = await Channel.create({
      name,
      description: description || '',
      owner: user._id,
    });

    user.channels.push(newChannel._id); // Add channel to user's channels
    await user.save();

    res.status(201).json({
      message: 'Channel created successfully',
      channel: newChannel,
    });
  } catch (error) {
    console.error('❌ Create Channel Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all channels for the authenticated user
// @route   GET /api/channels
// @access  Private
export const getChannels = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('channels');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ channels: user.channels });
  } catch (error) {
    console.error('❌ Get Channels Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single channel by ID (with videos)
// @route   GET /api/channels/:id
// @access  Private (optional: make it public if needed)
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('videoIds')
      .populate('owner', 'username avatar');

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.status(200).json(channel);
  } catch (error) {
    console.error('❌ Get Channel By ID Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// 

// @desc    Update video details (title, description, etc.)
// @route   PUT /api/videos/:id
// @access  Private (Uploader only)
export const updateVideo = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const video = await Video.findById(req.params.id);

    if (!video) return res.status(404).json({ message: 'Video not found' });

    // Authorization check: must be uploader
    if (video.uploaderId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this video' });
    }

    if (title) video.title = title;
    if (description) video.description = description;
    if (category) video.category = category;

    await video.save();

    res.json({ message: 'Video updated successfully', video });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a video
// @route   DELETE /api/videos/:id
// @access  Private (Uploader only)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    // Authorization check
    if (video.uploaderId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this video' });
    }

    // Delete from file system
    const absolutePath = path.join(process.cwd(), video.filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    // Remove from Channel.videoIds
    const Channel = (await import('../models/Channel.js')).default;
    await Channel.findOneAndUpdate(
      { _id: video.channelId },
      { $pull: { videoIds: video._id } }
    );

    // Delete from Video collection
    await video.remove();

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
