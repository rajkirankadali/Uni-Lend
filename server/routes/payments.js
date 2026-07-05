const express = require('express');
const router = express.Router();
const { getTransactions, topupWallet } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.get('/transactions', protect, getTransactions);
router.post('/mock-topup', protect, topupWallet);

module.exports = router;
