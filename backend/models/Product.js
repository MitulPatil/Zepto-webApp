const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Dairy', 'Vegetables', 'Fruits', 'Grains', 'Snacks', 'Beverages', 'Bakery', 'Spices']
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: 0
  },
  unit: {
    type: String,
    default: 'piece',
    enum: ['kg', 'g', 'l', 'ml', 'piece', 'dozen', 'pack']
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for search
productSchema.index({ name: 'text', description: 'text' });

productSchema.virtual('stockStatus').get(function () {
  if (this.stock <= 0) return 'out_of_stock';
  if (this.stock <= this.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

module.exports = mongoose.model('Product', productSchema);
