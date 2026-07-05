const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['REQUESTED', 'APPROVED', 'REJECTED', 'ACTIVE', 'RETURNED', 'COMPLETED', 'CANCELLED'],
    default: 'REQUESTED'
  },
  totalFee: { type: Number, required: true },
  depositHeld: { type: Number, required: true },
  escrowStatus: { 
    type: String, 
    enum: ['NONE', 'HELD', 'RELEASED', 'REFUNDED'],
    default: 'NONE'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
