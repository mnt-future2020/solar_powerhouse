const express = require('express');
const { body, validationResult } = require('express-validator');
const BankPartner = require('../models/BankPartner');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all bank partners
router.get('/', async (req, res) => {
  try {
    const bankPartners = await BankPartner.find().sort({ createdAt: -1 });
    res.json(bankPartners);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single bank partner
router.get('/:id', async (req, res) => {
  try {
    const bankPartner = await BankPartner.findById(req.params.id);
    if (!bankPartner) {
      return res.status(404).json({ message: 'Bank partner not found' });
    }
    res.json(bankPartner);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create bank partner (admin only)
router.post('/', [auth, adminAuth,
  body('name').notEmpty().withMessage('Name is required'),
  body('image').notEmpty().withMessage('Image is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const bankPartner = new BankPartner(req.body);
    await bankPartner.save();
    res.status(201).json(bankPartner);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update bank partner (admin only)
router.put('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const bankPartner = await BankPartner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bankPartner) {
      return res.status(404).json({ message: 'Bank partner not found' });
    }
    res.json(bankPartner);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete bank partner (admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const bankPartner = await BankPartner.findByIdAndDelete(req.params.id);
    if (!bankPartner) {
      return res.status(404).json({ message: 'Bank partner not found' });
    }
    res.json({ message: 'Bank partner deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;