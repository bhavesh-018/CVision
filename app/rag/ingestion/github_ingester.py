from app.db.chroma_manager import ChromaManager
from datetime import datetime


async def ingest_github(result: dict, session_id: str):
    """Store a GitHub analysis summary into ChromaDB so Career Coach can use it."""
    username = result.get("username", "unknown")
    stack = result.get("tech_stack", {})
    top_projects = result.get("top_projects", [])
    consistency = result.get("consistency", {})
    score = result.get("github_score", 0)

    # Build a rich text summary for embedding
    lang_str = ", ".join(
        f"{lang} ({pct}%)" for lang, pct in stack.get("languages", {}).items()
    )
    proj_str = "\n".join(
        f"- {p['name']}: {p.get('description', 'No description')} [{p.get('language', '')}] ⭐{p.get('stars', 0)}"
        for p in top_projects
    )
    validated = ", ".join(consistency.get("validated_skills", []))
    hidden = ", ".join(consistency.get("github_only", []))

    text = f"""GitHub Profile: @{username}
GitHub Score: {score}/100 ({result.get('level', '')})
Total Repos: {result.get('total_repos', 0)} | Followers: {result.get('profile', {}).get('followers', 0)}

Tech Stack:
Languages: {lang_str}
Frameworks: {', '.join(stack.get('frameworks', []))}
DevOps: {', '.join(stack.get('devops_tools', []))}

Top Projects:
{proj_str}

Skill Consistency:
Validated (on resume & GitHub): {validated}
Hidden skills (GitHub only, missing from resume): {hidden}

Recommendations:
{chr(10).join(f"- {r}" for r in result.get('recommendations', []))}
"""

    metadata = {
        "session_id": session_id,
        "username": username,
        "github_score": score,
        "source": "github",
        "ingested_at": datetime.now().isoformat(),
    }

    ChromaManager().store(
        "github_projects",
        [text],
        [metadata],
        [f"github_{session_id}_{username}"],
    )
