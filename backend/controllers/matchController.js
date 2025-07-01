const natural = require('natural');
const Resume = require('../models/Resume');
const JobDescription = require('../models/JobDescription');
const MatchReport = require('../models/matchReport');

const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const stopwords = require('../utils/stopwords');

const normalize = (text) =>
  tokenizer
    .tokenize(text.toLowerCase())
    .filter((word) => !stopwords.includes(word))
    .join(' ');

exports.baselineMatch = async (req, res) => {
  const { resumeId, jdId } = req.body;

  if (!resumeId || !jdId) {
    return res.status(400).json({ message: 'resumeId and jdId are required' });
  }

  try {
    const resume = await Resume.findById(resumeId);
    const jd = await JobDescription.findById(jdId);

    if (!resume || !jd) {
      return res
        .status(404)
        .json({ message: 'Resume or Job Description not found' });
    }

    const tfidf = new TfIdf();
    tfidf.addDocument(resume.normalizedText);
    tfidf.addDocument(jd.normalizedText);

    // Extract tokens
    const resumeTokens = new Set(resume.normalizedText.split(' '));
    const jdTokens = new Set(jd.normalizedText.split(' '));

    const matched = [...jdTokens].filter((word) => resumeTokens.has(word));
    const missing = [...jdTokens].filter((word) => !resumeTokens.has(word));

    // Cosine similarity
    const vector1 = tfidf.listTerms(0).map((t) => t.tfidf);
    const vector2 = tfidf.listTerms(1).map((t) => t.tfidf);

    const dotProduct = vector1.reduce(
      (sum, val, i) => sum + val * (vector2[i] || 0),
      0
    );
    const magnitude1 = Math.sqrt(
      vector1.reduce((sum, val) => sum + val * val, 0)
    );
    const magnitude2 = Math.sqrt(
      vector2.reduce((sum, val) => sum + val * val, 0)
    );
    const score =
      magnitude1 && magnitude2
        ? (dotProduct / (magnitude1 * magnitude2)) * 100
        : 0;

    // Save report
    const report = new MatchReport({
      resumeId,
      jdId,
      score: Math.round(score),
      matched,
      missing,
    });
    await report.save();

    res.json({ score: Math.round(score), matched, missing });
  } catch (error) {
    res.status(500).json({ message: 'Error computing baseline match', error });
  }
};
