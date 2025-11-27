const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  regno: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true,
  },
  division: {
    type: String,
    trim: true,
    enum: ['', 'A', 'B'],
    default: '',
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
  },
  feeStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Not Paid'],
    default: 'Pending',
  },
  marks: {
    type: Number,
    default: 0,
  },
  cgpa: {
    type: Number,
    default: 0,
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
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
