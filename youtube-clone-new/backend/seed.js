
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import bcrypt from 'bcryptjs';

// import User from './models/User.js';
// import Channel from './models/Channel.js';
// import Video from './models/Video.js';

// dotenv.config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('✅ MongoDB connected for seeding');
//   } catch (err) {
//     console.error('❌ MongoDB connection error:', err);
//     process.exit(1);
//   }
// };

// const sampleUsers = [
//   {
//     username: 'JohnDoe',
//     email: 'john@example.com',
//     password: bcrypt.hashSync('password123', 10),
//   },
//   {
//     username: 'Vijay',
//     email: 'vijay@example.com',
//     password: bcrypt.hashSync('password123', 10),
//   },
//   {
//     username: 'Heeba',
//     email: 'heeba@example.com',
//     password: bcrypt.hashSync('password123', 10),
//   },
//   {
//     username: 'Sohaan',
//     email: 'sohaan@example.com',
//     password: bcrypt.hashSync('password123', 10),
//   },
// ];

// const seedDB = async () => {
//   try {
//     // Clear existing data
//     await User.deleteMany();
//     await Channel.deleteMany();
//     await Video.deleteMany();
//     console.log('🧼 Existing data cleared');

//     // Insert users
//     const users = await User.insertMany(sampleUsers);

//     // Create channels for users
//     const sampleChannels = [
//       {
//         name: 'John’s React Channel',
//         description: 'React tutorials and more',
//         owner: users[0]._id,
//       },
//       {
//         name: 'Vijay’s Tech',
//         description: 'Technology content by Vijay',
//         owner: users[1]._id,
//       },
//       {
//         name: 'Heeba’s Art',
//         description: 'Creative art content from Heeba',
//         owner: users[2]._id,
//       },
//       {
//         name: 'Sohaan’s Music',
//         description: 'Musical creations by Sohaan',
//         owner: users[3]._id,
//       },
//     ];

//     const channels = await Channel.insertMany(sampleChannels);

//     // Update users with their channels (ObjectId references)
//     for (let i = 0; i < users.length; i++) {
//       users[i].channels.push(channels[i]._id);
//       await users[i].save();
//     }

//     // Create sample videos linked to channels and users
//     const sampleVideos = [
//       {
//         title: "Learn React in 30 Minutes",
//         thumbnailUrl: "https://example.com/thumbnails/react30min.png",
//         description: "A quick tutorial to get started with React.",
//         channelId: channels[0]._id,
//         uploaderId: users[0]._id,
//         views: 15200,
//         likes: 1023,
//         dislikes: 45,
//         filePath: "/uploads/1759011602618_testvideo.mp4",
//         category: "Tech",
//         comments: [
//           {
//             userId: users[1]._id, // ObjectId ref to Vijay
//             text: "Great video! Very helpful.",
//           },
//         ],
//       },
//       {
//         title: "Vijay’s Tech Tutorial",
//         thumbnailUrl: "https://example.com/thumbnails/vijay_tech.png",
//         description: "A tech tutorial for Vijay’s Tech",
//         channelId: channels[1]._id,
//         uploaderId: users[1]._id,
//         filePath: "/uploads/1759060098230_vijay_coding_demo.mp4",
//         category: "Tech",
//       },
//       {
//         title: "Heeba’s Art Showcase",
//         thumbnailUrl: "https://example.com/thumbnails/heeba_art.png",
//         description: "Showcasing my latest art for Heeba’s Art",
//         channelId: channels[2]._id,
//         uploaderId: users[2]._id,
//         filePath: "/uploads/1759061400407_heeba_art_showcase.mp4",
//         category: "Art",
//       },
//       {
//         title: "Sohaan’s Music Track",
//         thumbnailUrl: "https://example.com/thumbnails/sohaan_music.png",
//         description: "My latest music track for Sohaan’s Music",
//         channelId: channels[3]._id,
//         uploaderId: users[3]._id,
//         filePath: "/uploads/1759064616977_sohaan_music_track.mp4",
//         category: "Music",
//       },
//     ];

//     const videos = await Video.insertMany(sampleVideos);

//     // Update channel.videoIds arrays
//     for (const video of videos) {
//       const channel = await Channel.findById(video.channelId);
//       channel.videoIds.push(video._id);
//       await channel.save();
//     }

//     // Update user.uploadedVideos arrays
//     for (const video of videos) {
//       const user = await User.findById(video.uploaderId);
//       user.uploadedVideos.push(video._id);
//       await user.save();
//     }

//     console.log('✅ Database seeded successfully!');
//   } catch (err) {
//     console.error('❌ Error during seeding:', err);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// // Run seeding
// await connectDB();
// await seedDB();
// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from './models/User.js';
import Channel from './models/Channel.js';
import Video from './models/Video.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

const sampleUsers = [
  {
    username: 'JohnDoe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
  },
  {
    username: 'Vijay',
    email: 'vijay@example.com',
    password: bcrypt.hashSync('password123', 10),
  },
  {
    username: 'Heeba',
    email: 'heeba@example.com',
    password: bcrypt.hashSync('password123', 10),
  },
  {
    username: 'Sohaan',
    email: 'sohaan@example.com',
    password: bcrypt.hashSync('password123', 10),
  },
];

const seedDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Channel.deleteMany();
    await Video.deleteMany();
    console.log('🧼 Existing data cleared');

    // Insert users
    const users = await User.insertMany(sampleUsers);

    // Create channels
    const sampleChannels = [
      {
        name: 'John’s React Channel',
        description: 'React tutorials and more',
        owner: users[0]._id,
      },
      {
        name: 'Vijay’s Tech',
        description: 'Technology content by Vijay',
        owner: users[1]._id,
      },
      {
        name: 'Heeba’s Art',
        description: 'Creative art content from Heeba',
        owner: users[2]._id,
      },
      {
        name: 'Sohaan’s Music',
        description: 'Musical creations by Sohaan',
        owner: users[3]._id,
      },
    ];

    const channels = await Channel.insertMany(sampleChannels);

    // Link channels to users
    for (let i = 0; i < users.length; i++) {
      users[i].channels.push(channels[i]._id);
      await users[i].save();
    }

    // Create videos (no viewers array)
    const sampleVideos = [
      {
        title: "Learn React in 30 Minutes",
        thumbnailUrl: "https://example.com/thumbnails/react30min.png",
        description: "A quick tutorial to get started with React.",
        channelId: channels[0]._id,
        uploaderId: users[0]._id,
        views: 15200,
        likes: 1023,
        dislikes: 45,
        filePath: "/uploads/1759011602618_testvideo.mp4",
        category: "Tech",
        duration: "30:00",
        comments: [
          {
            userId: users[1]._id,
            text: "Great video! Very helpful.",
          },
        ],
      },
      {
        title: "Vijay’s Tech Tutorial",
        thumbnailUrl: "https://example.com/thumbnails/vijay_tech.png",
        description: "A tech tutorial for Vijay’s Tech",
        channelId: channels[1]._id,
        uploaderId: users[1]._id,
        filePath: "/uploads/1759060098230_vijay_coding_demo.mp4",
        category: "Tech",
        views: 0,
        likes: 0,
        dislikes: 0,
        duration: "12:45",
        comments: [],
      },
      {
        title: "Heeba’s Art Showcase",
        thumbnailUrl: "https://example.com/thumbnails/heeba_art.png",
        description: "Showcasing my latest art for Heeba’s Art",
        channelId: channels[2]._id,
        uploaderId: users[2]._id,
        filePath: "/uploads/1759061400407_heeba_art_showcase.mp4",
        category: "Art",
        views: 0,
        likes: 0,
        dislikes: 0,
        duration: "08:30",
        comments: [],
      },
      {
        title: "Sohaan’s Music Track",
        thumbnailUrl: "https://example.com/thumbnails/sohaan_music.png",
        description: "My latest music track for Sohaan’s Music",
        channelId: channels[3]._id,
        uploaderId: users[3]._id,
        filePath: "/uploads/1759064616977_sohaan_music_track.mp4",
        category: "Music",
        views: 0,
        likes: 0,
        dislikes: 0,
        duration: "03:15",
        comments: [],
      },
    ];

    const videos = await Video.insertMany(sampleVideos);

    // Link videos to channels
    for (const video of videos) {
      const channel = await Channel.findById(video.channelId);
      channel.videoIds.push(video._id);
      await channel.save();
    }

    // Link videos to uploaders
    for (const video of videos) {
      const user = await User.findById(video.uploaderId);
      user.uploadedVideos.push(video._id);
      await user.save();
    }

    console.log('✅ Database seeded successfully!');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed
await connectDB();
await seedDB();

