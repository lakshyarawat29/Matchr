const Resume = require('../models/Resume');

// POST /api/resumes
const createResume = async (req, res) => {
  try {
    const { rawText, normalizedText } = req.body;
    if (!rawText || !normalizedText) {
      return res
        .status(400)
        .json({ message: 'rawText and normalizedText required' });
    }
    const resume = new Resume({ rawText, normalizedText });
    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/resumes
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ uploadedAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createResume, getResumes };
