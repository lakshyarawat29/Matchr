from pdfminer.high_level import extract_text as extract_pdf
from docx import Document
from utils.normalizer import normalize_text
import os

async def extract_resume_text(file):
    filename = file.filename.lower()

    # Save file temporarily
    contents = await file.read()
    temp_path = f"temp_{filename}"
    with open(temp_path, "wb") as f:
        f.write(contents)

    try:
        if filename.endswith(".pdf"):
            raw_text = extract_pdf(temp_path)
        elif filename.endswith(".docx"):
            doc = Document(temp_path)
            raw_text = "\n".join([para.text for para in doc.paragraphs])
        elif filename.endswith(".txt"):
            with open(temp_path, "r", encoding="utf-8") as f:
                raw_text = f.read()
        else:
            raise ValueError("Unsupported file format")
    finally:
        os.remove(temp_path)

    normalized = normalize_text(raw_text)
    return raw_text, normalized
