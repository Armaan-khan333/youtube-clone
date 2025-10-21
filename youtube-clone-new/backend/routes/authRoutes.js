// routes/authRoutes.js - Defines API routes for user authentication
// This file sets up endpoints for signup and login

import express from 'express'; // Import Express router
import { signup, login } from '../controllers/authController.js'; // Import controller functions

const router = express.Router();

// Route for user registration
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

export default router; // Export router for use in server.js