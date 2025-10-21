// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';

// import videoRoutes from './routes/videoRoutes.js';
// import authRoutes from './routes/authRoutes.js';
// import channelRoutes from './routes/channelRoutes.js'; // Add this for channel page
// import path from 'path';


// dotenv.config();

// const app = express();



// // Middleware
// app.use(cors({ origin: 'http://localhost:3000' })); // Allow frontend access
// app.use(express.json());

// // Serve uploads folder statically so videos and thumbnails are accessible
// app.use('/uploads', express.static('uploads'));
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/channels', channelRoutes); // Add for channel page
// app.use('/api/videos', videoRoutes); // Upload middleware for videos

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import videoRoutes from './routes/videoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import channelRoutes from './routes/channelRoutes.js';

dotenv.config();

const app = express();

// --------------------
// 📁 Path setup (for __dirname in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --------------------

// --------------------
// 🔧 Middleware
// --------------------
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust as needed
app.use(express.json());

// Serve static video files (e.g., http://localhost:5000/uploads/video.mp4)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------------
// 🧭 API Routes
// --------------------
app.use('/api/auth', authRoutes);
app.use('/api/channel', channelRoutes);
app.use('/api/videos', videoRoutes);

// --------------------
// 🛢️ MongoDB Connection
// --------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// --------------------
// 🚀 Start Server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});
