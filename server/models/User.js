const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
  role: {
    type: String,
    enum: ['admin', 'teacher'],
    required: true,
  },
  department: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  cgpa: {
    type: Number,
    default: 0,
  },
  designation: {
    type: String,
    trim: true,
  },
  specifications: {
    type: String,
    trim: true,
  },
  leaves: [
    {
      date: { type: Date, required: true },
      reason: { type: String, trim: true },
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
      _id: false,
      id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    },
  ],
  totalSalary: {
    type: Number,
    default: 0,
    min: 0,
  },
  paidSalary: {
    type: Number,
    default: 0,
    min: 0,
  },
  salaryRecords: [
    {
      month: { type: String, required: true, trim: true }, // YYYY-MM
      total: { type: Number, required: true, min: 0 },
      paid: { type: Number, required: true, min: 0 },
      status: { type: String, enum: ['Fully Paid', 'Half Paid', 'Not Paid'], required: true },
      _id: false,
      id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    },
  ],
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
