const mongoose = require('mongoose');

const bankPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BankPartner', bankPartnerSchema);