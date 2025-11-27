require('dotenv').config();
const connectDB = require('./config/database');
const User = require('./models/User');

(async () => {
  try {
    await connectDB();
    const email = process.argv[2] || 'admin@campuscare.com';
    const newPassword = process.argv[3] || 'Admin@123';

    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      console.log('Admin user not found for email:', email);
      process.exit(1);
    }
    user.password = newPassword; // will be hashed by pre-save hook
    await user.save();
    console.log('Password reset for', email);
    process.exit(0);
  } catch (e) {
    console.error('Error resetting admin password:', e.message);
    process.exit(1);
  }
})();
