require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    process.env.PRODUCTION_FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Root route — fixes "Cannot GET /" on Vercel
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Solar Power House API is running',
    version: '1.0.0',
    endpoints: ['/api/health', '/api/services', '/api/consultations', '/api/contacts', '/api/settings', '/api/auth']
  });
});

// Health check endpoint
const startTime = Date.now();

app.get('/api/health', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  const healthStatus = {
    status: dbStatus === 1 ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: `${uptime}s`,
    database: {
      status: dbStatusMap[dbStatus] || 'Unknown',
      connected: dbStatus === 1,
      name: mongoose.connection.name || 'N/A'
    },
    server: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
      }
    },
    environment: process.env.NODE_ENV || 'development'
  };

  const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/consultations', require('./routes/consultations'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/bank-partners', require('./routes/bankPartners'));
app.use('/api/portfolio', require('./routes/portfolio'));

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

// Initialize sample bank partners on startup
const initializeSampleBankPartners = async () => {
  try {
    const BankPartner = require('./models/BankPartner');
    
    // Check if bank partners exist
    const bankPartnersCount = await BankPartner.countDocuments();
    
    if (bankPartnersCount === 0) {
      await BankPartner.insertMany([
        {
          name: 'State Bank of India',
          image: '/images/banks/sbi-logo.png'
        },
        {
          name: 'Punjab National Bank',
          image: '/images/banks/pnb-logo.png'
        },
        {
          name: 'Canara Bank',
          image: '/images/banks/canara-logo.png'
        },
        {
          name: 'Union Bank of India',
          image: '/images/banks/union-logo.png'
        },
        {
          name: 'Bank of India',
          image: '/images/banks/boi-logo.png'
        },
        {
          name: 'Bank of Baroda',
          image: '/images/banks/bob-logo.png'
        }
      ]);
      console.log('✅ Sample bank partners created successfully');
    } else {
      console.log(`✅ Bank partners already exist (${bankPartnersCount} partners)`);
    }
  } catch (error) {
    console.error('❌ Error initializing bank partners:', error.message);
  }
};

// MongoDB Connection — runs on both local and Vercel cold start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    console.log(`   Database: ${mongoose.connection.name}`);
    initializeAdmin();
    initializeSampleServices();
    initializeSampleBankPartners();
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start server locally only (Vercel uses module.exports)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
