from fastapi import FastAPI, UploadFile, File
from services.parse_resume import extract_resume_text
from services.parse_jd import extract_job_description_text
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as pd


app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')

class MatchRequest(BaseModel):
    resume:str
    jd:str


@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    try:
        raw_text, normalized_text = await extract_resume_text(file)
        return {
            "raw_text": raw_text,
            "normalized_text": normalized_text
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/parse-job-description")
async def parse_job_description(file: UploadFile = File(...)):
    try:
        raw_text, normalized_text, extracted_fields = await extract_job_description_text(file)
        return {
            "raw_text": raw_text,
            "normalized_text": normalized_text,
            "extracted_fields": extracted_fields
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/match-baseline")
async def match_baseline(req: MatchRequest):
    try:
        documents = [req.resume, req.jd]

        # TF-IDF vectorization
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(documents)

        # Compute cosine similarity
        similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0] # type: ignore
        percentage_score = round(similarity_score * 100, 2)

        return {"score": percentage_score}

    except Exception as e:
        return {"error": str(e)}

@app.post("/match-semantic")
async def match_semantic(req: MatchRequest):
    embeddings = model.encode([req.resume, req.jd], convert_to_tensor=True)
    score = util.cos_sim(embeddings[0], embeddings[1]).item()
    return {"score": round(score * 100, 2)}