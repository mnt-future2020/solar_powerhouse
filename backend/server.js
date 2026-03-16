const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/settings', require('./routes/settings'));

// Only load upload route if dependencies are available
try {
  app.use('/api/upload', require('./routes/upload'));
  console.log('✅ Upload routes loaded successfully');
} catch (error) {
  console.log('⚠️  Upload routes not available - install dependencies: npm install');
  // Provide a fallback route
  app.get('/api/upload/config', (req, res) => {
    res.json({ configured: false, message: 'Upload dependencies not installed' });
  });
}

// Initialize admin user on startup
const initializeAdmin = async () => {
  try {
    const User = require('./models/User');
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created successfully');
      console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
    } else {
      console.log('✅ Admin user already exists');
      
      // Ensure admin has correct role
      if (adminExists.role !== 'admin') {
        adminExists.role = 'admin';
        await adminExists.save();
        console.log('✅ Admin role updated');
      }
    }
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
  }
};

// Initialize sample services on startup
const initializeSampleServices = async () => {
  try {
    const Service = require('./models/Service');
    
    // Check if services exist
    const servicesCount = await Service.countDocuments();
    
    if (servicesCount === 0) {
      await Service.insertMany([
        {
          title: 'Residential Solar Installation',
          description: 'Complete solar panel installation for homes with warranty and maintenance.',
          price: 15000,
          image: '/images/residential.jpg',
          features: ['Free consultation', '25-year warranty', 'Professional installation', 'Monitoring system']
        },
        {
          title: 'Commercial Solar Solutions',
          description: 'Large-scale solar installations for businesses and commercial properties.',
          price: 50000,
          image: '/images/commercial.jpg',
          features: ['Custom design', 'ROI analysis', 'Tax incentives', 'Maintenance included']
        },
        {
          title: 'Solar Panel Maintenance',
          description: 'Regular maintenance and cleaning services for optimal performance.',
          price: 500,
          image: '/images/maintenance.jpg',
          features: ['Quarterly cleaning', 'Performance check', 'Repair services', 'Emergency support']
        }
      ]);
      console.log('✅ Sample services created successfully');
    } else {
      console.log(`✅ Services already exist (${servicesCount} services)`);
    }
  } catch (error) {
    console.error('❌ Error initializing services:', error.message);
  }
};

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    console.log(`   Database: ${mongoose.connection.name}`);
    // Initialize admin and sample services after DB connection
    initializeAdmin();
    initializeSampleServices();
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
