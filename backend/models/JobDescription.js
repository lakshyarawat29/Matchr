const mongoose = require('mongoose');

const JobDescriptionSchema = new mongoose.Schema({
  rawText: { type: String, required: true },
  normalizedText: { type: String, required: true },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobDescription', JobDescriptionSchema);
