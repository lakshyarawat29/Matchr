const mongoose = require('mongoose');

const matchReportSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  jdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDescription',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  matched: [String],
  missing: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
