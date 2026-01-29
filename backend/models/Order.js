const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryAddress: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    addressLine: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    default: 'Razorpay',
    enum: ['Razorpay', 'COD', 'Card', 'UPI']
  },
  paymentStatus: {
    type: String,
    default: 'Paid',
    enum: ['Pending', 'Paid', 'Failed']
  },
  orderStatus: {
    type: String,
    default: 'Confirmed',
    enum: ['Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled']
  },
  deliveryTime: {
    type: Date,
    default: function() {
      // Set delivery time 10 minutes from now
      return new Date(Date.now() + 10 * 60 * 1000);
    }
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Add initial status to history when order is created
orderSchema.pre('save', function() {
  if (this.isNew) {
    this.statusHistory.push({
      status: 'Confirmed',
      timestamp: new Date()
    });
  }
});

module.exports = mongoose.model('Order', orderSchema);