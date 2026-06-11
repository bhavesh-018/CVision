import httpx
import os
from datetime import datetime, timezone

GITHUB_API_BASE = "https://api.github.com"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")


def get_headers():
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "CVision-Career-OS"
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers


async def fetch_github_profile(username: str) -> dict:
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(
            f"{GITHUB_API_BASE}/users/{username}",
            headers=get_headers()
        )
        response.raise_for_status()
        return response.json()


async def fetch_github_repos(username: str, limit: int = 30) -> list:
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(
            f"{GITHUB_API_BASE}/users/{username}/repos",
            params={"sort": "updated", "per_page": limit, "type": "owner"},
            headers=get_headers()
        )
        response.raise_for_status()
        return response.json()


# ── Analysis helpers ──────────────────────────────────────────────────────────

FRAMEWORK_KEYWORDS = {
    "React": ["react", "reactjs", "next", "nextjs"],
    "Vue": ["vue", "nuxt"],
    "Angular": ["angular"],
    "Django": ["django"],
    "FastAPI": ["fastapi", "fast-api"],
    "Flask": ["flask"],
    "Spring": ["spring", "springboot"],
    "Express": ["express", "expressjs"],
    "Laravel": ["laravel"],
    "TailwindCSS": ["tailwind"],
    "GraphQL": ["graphql"],
    "Prisma": ["prisma"],
}

DEVOPS_KEYWORDS = {
    "Docker": ["docker"],
    "Kubernetes": ["kubernetes", "k8s"],
    "Terraform": ["terraform"],
    "GitHub Actions": ["actions", "github-actions"],
    "AWS": ["aws", "lambda", "ec2", "s3"],
    "GCP": ["gcp", "google-cloud"],
    "CI/CD": ["cicd", "ci-cd", "pipeline"],
}


def _match_keywords(text: str, keyword_map: dict) -> list:
    text_lower = text.lower()
    matched = []
    for label, keywords in keyword_map.items():
        if any(kw in text_lower for kw in keywords):
            matched.append(label)
    return matched


def analyze_tech_stack(repos: list) -> dict:
    language_counts: dict = {}
    frameworks: set = set()
    devops_tools: set = set()

    for repo in repos:
        # Languages
        lang = repo.get("language")
        if lang:
            language_counts[lang] = language_counts.get(lang, 0) + 1

        # Infer frameworks / devops from name + description + topics
        searchable = " ".join(filter(None, [
            repo.get("name", ""),
            repo.get("description", "") or "",
            " ".join(repo.get("topics", []))
        ]))

        frameworks.update(_match_keywords(searchable, FRAMEWORK_KEYWORDS))
        devops_tools.update(_match_keywords(searchable, DEVOPS_KEYWORDS))

    total = sum(language_counts.values()) or 1
    language_percentages = {
        lang: round((count / total) * 100)
        for lang, count in sorted(language_counts.items(), key=lambda x: -x[1])
    }
    primary = max(language_counts, key=language_counts.get) if language_counts else "Unknown"

    return {
        "languages": language_percentages,
        "primary_language": primary,
        "frameworks": sorted(frameworks),
        "devops_tools": sorted(devops_tools),
    }


def score_project_quality(repo: dict) -> int:
    score = 0
    if repo.get("description"):
        score += 20
    stars = repo.get("stargazers_count", 0)
    score += min(stars * 5, 25)
    updated_at = repo.get("updated_at", "")
    if updated_at:
        updated = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
        days_ago = (datetime.now(timezone.utc) - updated).days
        if days_ago < 30:
            score += 20
        elif days_ago < 90:
            score += 15
        elif days_ago < 365:
            score += 8
    if not repo.get("fork"):
        score += 15
    if repo.get("homepage"):
        score += 10
    topics = repo.get("topics", [])
    score += min(len(topics) * 2, 10)
    return min(score, 100)


def calculate_github_score(profile: dict, repos: list, stack: dict) -> dict:
    active_repos = [r for r in repos if not r.get("fork") and r.get("updated_at")]

    volume_score = min(len(active_repos) * 3, 25)

    quality_scores = [score_project_quality(r) for r in repos[:10]]
    quality_avg = sum(quality_scores) / len(quality_scores) if quality_scores else 0
    quality_score = round(quality_avg * 0.35)

    lang_count = len(stack["languages"])
    diversity_score = min(lang_count * 4, 20)

    followers = profile.get("followers", 0)
    social_score = min(followers, 20)

    total = volume_score + quality_score + diversity_score + social_score
    github_score = min(round(total), 100)

    if github_score >= 85:
        level = "Expert"
    elif github_score >= 70:
        level = "Advanced"
    elif github_score >= 50:
        level = "Intermediate"
    else:
        level = "Beginner"

    return {
        "github_score": github_score,
        "level": level,
        "breakdown": {
            "volume": volume_score,
            "quality": quality_score,
            "diversity": diversity_score,
            "social_proof": social_score,
        },
    }


def compare_resume_vs_github(resume_skills: list, github_stack: dict) -> dict:
    github_langs = set(github_stack["languages"].keys())
    github_frameworks = set(github_stack.get("frameworks", []))
    all_github_tech = github_langs | github_frameworks

    resume_set = set(s.lower() for s in resume_skills)
    github_set = set(t.lower() for t in all_github_tech)

    resume_only = [s for s in resume_skills if s.lower() not in github_set]
    github_only = [t for t in all_github_tech if t.lower() not in resume_set]

    overlap = len(resume_set & github_set)
    consistency_score = round((overlap / max(len(resume_set), 1)) * 100)

    return {
        "consistency_score": consistency_score,
        "resume_only": resume_only[:6],
        "github_only": github_only[:6],
        "validated_skills": sorted(resume_set & github_set),
    }


def generate_github_recommendations(score_data: dict, consistency: dict, stack: dict) -> list:
    recs = []
    bd = score_data["breakdown"]

    if bd["volume"] < 15:
        recs.append("Build more original projects — aim for 8+ quality repos to boost your volume score.")
    if bd["quality"] < 20:
        recs.append("Add READMEs, descriptions, and live demo links to your top repos.")
    if bd["diversity"] < 12:
        recs.append("Explore a second language or framework to broaden your technical breadth.")
    if consistency["resume_only"]:
        skills = ", ".join(consistency["resume_only"][:3])
        recs.append(f"Prove these resume skills with GitHub projects: {skills}.")
    if consistency["github_only"]:
        skills = ", ".join(consistency["github_only"][:3])
        recs.append(f"Add these demonstrated skills to your resume: {skills}.")
    if bd["social_proof"] < 10:
        recs.append("Star popular repos and contribute to open source to build GitHub presence.")
    if not stack.get("devops_tools"):
        recs.append("Add CI/CD or Docker to at least one project to demonstrate DevOps awareness.")

    return recs
