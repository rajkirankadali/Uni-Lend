const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Item = require('../models/Item');
const { holdEscrow, releaseEscrow, refundEscrow } = require('../services/mockPaymentService');

// @desc    Create a new booking request
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { item: itemId, startDate, endDate } = req.body;
    const item = await Item.findById(itemId).session(session);
    
    if (!item) throw new Error('Item not found');
    if (!item.isAvailable) throw new Error('Item is currently not available');
    if (item.owner.toString() === req.user._id.toString()) throw new Error('Cannot book your own item');

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) throw new Error('Invalid date range');

    const totalFee = (days * item.rentalFeePerDay) + item.depositAmount;

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      item: itemId,
      status: { $in: ['APPROVED', 'ACTIVE', 'RETURNED'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    }).session(session);

    if (overlapping) {
      throw new Error('Item is already booked for these dates');
    }

    const booking = new Booking({
      item: itemId,
      renter: req.user._id,
      owner: item.owner,
      startDate: start,
      endDate: end,
      totalFee,
      depositHeld: item.depositAmount,
      escrowStatus: 'HELD',
      status: 'REQUESTED'
    });

    await booking.save({ session });

    // Deduct money from renter
    await holdEscrow(req.user._id, totalFee, booking._id, session);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(booking);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ renter: req.user._id }, { owner: req.user._id }]
    }).populate('item').populate('renter', 'name email').populate('owner', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).session(session);
    if (!booking) throw new Error('Booking not found');

    const isOwner = booking.owner.toString() === req.user._id.toString();
    const isRenter = booking.renter.toString() === req.user._id.toString();

    if (!isOwner && !isRenter) throw new Error('Not authorized');

    // State machine logic
    if (booking.status === 'REQUESTED' && status === 'APPROVED') {
      if (!isOwner) throw new Error('Only owner can approve');
      booking.status = 'APPROVED';
    } else if (booking.status === 'REQUESTED' && status === 'REJECTED') {
      if (!isOwner) throw new Error('Only owner can reject');
      booking.status = 'REJECTED';
      booking.escrowStatus = 'REFUNDED';
      await refundEscrow(booking.renter, booking.totalFee, booking._id, session);
    } else if (booking.status === 'APPROVED' && status === 'ACTIVE') {
      // Both can trigger this when item is handed over (simplification)
      booking.status = 'ACTIVE';
    } else if (booking.status === 'ACTIVE' && status === 'RETURNED') {
      if (!isOwner) throw new Error('Only owner can confirm return');
      booking.status = 'RETURNED';
      const rentalFee = booking.totalFee - booking.depositHeld;
      await releaseEscrow(booking.renter, booking.owner, rentalFee, booking.depositHeld, booking._id, session);
      booking.escrowStatus = 'RELEASED';
      booking.status = 'COMPLETED'; // auto complete after payout
    } else if ((booking.status === 'REQUESTED' || booking.status === 'APPROVED' || booking.status === 'ACTIVE') && status === 'CANCELLED') {
      booking.status = 'CANCELLED';
      booking.escrowStatus = 'REFUNDED';
      // In real life, cancellation policies apply. Here we fully refund.
      await refundEscrow(booking.renter, booking.totalFee, booking._id, session);
    } else {
      throw new Error('Invalid state transition');
    }

    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.json(booking);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus
};
