const JobDescription = require('../models/JobDescription');

// POST /api/jds
const createJD = async (req, res) => {
  try {
    const { rawText, normalizedText } = req.body;
    if (!rawText || !normalizedText) {
      return res
        .status(400)
        .json({ message: 'rawText and normalizedText required' });
    }
    const jd = new JobDescription({ rawText, normalizedText });
    await jd.save();
    res.status(201).json(jd);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/jds
const getJDs = async (req, res) => {
  try {
    const jds = await JobDescription.find().sort({ uploadedAt: -1 });
    res.json(jds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createJD, getJDs };
