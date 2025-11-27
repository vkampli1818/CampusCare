const mongoose = require('mongoose');

const InfrastructureSchema = new mongoose.Schema(
  {
    details: { type: String, required: true, trim: true },
    amountRs: { type: Number, required: true, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Infrastructure', InfrastructureSchema);
