const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  phone:        { type: String, required: true },
  email:        { type: String, required: true },
  city:         { type: String, default: '' },
  propertyType: { type: String, default: '' },
  monthlyBill:  { type: String, default: '' },
  service:      { type: String, default: '' },
  message:      { type: String, default: '' },
  source:       { type: String, default: 'Consultation Form' },
  status:       { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  notes:        { type: String, default: '' },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consultation', consultationSchema);
