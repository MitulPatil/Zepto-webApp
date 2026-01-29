const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const products = require('./products');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  });

// Seed function
const seedProducts = async () => {
  try {
    // Delete existing products
    await Product.deleteMany();
    console.log('🗑️  Deleted existing products');

    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Successfully added ${createdProducts.length} products`);

    console.log('\n📦 Products by category:');
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(category => {
      const count = products.filter(p => p.category === category).length;
      console.log(`   ${category}: ${count} products`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
    process.exit(1);
  }
};

// Run seed
seedProducts();