// // middleware/auth.js - JWT authentication middleware
// // This checks for a valid JWT token in the request header to protect routes

// import jwt from 'jsonwebtoken'; // Import jsonwebtoken for token verification
// import dotenv from 'dotenv'; // Import dotenv to access JWT_SECRET

// // Load environment variables
// dotenv.config();

// // Middleware to verify JWT token
// export const protect = async (req, res, next) => {
//   let token;

//   // Check for token in Authorization header
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach user info to request object
//     next(); // Proceed to the next middleware/route handler
//   } catch (error) {
//     res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
//   }
// };

// middleware/auth.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js'; // <- you forgot to import this

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user from DB and attach to req.user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
  }
};
