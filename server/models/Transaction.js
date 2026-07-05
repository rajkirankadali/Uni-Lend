const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  type: { 
    type: String, 
    enum: ['CHARGE', 'ESCROW_HOLD', 'ESCROW_RELEASE', 'REFUND', 'PAYOUT', 'MOCK_TOPUP'],
    required: true
  },
  amount: { type: Number, required: true },
  mockTxnId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
