const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

exports.matchBaseline = (resumeText, jdText) => {
  const tfidf = new TfIdf();
  tfidf.addDocument(resumeText);
  tfidf.addDocument(jdText);

  const score = natural.CosineSimilarity(
    tfidf.listTerms(0).map((term) => term.tfidf),
    tfidf.listTerms(1).map((term) => term.tfidf)
  );

  // extract keywords (naively for now)
  const resumeWords = new Set(resumeText.split(/\s+/));
  const jdWords = new Set(jdText.split(/\s+/));

  const matched = [...jdWords].filter((w) => resumeWords.has(w));
  const missing = [...jdWords].filter((w) => !resumeWords.has(w));

  return {
    score: Math.round(score * 100),
    matchedKeywords: matched,
    missingKeywords: missing,
  };
};
