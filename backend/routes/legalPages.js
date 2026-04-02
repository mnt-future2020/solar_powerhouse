const express = require('express');
const LegalPage = require('../models/LegalPage');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// GET /legal-pages — public (for frontend display)
router.get('/', async (req, res) => {
  try {
    const doc = await LegalPage.getSingleton();
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /legal-pages/privacy — public shortcut
router.get('/privacy', async (req, res) => {
  try {
    const doc = await LegalPage.getSingleton();
    res.json(doc.privacyPolicy);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /legal-pages/terms — public shortcut
router.get('/terms', async (req, res) => {
  try {
    const doc = await LegalPage.getSingleton();
    res.json(doc.termsOfService);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /legal-pages/privacy — admin only
router.put('/privacy', [auth, adminAuth], async (req, res) => {
  try {
    const { intro, sections } = req.body;
    const doc = await LegalPage.getSingleton();

    if (intro !== undefined) doc.privacyPolicy.intro = intro;
    if (sections !== undefined) doc.privacyPolicy.sections = sections;
    doc.privacyPolicy.lastUpdated = new Date();
    doc.updatedAt = new Date();
    await doc.save();

    res.json({ message: 'Privacy policy updated successfully', privacyPolicy: doc.privacyPolicy });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /legal-pages/terms — admin only
router.put('/terms', [auth, adminAuth], async (req, res) => {
  try {
    const { intro, sections } = req.body;
    const doc = await LegalPage.getSingleton();

    if (intro !== undefined) doc.termsOfService.intro = intro;
    if (sections !== undefined) doc.termsOfService.sections = sections;
    doc.termsOfService.lastUpdated = new Date();
    doc.updatedAt = new Date();
    await doc.save();

    res.json({ message: 'Terms of service updated successfully', termsOfService: doc.termsOfService });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
