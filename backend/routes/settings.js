const express = require('express');
const { body, validationResult } = require('express-validator');
const Settings = require('../models/Settings');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get settings (public - for frontend display)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get settings for admin
router.get('/admin', [auth, adminAuth], async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update general settings
router.put('/general', [auth, adminAuth,
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      companyName,
      logo,
      tagline,
      description,
      email,
      phone,
      address
    } = req.body;

    const settings = await Settings.getSingleton();
    
    if (companyName !== undefined) settings.companyName = companyName;
    if (logo !== undefined) settings.logo = logo;
    if (tagline !== undefined) settings.tagline = tagline;
    if (description !== undefined) settings.description = description;
    if (email !== undefined) settings.email = email;
    if (phone !== undefined) settings.phone = phone;
    if (address !== undefined) settings.address = { ...settings.address, ...address };
    
    settings.updatedAt = new Date();
    await settings.save();

    res.json({ message: 'General settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update SEO settings
router.put('/seo', [auth, adminAuth], async (req, res) => {
  try {
    const seoData = req.body;

    const settings = await Settings.getSingleton();
    
    // Initialize seo.pages if it doesn't exist
    if (!settings.seo.pages) {
      settings.seo.pages = {
        home: { metaTitle: '', metaDescription: '', metaKeywords: '' },
        about: { metaTitle: '', metaDescription: '', metaKeywords: '' },
        services: { metaTitle: '', metaDescription: '', metaKeywords: '' },
        contact: { metaTitle: '', metaDescription: '', metaKeywords: '' }
      };
    }
    
    // Update page-specific SEO data (supports dynamic keys like service-xyz)
    Object.keys(seoData).forEach(page => {
      settings.seo.pages[page] = {
        metaTitle: seoData[page].metaTitle || '',
        metaDescription: seoData[page].metaDescription || '',
        metaKeywords: seoData[page].metaKeywords || '',
      };
    });
    settings.markModified('seo.pages');
    
    settings.updatedAt = new Date();
    await settings.save();

    res.json({ message: 'SEO settings updated successfully', seo: settings.seo.pages });
  } catch (error) {
    console.error('SEO update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get SEO settings for specific page
router.get('/seo/:page?', async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    const { page } = req.params;
    
    // Initialize pages if they don't exist
    if (!settings.seo.pages) {
      settings.seo.pages = {
        home: { metaTitle: '', metaDescription: '', metaKeywords: '' },
        about: { metaTitle: '', metaDescription: '', metaKeywords: '' },
        services: { metaTitle: '', metaDescription: '', metaKeywords: '' },
        contact: { metaTitle: '', metaDescription: '', metaKeywords: '' }
      };
      await settings.save();
    }
    
    if (page && settings.seo.pages[page]) {
      res.json(settings.seo.pages[page]);
    } else {
      res.json(settings.seo.pages);
    }
  } catch (error) {
    console.error('SEO fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update social media settings
router.put('/social', [auth, adminAuth], async (req, res) => {
  try {
    const { socialMedia } = req.body;

    const settings = await Settings.getSingleton();
    settings.socialMedia = { ...settings.socialMedia, ...socialMedia };
    settings.updatedAt = new Date();
    await settings.save();

    res.json({ message: 'Social media settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update business hours
router.put('/hours', [auth, adminAuth], async (req, res) => {
  try {
    const { businessHours } = req.body;

    const settings = await Settings.getSingleton();
    settings.businessHours = { ...settings.businessHours, ...businessHours };
    settings.updatedAt = new Date();
    await settings.save();

    res.json({ message: 'Business hours updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;