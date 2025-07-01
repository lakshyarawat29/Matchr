import spacy 
import string

nlp = spacy.load("en_core_web_sm");

def normalize_text(text):
  text = text.lower();
  text = text.translate(str.maketrans('','',string.punctuation))
  doc = nlp(text);
  tokens = [token.lemma_ for token in doc if token.is_alpha and not token.is_stop]
  return ' '.join(tokens);
