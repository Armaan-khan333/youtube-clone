
import Video from '../models/Video.js';
import User from '../models/User.js';
import path from 'path';
import fs from 'fs';

// ----------- VIDEO UPLOAD ----------
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, channelId } = req.body;
    const file = req.file;

    if (!file || !title || !description || !channelId) {
      return res.status(400).json({ message: 'Title, description, channelId, and video file are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.channels.includes(channelId)) {
      return res.status(403).json({ message: 'Unauthorized: Invalid channel' });
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    const fileName = `${Date.now()}_${file.originalname}`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const video = await Video.create({
      title,
      description,
      filePath: `/uploads/${fileName}`,
      channelId,
      uploaderId: user._id,
    });

    const Channel = (await import('../models/Channel.js')).default;
    await Channel.findByIdAndUpdate(channelId, {
      $push: { videoIds: video._id }
    });

    user.uploadedVideos.push(video._id);
    await user.save();

    res.status(201).json({ message: 'Video uploaded successfully', videoId: video._id });
  } catch (error) {
    console.error('uploadVideo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ----------- GET SINGLE VIDEO ----------
export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploaderId', 'username')
      .populate('comments.userId', 'username');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Prepare a clean response object
    const responseVideo = {
      _id: video._id,
      title: video.title,
      description: video.description,
      filePath: video.filePath,
      thumbnailUrl: video.thumbnailUrl,
      channelId: video.channelId,
      uploader: video.uploaderId.username,
      views: video.views,
      likes: video.likes,
      dislikes: video.dislikes,
      comments: video.comments.map(c => ({
        _id: c._id,
        userId: c.userId._id,
        username: c.userId.username,
        text: c.text,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    };

    res.status(200).json(responseVideo);
  } catch (error) {
    console.error('getVideo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ----------- GET ALL VIDEOS ----------
export const getAllVideos = async (req, res) => {
  try {
    let query = Video.find().populate('uploaderId', 'username');

    if (req.query.search) {
      query = query.or([
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ]);
    }

    if (req.query.category) {
      query = query.where('category').equals(req.query.category);
    }

    const videos = await query.exec();

    // Map to simplified response objects
    const responseList = videos.map(video => ({
      _id: video._id,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      filePath: video.filePath,
      channelId: video.channelId,
      uploader: video.uploaderId.username,
      views: video.views,
      likes: video.likes,
      dislikes: video.dislikes,
    }));

    res.status(200).json(responseList);
  } catch (error) {
    console.error('getAllVideos error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ----------- LIKE VIDEO ----------
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.likes += 1;
    await video.save();

    res.status(200).json({ message: 'Video liked', likes: video.likes });
  } catch (error) {
    console.error('likeVideo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ----------- DISLIKE VIDEO ----------
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.dislikes += 1;
    await video.save();

    res.status(200).json({ message: 'Video disliked', dislikes: video.dislikes });
  } catch (error) {
    console.error('dislikeVideo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// controllers/videoController.js
export const incrementView = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // ✅ Get IP address
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0] || // handle proxies
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip;

    // Fallback to ensure we always have some IP string
    if (!ip) {
      return res.status(400).json({ message: 'IP address not found' });
    }

    // Ensure viewers array exists
    if (!video.viewers) {
      video.viewers = [];
    }

    const alreadyViewed = video.viewers.includes(ip);

    if (!alreadyViewed) {
      video.viewers.push(ip);
      video.views += 1;
      await video.save();
      console.log(`✅ New view from IP: ${ip} | Total views: ${video.views}`);
    } else {
      console.log(`⚠️ IP ${ip} already viewed this video`);
    }

    res.status(200).json({ message: 'View counted', views: video.views });

  } catch (err) {
    console.error('incrementView error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// ----------- ADD COMMENT ----------
export const addComment = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const newComment = {
      userId: req.user.id,
      text: req.body.text,
    };

    video.comments.push(newComment);
    await video.save();

    const savedComment = video.comments[video.comments.length - 1];

    res.status(201).json({
      message: 'Comment added',
      comment: {
        _id: savedComment._id,
        userId: savedComment.userId,
        text: savedComment.text,
      }
    });
  } catch (error) {
    console.error('addComment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ----------- EDIT COMMENT ----------
export const editComment = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const comment = video.comments.id(req.params.commentId);
    if (!comment || comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this comment' });
    }

    comment.text = req.body.text;
    await video.save();

    res.status(200).json({
      message: 'Comment updated',
      comment: {
        _id: comment._id,
        userId: comment.userId,
        text: comment.text,
      }
    });
  } catch (error) {
    console.error('editComment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ----------- DELETE COMMENT ----------
export const deleteComment = async (req, res) => {
  console.log('Received commentId:', req.params.commentId);
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    console.log('Comments:', video.comments.map(c => c._id.toString()));

    const comment = video.comments.find(c => c._id.toString() === req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    video.comments = video.comments.filter(c => c._id.toString() !== req.params.commentId);
    await video.save();

    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('deleteComment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ----------- DELETE VIDEO ----------
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    if (video.uploaderId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this video' });
    }

    const absolutePath = path.join(process.cwd(), video.filePath);
    if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);

    const Channel = (await import('../models/Channel.js')).default;
    await Channel.findByIdAndUpdate(video.channelId, {
      $pull: { videoIds: video._id }
    });

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { uploadedVideos: video._id }
    });

    await video.deleteOne();

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('deleteVideo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ----------- UPDATE VIDEO DETAILS ----------
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    if (video.uploaderId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this video' });
    }

    if (req.body.title) video.title = req.body.title;
    if (req.body.description) video.description = req.body.description;
    if (req.body.category) video.category = req.body.category;

    await video.save();

    res.status(200).json({ message: 'Video updated successfully', video });
  } catch (error) {
    console.error('updateVideo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
