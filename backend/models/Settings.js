const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // General Information
  companyName: { type: String, default: 'Solar Power House' },
  logo: { type: String, default: '' },
  tagline: { type: String, default: 'Powering a Sustainable Future' },
  description: { type: String, default: 'Leading provider of sustainable solar energy solutions' },
  
  // Contact Information
  email: { type: String, default: 'info@solarpowerhouse.com' },
  phone: { type: String, default: '+91 98765 43210' },
  address: { 
    street: { type: String, default: 'Solar Power House' },
    city: { type: String, default: 'Green Energy Park' },
    state: { type: String, default: 'Renewable City' },
    zipCode: { type: String, default: '123456' },
    country: { type: String, default: 'India' }
  },
  
  // Social Media
  socialMedia: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  
  // SEO Settings - Page specific
  seo: {
    // Global SEO settings (fallback)
    global: {
      metaTitle: { type: String, default: 'Solar Power House - Sustainable Solar Energy Solutions' },
      metaDescription: { type: String, default: 'Leading provider of sustainable solar energy solutions for homes and businesses. Get clean, renewable energy with professional installation and 25-year warranty.' },
      metaKeywords: { type: String, default: 'solar energy, solar panels, renewable energy, solar installation, clean energy, solar power' },
      ogImage: { type: String, default: '' },
      favicon: { type: String, default: '' }
    },
    // Page-specific SEO settings (supports dynamic keys like service-xyz)
    pages: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        home: { metaTitle: '', metaDescription: '', metaKeywords: '' },
        about: { metaTitle: '', metaDescription: '', metaKeywords: '' },
        services: { metaTitle: '', metaDescription: '', metaKeywords: '' },
        contact: { metaTitle: '', metaDescription: '', metaKeywords: '' }
      }
    }
  },
  
  // Business Hours
  businessHours: {
    monday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
    tuesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
    wednesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
    thursday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
    friday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
    saturday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, closed: { type: Boolean, default: false } },
    sunday: { open: { type: String, default: '10:00' }, close: { type: String, default: '16:00' }, closed: { type: Boolean, default: true } }
  },
  
  updatedAt: { type: Date, default: Date.now }
});

// Ensure only one settings document exists
settingsSchema.statics.getSingleton = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);