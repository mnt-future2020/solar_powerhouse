const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  images: { type: [String], default: [] },
  category: { type: String, default: 'Residential' },
  location: { type: String, default: '' },
  capacity: { type: String, default: '' },
  visible: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
