const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  services: [{ type: String }], // Array of service IDs
  source: { type: String, default: 'Contact Form' },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
