const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  image: { type: String },
  features: [String],
  bannerImage: { type: String },
  detailTitle: { type: String },
  detailDescription: { type: String },
  detailFeatures: [String],
  workProcess: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);