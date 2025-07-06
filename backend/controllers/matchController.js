const axios = require('axios');

exports.matchBaseline = async (req, res) => {
  const { resume, jd } = req.body;

  try {
    const response = await axios.post('http://localhost:8001/match-baseline', {
      resume,
      jd,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.matchSemantic = async (req, res) => {
  const { resume, jd } = req.body;

  try {
    const response = await axios.post('http://localhost:8001/match-semantic', {
      resume,
      jd,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
