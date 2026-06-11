import httpx
import os
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
    if not ADZUNA_APP_ID:
        return get_mock_jobs(role, location, limit)
    
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_API_KEY,
        "results_per_page": limit,
        "what": role,
        "where": location,
        "content-type": "application/json"
    }
    
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(
            f"{ADZUNA_BASE}/{country}/search/1",
            params=params
        )
        
        if response.status_code != 200:
            return get_mock_jobs(role, location, limit)
        
        data = response.json()
        return [format_adzuna_job(job) for job in data.get("results", [])]

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
    match_result = match_job_description(
        resume_text or " ".join(candidate_skills),
        job["description"]
    )
    
    return {
        "match_score": match_result["match_score"],
        "matching_skills": match_result["matching_skills"],
        "missing_skills": match_result["missing_skills"],
        "critical_gaps": match_result["critical_missing_skills"]
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
