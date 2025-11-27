require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const User = require('./models/User');

(async () => {
  try {
    await connectDB();

    const email = 'admin@campuscare.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', existing.email);
      process.exit(0);
    }

    const admin = new User({
      name: 'Super Admin',
      email,
      password: 'Admin@123',
      role: 'admin',
    });
    await admin.save();

    console.log('Seeded admin user:');
    console.log(' Email:', email);
    console.log(' Password: Admin@123');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
    process.exit(1);
  }
})();
