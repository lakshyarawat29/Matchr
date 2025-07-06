const parserService = require('../services/parserService');

exports.parseResume = async (req, res) => {
  try {
    const data = await parserService.parseResume(req.file);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
