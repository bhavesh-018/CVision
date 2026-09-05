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
            
            scored_jobs.append({
                **job,
                "match_score": match["match_score"],
                "matching_skills": match["matching_skills"],
                "missing_skills": match["missing_skills"],
                "critical_gaps": match["critical_gaps"],
                "application_advice": ""
            })
            
        scored_jobs.sort(key=lambda j: j["match_score"], reverse=True)
        display_jobs = scored_jobs[:request.limit]
        
        for j in display_jobs:
            score = j["match_score"]
            have = ", ".join(j["matching_skills"][:3]) if j["matching_skills"] else "core skills"
            missing = ", ".join(j["missing_skills"][:2]) if j["missing_skills"] else ""
            
            if score >= 75:
                j["application_advice"] = f"Strong match ({score}%)! Your experience with {have} makes you a standout candidate. Emphasize impact metrics and project outcomes with these tools in your cover letter."
            elif score >= 50:
                gap_note = f" Highlight any adjacent experience or side projects covering {missing}." if missing else ""
                j["application_advice"] = f"Good match ({score}%). Your foundation in {have} is relevant.{gap_note} Frame your background around problem-solving versatility."
            else:
                j["application_advice"] = f"Moderate fit ({score}%). To stand out, showcase practical projects demonstrating quick adaptation to {missing or 'the required tech stack'}."
        
        # For the #1 top match, try to add a personalized Gemini coach tip if available
        if display_jobs and request.skills:
            try:
                import asyncio
                top_job = display_jobs[0]
                ai_advice = await asyncio.wait_for(
                    generate_application_advice(top_job, top_job, request.skills),
                    timeout=3.0
                )
                if ai_advice and len(ai_advice.strip()) > 20 and not ai_advice.startswith("I encountered an error"):
                    top_job["application_advice"] = ai_advice.strip()
            except Exception:
                pass
        
        if request.session_id:
            for job in display_jobs[:3]:
                try:
                    await save_job_to_chroma(job, request.session_id)
                except Exception:
                    pass
                
        top_matches = [j for j in display_jobs if j["match_score"] >= 60]
        
        return JobSearchResponse(
            jobs=display_jobs,
            total_found=len(display_jobs),
            search_query=f"{request.role} in {request.location}",
            top_matches=top_matches[:3]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
