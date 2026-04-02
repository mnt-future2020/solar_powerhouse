const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  points: [{ type: String }],
}, { _id: false });

const legalPageSchema = new mongoose.Schema({
  // Privacy Policy
  privacyPolicy: {
    intro: { type: String, default: '' },
    sections: [sectionSchema],
    lastUpdated: { type: Date, default: Date.now },
  },

  // Terms of Service
  termsOfService: {
    intro: { type: String, default: '' },
    sections: [sectionSchema],
    lastUpdated: { type: Date, default: Date.now },
  },

  updatedAt: { type: Date, default: Date.now },
});

// Singleton — only one document
legalPageSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

module.exports = mongoose.model('LegalPage', legalPageSchema);
