from fastapi import FastAPI, UploadFile, File
from services.parse_resume import extract_resume_text
from services.parse_jd import extract_job_description_text

app = FastAPI()

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
