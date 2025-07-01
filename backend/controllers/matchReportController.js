const MatchReport = require('../models/matchReport');

// POST /api/matchreports
const createMatchReport = async (req, res) => {
  try {
    const { resumeId, jdId, score, matched, missing } = req.body;

    if (!resumeId || !jdId || score === undefined || !matched || !missing) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const report = new MatchReport({ resumeId, jdId, score, matched, missing });
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/matchreports
const getMatchReports = async (req, res) => {
  try {
    const reports = await MatchReport.find()
      .populate('resumeId')
      .populate('jdId')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createMatchReport, getMatchReports };
