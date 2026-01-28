const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDb();

// Basic test route
app.get('/',(req,res)=>{
    res.json({ 
    message: 'Zepto Clone API Server is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
})

// Health check route
app.get('/api/health',(req,res)=>{
    res.json({ 
    status: 'OK', 
    environment: process.env.NODE_ENV,
    database: 'Connected'
  });   
})

// Test database route
app.get('/api/db-test', async (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    database: mongoose.connection.name,
    host: mongoose.connection.host
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});
    
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});