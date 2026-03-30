const express = require('express');
const { body, validationResult } = require('express-validator');
const Consultation = require('../models/Consultation');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Submit consultation (public)
router.post('/', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('phone').notEmpty().trim().withMessage('Phone is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('city').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const consultation = new Consultation(req.body);
    await consultation.save();
    res.status(201).json({ message: 'Consultation request submitted successfully', consultation });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get consultations (admin only) — supports pagination
router.get('/', [auth, adminAuth], async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const status = req.query.status;
    const search = req.query.search;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [consultations, total] = await Promise.all([
      Consultation.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Consultation.countDocuments(filter),
    ]);

    res.json({ data: consultations, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update status/notes (admin only)
router.patch('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const updateData = {};
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.notes !== undefined) updateData.notes = req.body.notes;

    const consultation = await Consultation.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });
    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete (admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });
    res.json({ message: 'Consultation deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
