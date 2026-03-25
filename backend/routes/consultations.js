const express = require('express');
const Consultation = require('../models/Consultation');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Submit consultation (public)
router.post('/', async (req, res) => {
  try {
    const consultation = new Consultation(req.body);
    await consultation.save();
    res.status(201).json({ message: 'Consultation request submitted successfully', consultation });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all consultations (admin only)
router.get('/', [auth, adminAuth], async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations);
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
