from fastapi import Form
from fastapi import FastAPI, UploadFile, File
from dotenv import load_dotenv
load_dotenv()
from app.services.parser import extract_resume_text
from app.services.skills import extract_skills
from app.services.ats import calculate_ats_score
from app.services.evaluator import evaluate_resume
from app.services.jd_matcher import match_job_description
from app.services.semantic_matcher import (
    calculate_semantic_similarity, get_match_level
)
from app.services.section_analyzer import analyze_sections
from app.services.llm_reviewer import review_resume
from app.services.interview_question_generator import generate_interview_questions
from app.services.resume_rewriter import rewrite_resume
from app.services.role_readiness import calculate_role_readiness

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

@app.post("/semantic-match")
async def semantic_match(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        resume_text = extract_resume_text(file)

        similarity_score = calculate_semantic_similarity(
            resume_text,
            job_description
        )

        match_level = get_match_level(similarity_score)

        return {
            "semantic_match_score": similarity_score,
            "match_level": match_level,
            "message": "Semantic matching completed"
        }

    except Exception as e:
        return {
            "error": str(e)
        }
    
@app.post("/analyze-sections")
async def analyze_resume_sections(
    file: UploadFile = File(...)
):

    try:

        resume_text = extract_resume_text(file)

        result = analyze_sections(resume_text)

        return result

    except Exception as e:
        return {
            "error": str(e)
        }

@app.post("/ai-review")
async def ai_review(
    file: UploadFile = File(...)
):
    try:

        resume_text = extract_resume_text(file)

        result = review_resume(resume_text)

        return result

    except Exception as e:
        return {
            "error": str(e)
        }

@app.post("/interview-questions")
async def interview_questions(
    file: UploadFile = File(...),
    job_description: str = Form("")
):

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    resume_text = extract_resume_text(file_path)

    return generate_interview_questions(
        resume_text,
        job_description
    )

@app.post("/improve-resume")
async def improve_resume(
    file: UploadFile = File(...)
):

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    resume_text = extract_resume_text(file_path)

    result = rewrite_resume(resume_text)

    return result

@app.post("/role-readiness")
async def role_readiness(
    file: UploadFile = File(...),
    role: str = Form(...)
):

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    resume_text = extract_resume_text(file_path)

    return calculate_role_readiness(
        resume_text,
        role
    )