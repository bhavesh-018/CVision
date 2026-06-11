from app.db.chroma_manager import ChromaManager
from datetime import datetime

async def ingest_linkedin(linkedin_data: dict, analysis: dict, session_id: str):
    """Store LinkedIn profile and analysis summary into ChromaDB."""
    name = linkedin_data.get("name", "User")
    score = analysis.get("linkedin_score", 0)
    
    text = f"""LinkedIn Profile: {name}
Profile Score: {score}/100

Headline: {linkedin_data.get("headline", "Not provided")}
Location: {linkedin_data.get("location", "Not provided")}
Summary: {linkedin_data.get("summary", "Not provided")}
Experience: {', '.join([str(e) for e in linkedin_data.get("experience", [])])}
Education: {', '.join([str(e) for e in linkedin_data.get("education", [])])}
Skills: {', '.join(linkedin_data.get("skills", []))}
Certifications: {', '.join([str(c) for c in linkedin_data.get("certifications", [])])}

Consistency with Resume:
Matches: {', '.join(analysis.get('consistency', {}).get('matches', []))}
Mismatches: {', '.join(analysis.get('consistency', {}).get('mismatches', []))}
LinkedIn Strengths: {', '.join(analysis.get('consistency', {}).get('linkedin_strengths', []))}
Resume Strengths: {', '.join(analysis.get('consistency', {}).get('resume_strengths', []))}
Recommendation: {analysis.get('consistency', {}).get('recommendation', 'None')}

Recommendations:
{chr(10).join(f"- {r}" for r in analysis.get("recommendations", []))}
"""

    metadata = {
        "session_id": session_id,
        "name": name,
        "linkedin_score": score,
        "source": "linkedin",
        "ingested_at": datetime.now().isoformat(),
    }

    ChromaManager().store(
        collection="linkedin_profiles",
        texts=[text],
        metadatas=[metadata],
        ids=[f"linkedin_{session_id}"]
    )
