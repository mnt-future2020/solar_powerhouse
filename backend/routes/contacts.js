const express = require('express');
const Contact = require('../models/Contact');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Create contact
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all contacts (admin only)
router.get('/', [auth, adminAuth], async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact status and notes (admin only)
router.patch('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const updateData = {};
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.notes !== undefined) updateData.notes = req.body.notes;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact (admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
