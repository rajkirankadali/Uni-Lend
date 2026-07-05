const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['electronics', 'textbooks', 'lab-equipment', 'sports', 'other'],
    required: true
  },
  campus: { type: String, required: true },
  rentalFeePerDay: { type: Number, required: true },
  depositAmount: { type: Number, required: true },
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
