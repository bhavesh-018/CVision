from app.services.skills import extract_skills

CRITICAL_SKILLS = {
    "aws", "gcp", "azure", "docker", "kubernetes", "k8s",
    "redis", "postgresql", "kafka", "system design", "microservices",
    "terraform", "ci/cd", "fastapi", "react", "pytorch", "rag", "llm"
}

def match_job_description(
    resume_text: str,
    job_description: str,
    candidate_skills: list[str] = None
) -> dict:
    """
    Production-grade Job Description Matcher.
    Extracts requirements dynamically, matches skills with canonical aliases,
    computes semantic similarity if available, and provides concrete tailoring advice.
    """
    if not job_description or len(job_description.strip()) < 10:
        return {
            "match_score": 0,
            "matching_skills": [],
            "missing_skills": [],
            "critical_missing_skills": [],
            "recommendations": ["No job description provided."],
            "match_level": "No JD",
            "semantic_score": 0
        }

    # Extract skills
    if candidate_skills:
        resume_skills_set = set(candidate_skills)
    else:
        resume_skills_set = set(extract_skills(resume_text))

    jd_skills = extract_skills(job_description)

    # Normalize comparison case-insensitively
    resume_lower_map = {s.lower(): s for s in resume_skills_set}
    jd_lower_map = {s.lower(): s for s in jd_skills}

    matching_lower = set(resume_lower_map.keys()) & set(jd_lower_map.keys())
    missing_lower = set(jd_lower_map.keys()) - set(resume_lower_map.keys())

    matching_skills = sorted([jd_lower_map[k] for k in matching_lower])
    missing_skills = sorted([jd_lower_map[k] for k in missing_lower])

    critical_missing_skills = [
        s for s in missing_skills
        if s.lower() in CRITICAL_SKILLS
    ]

    # Keyword match ratio
    if len(jd_skills) == 0:
        keyword_score = 70 if len(matching_skills) > 5 else 45
    else:
        keyword_score = round((len(matching_skills) / len(jd_skills)) * 100)

    # Try fast semantic similarity calculation
    semantic_score = None
    try:
        from app.services.semantic_matcher import calculate_semantic_similarity
        semantic_score = calculate_semantic_similarity(resume_text[:2500], job_description[:2500])
    except Exception:
        semantic_score = keyword_score

    # Weighted Composite Match Score
    if semantic_score is not None:
        composite_score = round((keyword_score * 0.6) + (semantic_score * 0.4))
    else:
        composite_score = keyword_score

    composite_score = min(max(composite_score, 10), 98)

    # Tailoring recommendations
    recommendations = []
    if critical_missing_skills:
        recommendations.append(
            f"High Priority ATS Gaps: This role emphasizes {', '.join(critical_missing_skills[:3])}. Highlight any hands-on experience, academic coursework, or personal projects using these tools."
        )

    if missing_skills and not critical_missing_skills:
        recommendations.append(
            f"Keywords to Incorporate: To improve ATS keyword ranking, integrate {', '.join(missing_skills[:4])} into your projects or work bullets."
        )

    if composite_score >= 80:
        recommendations.append("Strong Target Alignment: Your tech stack directly mirrors this job specification. Emphasize scale and metrics in your cover letter.")
        match_level = "High Match (80%+)"
    elif composite_score >= 60:
        recommendations.append("Solid Competitive Fit: You have the core foundation. Address secondary requirements in your summary section.")
        match_level = "Moderate Match (60–79%)"
    else:
        recommendations.append("Developing Match: Emphasize fundamental engineering versatility and related transferable tools.")
        match_level = "Developing Fit (<60%)"

    return {
        "match_score": composite_score,
        "keyword_score": keyword_score,
        "semantic_score": semantic_score or keyword_score,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "critical_missing_skills": critical_missing_skills,
        "recommendations": recommendations,
        "match_level": match_level,
        "total_jd_skills_found": len(jd_skills)
    }