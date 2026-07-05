const User = require('../models/User');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const crypto = require('crypto');

const generateMockTxnId = () => `mock_txn_${crypto.randomUUID()}`;

// Add funds to wallet (for testing)
const mockTopup = async (userId, amount) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error('User not found');
    
    user.walletBalance += amount;
    await user.save({ session });
    
    const txn = await Transaction.create([{
      user: userId,
      type: 'MOCK_TOPUP',
      amount,
      mockTxnId: generateMockTxnId()
    }], { session });

    await session.commitTransaction();
    session.endSession();
    return { success: true, balance: user.walletBalance, txn: txn[0] };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Hold funds in escrow
const holdEscrow = async (userId, amount, bookingId, session) => {
  const user = await User.findById(userId).session(session);
  if (!user) throw new Error('User not found');
  if (user.walletBalance < amount) {
    throw new Error('Insufficient wallet balance for booking');
  }

  user.walletBalance -= amount;
  await user.save({ session });

  await Transaction.create([{
    user: userId,
    booking: bookingId,
    type: 'ESCROW_HOLD',
    amount,
    mockTxnId: generateMockTxnId()
  }], { session });
};

// Release escrow (split to owner and back to renter)
const releaseEscrow = async (renterId, ownerId, rentalFee, depositAmount, bookingId, session) => {
  // Payout to owner
  const owner = await User.findById(ownerId).session(session);
  owner.walletBalance += rentalFee;
  await owner.save({ session });

  await Transaction.create([{
    user: ownerId,
    booking: bookingId,
    type: 'PAYOUT',
    amount: rentalFee,
    mockTxnId: generateMockTxnId()
  }], { session });

  // Refund deposit to renter
  const renter = await User.findById(renterId).session(session);
  renter.walletBalance += depositAmount;
  await renter.save({ session });

  await Transaction.create([{
    user: renterId,
    booking: bookingId,
    type: 'REFUND',
    amount: depositAmount,
    mockTxnId: generateMockTxnId()
  }], { session });
};

// Full refund to renter (e.g., if rejected or cancelled before active)
const refundEscrow = async (renterId, totalAmount, bookingId, session) => {
  const renter = await User.findById(renterId).session(session);
  renter.walletBalance += totalAmount;
  await renter.save({ session });

  await Transaction.create([{
    user: renterId,
    booking: bookingId,
    type: 'REFUND',
    amount: totalAmount,
    mockTxnId: generateMockTxnId()
  }], { session });
};

module.exports = {
  mockTopup,
  holdEscrow,
  releaseEscrow,
  refundEscrow
};
