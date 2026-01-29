const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @route   POST /api/payments/create
// @desc    Create dummy payment (fake Razorpay)
// @access  Private
router.post('/create', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate fake payment/order ID (like Razorpay)
    const paymentId = 'pay_' + Date.now() + Math.floor(Math.random() * 10000);
    const razorpayOrderId = 'order_' + Date.now() + Math.floor(Math.random() * 10000);

    // Return fake success response
    res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: {
        paymentId,
        orderId: razorpayOrderId,
        amount,
        currency: 'INR',
        status: 'captured',
        method: 'upi',
        description: 'Zepto Clone - Grocery Order',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment failed',
      error: error.message
    });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify dummy payment (always returns success)
// @access  Private
router.post('/verify', protect, (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;

    // In real Razorpay, we verify signature using crypto
    // Here we just return success for demo

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
});

// @route   GET /api/payments/methods
// @desc    Get available payment methods
// @access  Public
router.get('/methods', (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { id: 'upi', name: 'UPI', icon: '💳', enabled: true },
      { id: 'card', name: 'Credit/Debit Card', icon: '💳', enabled: true },
      { id: 'netbanking', name: 'Net Banking', icon: '🏦', enabled: true },
      { id: 'wallet', name: 'Wallet', icon: '👛', enabled: true },
      { id: 'cod', name: 'Cash on Delivery', icon: '💵', enabled: false }
    ]
  });
});

module.exports = router;