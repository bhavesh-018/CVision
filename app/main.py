from fastapi import Form
from fastapi import FastAPI, UploadFile, File

from app.services.parser import extract_resume_text
from app.services.skills import extract_skills
from app.services.ats import calculate_ats_score
from app.services.evaluator import evaluate_resume
from app.services.jd_matcher import match_job_description

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Resume Analyzer Running"}


@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...)
):

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_resume_text(file_path)

    skills = extract_skills(text)

    ats = calculate_ats_score(text, skills)

    evaluate = evaluate_resume(text, skills)

    return {
        "filename": file.filename,
        "skills": skills,
        "ats_score": ats["score"],
        "breakdown": ats["breakdown"],
        "strengths": evaluate["strengths"],
        "weaknesses": evaluate["weaknesses"],
        "suggestions": evaluate["suggestions"]          
    }

@app.post("/match-job")
async def match_job(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    resume_text = extract_resume_text(file_path)

    result = match_job_description(
        resume_text,
        job_description
    )

    return {
        "filename": file.filename,
        **result
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }