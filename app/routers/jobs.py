from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agents.job_agent import search_jobs_adzuna, score_job_match, generate_application_advice
from app.db.chroma_manager import ChromaManager
import uuid

router = APIRouter(prefix="/jobs", tags=["jobs"])

class JobSearchRequest(BaseModel):
    role: str
    location: str = "Remote"
    experience_years: int = 0
    skills: list[str] = []
    resume_text: str = ""
    session_id: str = ""
    limit: int = 10

class JobSearchResponse(BaseModel):
    jobs: list[dict]
    total_found: int
    search_query: str
    top_matches: list[dict]

async def save_job_to_chroma(job: dict, session_id: str):
    chroma = ChromaManager()
    
    text = f"""Job Title: {job['title']}
Company: {job['company']}
Location: {job['location']}
Match Score: {job['match_score']}%
Matching Skills: {', '.join(job['matching_skills'])}
Missing Skills: {', '.join(job['missing_skills'])}
Application Advice: {job['application_advice']}

Description:
{job['description']}
"""
    metadata = {
        "session_id": session_id,
        "job_id": str(job.get('id', uuid.uuid4())),
        "title": job['title'],
        "company": job['company'],
        "match_score": job['match_score']
    }
    
    chroma.store(
        collection="jobs",
        texts=[text],
        metadatas=[metadata],
        ids=[f"job_{session_id}_{metadata['job_id']}"]
    )

@router.post("/search", response_model=JobSearchResponse)
async def search_jobs(request: JobSearchRequest):
    try:
        raw_jobs = await search_jobs_adzuna(
            role=request.role,
            location=request.location,
            limit=request.limit + 5
        )
        
        scored_jobs = []
        for job in raw_jobs:
            match = await score_job_match(
                job=job,
                candidate_skills=request.skills,
                resume_text=request.resume_text
            )
            
            advice = await generate_application_advice(
                job=job,
                match_data=match,
                candidate_skills=request.skills
            )
            
            scored_jobs.append({
                **job,
                "match_score": match["match_score"],
                "matching_skills": match["matching_skills"],
                "missing_skills": match["missing_skills"],
                "critical_gaps": match["critical_gaps"],
                "application_advice": advice
            })
            
        scored_jobs.sort(key=lambda j: j["match_score"], reverse=True)
        
        if request.session_id:
            for job in scored_jobs[:3]:
                await save_job_to_chroma(job, request.session_id)
                
        top_matches = [j for j in scored_jobs if j["match_score"] >= 60]
        
        return JobSearchResponse(
            jobs=scored_jobs[:request.limit],
            total_found=len(scored_jobs),
            search_query=f"{request.role} in {request.location}",
            top_matches=top_matches[:3]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
