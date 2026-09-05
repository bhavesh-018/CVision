import httpx
import os
from dotenv import load_dotenv
load_dotenv()
from app.services.jd_matcher import match_job_description
from app.rag.generator import generate_rag_response

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_API_KEY = os.getenv("ADZUNA_API_KEY", "")
ADZUNA_BASE = "https://api.adzuna.com/v1/api/jobs"

async def search_jobs_adzuna(
    role: str,
    location: str,
    country: str = "us",
    limit: int = 10
) -> list[dict]:
    app_id = os.getenv("ADZUNA_APP_ID", "") or ADZUNA_APP_ID
    app_key = os.getenv("ADZUNA_API_KEY", "") or ADZUNA_API_KEY
    if not app_id or not app_key:
        return get_mock_jobs(role, location, limit)
    
    loc_clean = (location or "").strip()
    what_query = role.strip()
    where_query = None
    target_country = country.lower()

    # If location is remote / work from home, don't pass as geographic 'where'
    if loc_clean.lower() in ["remote", "wfh", "work from home"]:
        if "remote" not in what_query.lower():
            what_query = f"{what_query} remote"
    elif loc_clean:
        # If user specified something like "New York / Remote", pass New York to where
        cleaned_loc = loc_clean
        for term in ["remote", "wfh", "work from home"]:
            cleaned_loc = cleaned_loc.replace(term, "").replace("/", "").strip()
        if cleaned_loc:
            where_query = cleaned_loc
            if "remote" in loc_clean.lower() and "remote" not in what_query.lower():
                what_query = f"{what_query} remote"
        else:
            if "remote" not in what_query.lower():
                what_query = f"{what_query} remote"

    # Auto-detect country based on common locations if default 'us'
    loc_lower = loc_clean.lower()
    if any(k in loc_lower for k in ["india", "bangalore", "bengaluru", "mumbai", "delhi", "pune", "hyderabad", "noida", "gurgaon", "chennai"]):
        target_country = "in"
    elif any(k in loc_lower for k in ["uk", "united kingdom", "london", "manchester", "birmingham"]):
        target_country = "gb"
    elif any(k in loc_lower for k in ["canada", "toronto", "vancouver", "montreal"]):
        target_country = "ca"
    elif any(k in loc_lower for k in ["australia", "sydney", "melbourne", "brisbane"]):
        target_country = "au"

    params = {
        "app_id": app_id,
        "app_key": app_key,
        "results_per_page": limit,
        "what": what_query,
        "content-type": "application/json"
    }
    if where_query:
        params["where"] = where_query
    
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                f"{ADZUNA_BASE}/{target_country}/search/1",
                params=params
            )
            
            if response.status_code == 200:
                data = response.json()
                results = data.get("results", [])
                
                # If zero results with a specific 'where' location, try fallback without 'where'
                if not results and where_query:
                    params_fallback = {**params}
                    params_fallback.pop("where", None)
                    fallback_resp = await client.get(
                        f"{ADZUNA_BASE}/{target_country}/search/1",
                        params=params_fallback
                    )
                    if fallback_resp.status_code == 200:
                        results = fallback_resp.json().get("results", [])
                
                if results:
                    return [format_adzuna_job(job) for job in results]
                    
            # If Adzuna returned 0 results or non-200, fallback to mock jobs
            return get_mock_jobs(role, location, limit)
    except Exception as e:
        print(f"Adzuna API search error: {e}")
        return get_mock_jobs(role, location, limit)

def format_adzuna_job(job: dict) -> dict:
    return {
        "id": job.get("id"),
        "title": job.get("title"),
        "company": job.get("company", {}).get("display_name", "Company"),
        "location": job.get("location", {}).get("display_name", "Remote"),
        "salary_min": job.get("salary_min"),
        "salary_max": job.get("salary_max"),
        "description": job.get("description", "")[:800],
        "url": job.get("redirect_url"),
        "posted": job.get("created"),
        "source": "adzuna"
    }

def get_mock_jobs(role: str, location: str, limit: int = 10) -> list[dict]:
    MOCK_JOBS = [
        {
            "id": "mock_1",
            "title": "AI Engineer",
            "company": "TechFlow AI",
            "location": "Remote",
            "salary_min": 110000,
            "salary_max": 160000,
            "description": "We're looking for an AI Engineer with strong Python skills, "
                          "experience with LLMs, RAG systems, and vector databases like ChromaDB or Pinecone. "
                          "FastAPI experience required. Knowledge of LangChain or LlamaIndex a plus. "
                          "Must have experience deploying ML models to production.",
            "url": "https://example.com/job/1",
            "posted": "2026-06-09",
            "source": "mock"
        },
        {
            "id": "mock_2",
            "title": "Backend Python Engineer",
            "company": "DataStack Inc",
            "location": "New York, NY",
            "salary_min": 105000,
            "salary_max": 140000,
            "description": "Python Backend Engineer needed for our data platform. "
                          "Required: Python, FastAPI, PostgreSQL, Docker, AWS. "
                          "Nice to have: Redis, Kafka, Kubernetes. "
                          "3+ years experience preferred building scalable APIs.",
            "url": "https://example.com/job/2",
            "posted": "2026-06-08",
            "source": "mock"
        },
        {
            "id": "mock_3",
            "title": "Full Stack Developer",
            "company": "StartupXYZ",
            "location": "San Francisco, CA / Remote",
            "salary_min": 120000,
            "salary_max": 160000,
            "description": "Full Stack Developer for our SaaS product. "
                          "Required: React, Node.js, TypeScript, MongoDB, AWS. "
                          "Must have experience with Docker and CI/CD pipelines. "
                          "REST API design and GraphQL experience essential.",
            "url": "https://example.com/job/3",
            "posted": "2026-06-10",
            "source": "mock"
        },
        {
            "id": "mock_4",
            "title": "Data Engineer",
            "company": "DataInsights",
            "location": "Austin, TX",
            "salary_min": 95000,
            "salary_max": 135000,
            "description": "Data Engineer to build robust data pipelines. "
                          "Requires strong Python and SQL skills. "
                          "Experience with Snowflake, Airflow, and dbt. "
                          "Understanding of cloud platforms (AWS or GCP).",
            "url": "https://example.com/job/4",
            "posted": "2026-06-07",
            "source": "mock"
        },
        {
            "id": "mock_5",
            "title": "Senior Frontend Engineer",
            "company": "WebScale Solutions",
            "location": "Remote",
            "salary_min": 130000,
            "salary_max": 170000,
            "description": "Senior Frontend Engineer focused on React and Next.js. "
                          "Deep understanding of state management (Redux, Zustand), "
                          "TailwindCSS, and Webpack/Vite. Focus on web performance and accessibility. "
                          "5+ years of experience.",
            "url": "https://example.com/job/5",
            "posted": "2026-06-11",
            "source": "mock"
        },
        {
            "id": "mock_6",
            "title": "DevOps Engineer",
            "company": "CloudNative",
            "location": "Seattle, WA",
            "salary_min": 115000,
            "salary_max": 155000,
            "description": "Looking for a DevOps Engineer to manage our infrastructure. "
                          "Must know AWS, Terraform, Docker, and Kubernetes. "
                          "Experience with CI/CD tools like GitHub Actions or Jenkins. "
                          "Python or Go scripting skills required.",
            "url": "https://example.com/job/6",
            "posted": "2026-06-10",
            "source": "mock"
        }
    ]
    
    # Simple filtering
    role_lower = role.lower()
    loc_lower = location.lower()
    
    filtered = []
    for j in MOCK_JOBS:
        match_role = role_lower in j["title"].lower() or any(word in j["title"].lower() for word in role_lower.split() if len(word) > 2)
        match_loc = loc_lower in "remote" or loc_lower in j["location"].lower() or "remote" in j["location"].lower()
        
        if match_role and match_loc:
            filtered.append(j)
            
    # If too few, just return some random ones so the UI isn't empty for the demo
    if len(filtered) < 2:
        filtered = MOCK_JOBS
        
    return filtered[:limit]

async def score_job_match(
    job: dict,
    candidate_skills: list[str],
    resume_text: str = ""
) -> dict:
    combined_resume = f"{resume_text} {' '.join(candidate_skills)}".strip()
    match_result = match_job_description(
        combined_resume,
        job["description"]
    )
    
    score = match_result["match_score"]
    matching_skills = list(match_result["matching_skills"])
    missing_skills = list(match_result["missing_skills"])

    # If jd_matcher didn't find specific skills from strict skill list, check candidate_skills in JD text
    desc_lower = job.get("description", "").lower()
    title_lower = job.get("title", "").lower()
    for s in candidate_skills:
        s_clean = s.strip().lower()
        if len(s_clean) > 2 and (s_clean in desc_lower or s_clean in title_lower):
            if s_clean not in [m.lower() for m in matching_skills]:
                matching_skills.append(s)

    # Base score adjustment based on title relevance and identified skill overlap
    if score == 0 and matching_skills:
        score = min(len(matching_skills) * 20, 85)
    elif score == 0:
        # Check title overlap
        title_words = [w for w in title_lower.split() if len(w) > 3]
        overlap = sum(1 for w in title_words if w in combined_resume.lower())
        if overlap > 0:
            score = min(30 + overlap * 15, 75)
        else:
            score = 35

    return {
        "match_score": min(score, 98),
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "critical_gaps": match_result.get("critical_missing_skills", [])
    }

async def generate_application_advice(
    job: dict,
    match_data: dict,
    candidate_skills: list[str]
) -> str:
    prompt = f"""You are a career coach. Give brief, specific application advice.

Job: {job['title']} at {job['company']}
Match Score: {match_data['match_score']}%
Candidate has: {', '.join(candidate_skills[:10])}
Missing: {', '.join(match_data['missing_skills'][:5])}
Critical gaps: {', '.join(match_data['critical_gaps'])}

In 2-3 sentences, tell this candidate:
1. Why they should/shouldn't apply
2. One specific thing to highlight in cover letter
3. One skill to mention even if learning
"""
    
    try:
        response = await generate_rag_response(prompt, max_tokens=150)
        return response
    except:
        if match_data["match_score"] >= 70:
            return "Strong match! Highlight your matching skills prominently in your cover letter."
        return "Partial match. Consider addressing skill gaps in your application letter."
