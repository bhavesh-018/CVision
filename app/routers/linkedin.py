from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.agents.linkedin_agent import (
    fetch_linkedin_profile,
    analyze_linkedin_data,
    compare_linkedin_vs_resume
)
from app.rag.ingestion.linkedin_ingester import ingest_linkedin
from app.db.sqlite_manager import SQLiteManager

router = APIRouter(prefix="/linkedin", tags=["linkedin"])

class LinkedInURLRequest(BaseModel):
    linkedin_url: str
    session_id: str
    resume_text: str = ""

class ExperienceItem(BaseModel):
    title: str = ""
    company: str = ""
    duration: str = ""
    description: str = ""

class EducationItem(BaseModel):
    school: str = ""
    degree: str = ""

class CertificationItem(BaseModel):
    name: str = ""
    issuer: str = ""

class LinkedInManualInput(BaseModel):
    session_id: str
    headline: str = ""
    summary: str = ""
    experience: List[ExperienceItem] = []
    education: List[EducationItem] = []
    skills: List[str] = []
    certifications: List[CertificationItem] = []
    location: str = ""
    resume_text: str = ""

@router.post("/analyze-url")
async def analyze_linkedin_url(request: LinkedInURLRequest):
    try:
        profile_data = await fetch_linkedin_profile(request.linkedin_url)
        
        if profile_data.get("fallback_required"):
            return {
                "status": "fallback_required",
                "message": "LinkedIn blocks automated scraping for this profile.",
                "form_required": True
            }
        
        analysis = analyze_linkedin_data(profile_data)
        
        consistency = await compare_linkedin_vs_resume(profile_data, request.resume_text)
        analysis["consistency"] = consistency
        
        await ingest_linkedin(profile_data, analysis, request.session_id)
        
        db = SQLiteManager()
        try:
            db.update_profile(
                session_id=request.session_id,
                linkedin_username=request.linkedin_url
            )
        finally:
            db.conn.close()
        
        return {"status": "success", **analysis, "profile": profile_data}
    
    except Exception as e:
        return {
            "status": "fallback_required",
            "error": str(e),
            "form_required": True
        }

@router.post("/analyze-manual")
async def analyze_linkedin_manual(request: LinkedInManualInput):
    linkedin_data = {
        "headline": request.headline,
        "summary": request.summary,
        "experience": [e.model_dump() for e in request.experience],
        "education": [e.model_dump() for e in request.education],
        "skills": request.skills,
        "certifications": [c.model_dump() for c in request.certifications],
        "location": request.location,
        "name": "User" # Manual form doesn't ask for name currently
    }
    
    analysis = analyze_linkedin_data(linkedin_data)
    
    consistency = await compare_linkedin_vs_resume(linkedin_data, request.resume_text)
    analysis["consistency"] = consistency
    
    await ingest_linkedin(linkedin_data, analysis, request.session_id)
    
    db = SQLiteManager()
    try:
        db.update_profile(
            session_id=request.session_id,
            linkedin_username="manual_input"
        )
    finally:
        db.conn.close()
    
    return {"status": "success", **analysis, "profile": linkedin_data}
