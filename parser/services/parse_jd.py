# services/parse_jd.py

import re
from pdfminer.high_level import extract_text
from utils.normalizer import normalize_text
from fastapi import UploadFile

def extract_fields(text: str) -> dict:
    # Job Title
    job_title_match = re.search(r'job title[:\-]?\s*(.+)', text, re.IGNORECASE)
    job_title = job_title_match.group(1).strip().split('\n')[0] if job_title_match else None

    # Company
    company_match = re.search(r'company[:\-]?\s*(.+)', text, re.IGNORECASE)
    if company_match:
        company = company_match.group(1).strip().split('\n')[0]
    else:
        # fallback: try to find "Company XYZ" or similar patterns
        company_search = re.search(r'(company \w+)', text, re.IGNORECASE)
        company = company_search.group(1) if company_search else None

    # Skills - from Qualifications or Skills section
    skills_match = re.search(r'qualifications[:\-]?\s*(.+?)(?:\n\n|$)', text, re.IGNORECASE | re.DOTALL)
    skills = []
    if skills_match:
        raw_skills_text = skills_match.group(1)
        skills = re.findall(r'\b[a-zA-Z\+#]+(?: [a-zA-Z\+#]+)*\b', raw_skills_text)
        skills = [skill.strip() for skill in skills if len(skill) > 1]

    # Experience
    experience_match = re.search(r'(\d+\+? years|junior|mid|senior|lead|internship)', text, re.IGNORECASE)
    experience = experience_match.group(1) if experience_match else None

    # Location
    location_match = re.search(r'location[:\-]?\s*(.+)', text, re.IGNORECASE)
    location = location_match.group(1).strip() if location_match else None

    # Job Type
    job_type_match = re.search(r'(full[- ]time|part[- ]time|contract|internship)', text, re.IGNORECASE)
    job_type = job_type_match.group(1) if job_type_match else None

    return {
        "job_title": job_title,
        "skills": list(set(skills)),
        "experience": experience,
        "location": location,
        "job_type": job_type,
        "company": company
    }



async def extract_job_description_text(file: UploadFile):
    content = await file.read()
    raw_text = ""
    filename = file.filename or ""
    if filename.lower().endswith(".pdf"):
        with open("temp_jd.pdf", "wb") as f:
            f.write(content)
        raw_text = extract_text("temp_jd.pdf")
    else:
        raw_text = content.decode("utf-8")
    
    normalized_text = normalize_text(raw_text)
    extracted = extract_fields(normalized_text)
    
    return raw_text, normalized_text, extracted
