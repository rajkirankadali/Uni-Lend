const Transaction = require('../models/Transaction');
const { mockTopup } = require('../services/mockPaymentService');

// @desc    Get user transactions
// @route   GET /api/payments/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort('-createdAt').populate('booking');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Topup wallet (Mock)
// @route   POST /api/payments/mock-topup
// @access  Private
const topupWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const result = await mockTopup(req.user._id, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  topupWallet
};
