from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agents.github_agent import (
    fetch_github_profile,
    fetch_github_repos,
    analyze_tech_stack,
    score_project_quality,
    calculate_github_score,
    compare_resume_vs_github,
    generate_github_recommendations,
)
from app.rag.ingestion.github_ingester import ingest_github
from app.db.sqlite_manager import SQLiteManager
import httpx

router = APIRouter(prefix="/github", tags=["github"])


class GitHubRequest(BaseModel):
    github_url: str
    session_id: str
    resume_skills: list[str] = []


@router.post("/analyze")
async def analyze_github(request: GitHubRequest):
    # Extract username from URL or @handle
    username = request.github_url.strip().rstrip("/").split("/")[-1].lstrip("@")
    if not username:
        raise HTTPException(status_code=400, detail="Invalid GitHub URL or username")

    try:
        profile = await fetch_github_profile(username)
        repos = await fetch_github_repos(username, limit=30)

        stack = analyze_tech_stack(repos)

        # Top 5 projects by quality
        top_projects = []
        for repo in sorted(repos, key=lambda r: score_project_quality(r), reverse=True)[:5]:
            top_projects.append({
                "name": repo["name"],
                "description": repo.get("description") or "",
                "language": repo.get("language") or "Unknown",
                "stars": repo.get("stargazers_count", 0),
                "url": repo.get("html_url"),
                "homepage": repo.get("homepage") or "",
                "last_updated": repo.get("updated_at", ""),
                "topics": repo.get("topics", []),
                "quality_score": score_project_quality(repo),
            })

        score_data = calculate_github_score(profile, repos, stack)
        consistency = compare_resume_vs_github(request.resume_skills, stack)
        recommendations = generate_github_recommendations(score_data, consistency, stack)

        result = {
            "username": username,
            "github_score": score_data["github_score"],
            "level": score_data["level"],
            "score_breakdown": score_data["breakdown"],
            "profile": {
                "avatar_url": profile.get("avatar_url"),
                "bio": profile.get("bio") or "",
                "public_repos": profile.get("public_repos", 0),
                "followers": profile.get("followers", 0),
                "following": profile.get("following", 0),
                "blog": profile.get("blog") or "",
                "location": profile.get("location") or "",
                "name": profile.get("name") or username,
            },
            "tech_stack": stack,
            "top_projects": top_projects,
            "total_repos": len(repos),
            "consistency": consistency,
            "recommendations": recommendations,
        }

        # Persist to ChromaDB for Career Coach RAG
        await ingest_github(result, request.session_id)

        # Update SQLite profile so Coach sidebar shows GitHub as Connected
        db = SQLiteManager()
        db.update_profile(
            session_id=request.session_id,
            github_username=username,
            github_score=score_data["github_score"],
        )

        return result

    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"GitHub user '{username}' not found")
        if e.response.status_code == 403:
            raise HTTPException(status_code=429, detail="GitHub API rate limit exceeded. Try again in an hour or add a GITHUB_TOKEN.")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
