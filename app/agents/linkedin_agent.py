import httpx
import re
import json
from bs4 import BeautifulSoup
from app.rag.generator import generate_rag_response

async def fetch_linkedin_profile(linkedin_url: str) -> dict:
    """
    Attempt to fetch LinkedIn public profile.
    Returns parsed data or raises exception if blocked.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }
    
    async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as client:
        try:
            response = await client.get(linkedin_url, headers=headers)
            
            if response.status_code == 999 or "authwall" in str(response.url):
                return {"error": "blocked", "fallback_required": True}
                
            soup = BeautifulSoup(response.text, "html.parser")
            parsed = parse_linkedin_html(soup)
            
            # If we didn't find a name, we're probably still blocked somehow
            if not parsed.get("name") or parsed.get("name") == "Unknown":
                 return {"error": "blocked", "fallback_required": True}
                 
            return parsed
        except Exception:
            return {"error": "blocked", "fallback_required": True}

def parse_linkedin_html(soup: BeautifulSoup) -> dict:
    """Extract data from LinkedIn public profile HTML"""
    
    # Name
    name_tag = soup.find("h1")
    name = name_tag.text.strip() if name_tag else "Unknown"
    
    # Headline
    headline_tag = soup.find("div", {"class": re.compile("top-card-layout__headline")})
    headline = headline_tag.text.strip() if headline_tag else ""
    
    # Location
    location_tags = soup.find_all("span", {"class": re.compile("top-card__subline-item")})
    location = location_tags[0].text.strip() if location_tags else ""
    
    return {
        "name": name,
        "headline": headline,
        "location": location,
        "scraped": True,
        "summary": "",
        "experience": [],
        "education": [],
        "skills": [],
        "certifications": []
    }

def analyze_linkedin_data(linkedin_data: dict, resume_text: str = "") -> dict:
    profile_score = calculate_profile_completeness(linkedin_data)
    
    experience_years = calculate_experience_years(
        linkedin_data.get("experience", [])
    )
    
    cert_value = score_certifications(
        linkedin_data.get("certifications", [])
    )
    
    recommendations = generate_linkedin_recommendations(
        linkedin_data, profile_score
    )
    
    return {
        "linkedin_score": profile_score["total"],
        "profile_completeness": profile_score,
        "experience_years": experience_years,
        "certifications_score": cert_value,
        "recommendations": recommendations,
        "headline_analysis": analyze_headline(linkedin_data.get("headline", ""))
    }

async def compare_linkedin_vs_resume(linkedin_data: dict, resume_text: str) -> dict:
    linkedin_summary = f"""
    Headline: {linkedin_data.get('headline')}
    Summary: {linkedin_data.get('summary')}
    Experience: {', '.join([e.get('title', '') for e in linkedin_data.get('experience', [])])}
    Skills: {', '.join(linkedin_data.get('skills', []))}
    """
    
    prompt = f"""Compare this LinkedIn profile vs resume and identify consistency issues.

LinkedIn Profile:
{linkedin_summary}

Resume Text (excerpt):
{resume_text[:2000]}

Return ONLY valid JSON (no markdown formatting, no ```json prefixes):
{{
    "consistency_score": 75,
    "matches": ["list of things that match"],
    "mismatches": ["list of inconsistencies found"],
    "linkedin_strengths": ["things on LinkedIn not on resume"],
    "resume_strengths": ["things on resume not on LinkedIn"],
    "recommendation": "brief advice on alignment"
}}"""
    
    try:
        response = await generate_rag_response(prompt, max_tokens=1000)
        content = response.replace("```json", "").replace("```", "").strip()
        return json.loads(content)
    except Exception as e:
        return {
            "consistency_score": 75,
            "matches": ["Unable to fully analyze - manual review recommended"],
            "mismatches": [],
            "linkedin_strengths": [],
            "resume_strengths": [],
            "recommendation": f"Compare your LinkedIn headline with your resume objective manually."
        }

def calculate_profile_completeness(data: dict) -> dict:
    scores = {}
    
    scores["photo"] = 10
    
    headline = data.get("headline", "")
    if len(headline) > 50 and "|" in headline:
        scores["headline"] = 20
    elif len(headline) > 30:
        scores["headline"] = 15
    elif headline:
        scores["headline"] = 8
    else:
        scores["headline"] = 0
    
    exp_count = len(data.get("experience", []))
    scores["experience"] = min(exp_count * 8, 25)
    
    scores["education"] = 10 if data.get("education") else 0
    
    skill_count = len(data.get("skills", []))
    scores["skills"] = min(skill_count, 15)
    
    cert_count = len(data.get("certifications", []))
    scores["certifications"] = min(cert_count * 5, 10)
    
    scores["summary"] = 10 if data.get("summary") else 0
    
    total = sum(scores.values())
    scores["total"] = min(total, 100)
    
    return scores

def calculate_experience_years(experience: list) -> float:
    # Simplified mock calculation for now since duration parsing is complex
    return len(experience) * 1.5

def score_certifications(certifications: list) -> int:
    HIGH_VALUE_CERTS = {
        "aws", "google cloud", "azure", "kubernetes", "ckad", "cka",
        "tensorflow", "deeplearning.ai", "coursera", "udacity nanodegree",
        "pmp", "scrum master"
    }
    
    score = 0
    for cert in certifications:
        cert_lower = str(cert).lower()
        if any(hv in cert_lower for hv in HIGH_VALUE_CERTS):
            score += 15
        else:
            score += 8
    
    return min(score, 100)

def generate_linkedin_recommendations(data: dict, profile_score: dict) -> list[str]:
    recs = []
    if profile_score["summary"] == 0:
        recs.append("Add a compelling 'About' summary detailing your passions and career goals.")
    if profile_score["headline"] < 15:
        recs.append("Optimize your headline. Include keywords and value props (e.g. 'Backend Engineer | Python | AWS').")
    if profile_score["experience"] < 15:
        recs.append("Add more detail to your experience entries. Focus on impact and metrics.")
    if profile_score["skills"] < 15:
        recs.append("Add at least 15 relevant skills to improve your search ranking.")
    if not recs:
        recs.append("Your profile is very strong. Keep it updated as you learn new skills!")
    return recs

def analyze_headline(headline: str) -> dict:
    length = len(headline)
    has_keywords = "|" in headline or "-" in headline
    return {
        "length": length,
        "is_optimized": length > 40 and has_keywords,
        "feedback": "Good" if length > 40 and has_keywords else "Consider adding more keywords separated by |"
    }
