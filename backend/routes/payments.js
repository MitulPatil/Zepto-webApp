const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/auth');

// Initialize Razorpay instance with test mode keys
let razorpay;
try {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('⚠️  WARNING: Razorpay keys not found in environment variables!');
    console.warn('Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file');
    console.warn('Get test keys from: https://dashboard.razorpay.com/');
  } else {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay initialized successfully');
  }
} catch (error) {
  console.error('❌ Failed to initialize Razorpay:', error.message);
}

// @route   POST /api/payments/create
// @desc    Create Razorpay order
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

    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway not configured. Please add Razorpay keys to .env file.'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise (Razorpay uses smallest currency unit)
      currency: 'INR',
      receipt: 'order_' + Date.now(),
      notes: {
        userId: req.user._id.toString(),
        orderType: 'grocery'
      }
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount / 100, // Convert back to rupees
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID // Send key to frontend
      }
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment signature
// @access  Private
router.post('/verify', protect, (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details'
      });
    }

    // Create signature for verification
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    // Compare signatures
    if (razorpay_signature === expectedSign) {
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed - Invalid signature',
        verified: false
      });
    }
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