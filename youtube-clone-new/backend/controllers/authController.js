// controllers/authController.js - Handles user authentication logic (signup and login)
// This file contains functions to register new users and authenticate existing ones with JWT

import User from '../models/User.js'; // Import User model
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for token generation
import dotenv from 'dotenv'; // Import dotenv to access JWT_SECRET from .env

// Load environment variables
dotenv.config();

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
// 
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email or username already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate userId internally — e.g.:
    const userCount = await User.countDocuments();
    const userId = `user${String(userCount + 1).padStart(2, '0')}`;

    const user = await User.create({
      userId,
      username,
      email,
      password,
    });

    const token = jwt.sign(
  { id: user._id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);


    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, userId, username, email }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
const token = jwt.sign(
  { id: user._id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);


    res.status(200).json({ message: 'Login successful', token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};