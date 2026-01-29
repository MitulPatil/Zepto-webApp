const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Valid pincodes for Zepto delivery
const VALID_PINCODES = [
  '400001', '400002', '400003', '400004', '400005',
  '400006', '400007', '400008', '400009', '400010',
  '400011', '400012', '400013', '400014', '400015',
  '400016', '400017', '400018', '400019', '400020'
];

// @route   POST /api/addresses/validate-pincode
// @desc    Validate if pincode is serviceable
// @access  Public
router.post('/validate-pincode', (req, res) => {
  try {
    const { pincode } = req.body;

    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: 'Pincode is required'
      });
    }

    const isServiceable = VALID_PINCODES.includes(pincode.toString());

    res.status(200).json({
      success: true,
      serviceable: isServiceable,
      message: isServiceable 
        ? `Great! We deliver to ${pincode}` 
        : `Sorry, we don't deliver to ${pincode} yet. We serve pincodes 400001-400020`,
      pincode: pincode
    });
  } catch (error) {
    console.error('Validate pincode error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating pincode',
      error: error.message
    });
  }
});

// @route   POST /api/addresses
// @desc    Add new address for user
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, phone, addressLine, city, state, pincode, isDefault } = req.body;

    // Validation
    if (!name || !phone || !addressLine || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'All address fields are required'
      });
    }

    // Validate pincode
    if (!VALID_PINCODES.includes(pincode.toString())) {
      return res.status(400).json({
        success: false,
        message: `We don't deliver to pincode ${pincode}. We serve pincodes 400001-400020`
      });
    }

    // Get user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If this is set as default, remove default from other addresses
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Add new address
    user.addresses.push({
      name,
      phone,
      addressLine,
      city,
      state,
      pincode,
      isDefault: isDefault || user.addresses.length === 0 // First address is default
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: user.addresses
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding address',
      error: error.message
    });
  }
});

// @route   GET /api/addresses
// @desc    Get all addresses for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      count: user.addresses.length,
      data: user.addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses',
      error: error.message
    });
  }
});

// @route   PUT /api/addresses/:id
// @desc    Update address
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, phone, addressLine, city, state, pincode, isDefault } = req.body;

    // Validate pincode if provided
    if (pincode && !VALID_PINCODES.includes(pincode.toString())) {
      return res.status(400).json({
        success: false,
        message: `We don't deliver to pincode ${pincode}`
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Update fields
    if (name) address.name = name;
    if (phone) address.phone = phone;
    if (addressLine) address.addressLine = addressLine;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;

    // Handle default address
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: user.addresses
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating address',
      error: error.message
    });
  }
});

// @route   DELETE /api/addresses/:id
// @desc    Delete address
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    address.deleteOne();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: user.addresses
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting address',
      error: error.message
    });
  }
});

module.exports = router;