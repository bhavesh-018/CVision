import re
from typing import Optional

POWER_ACTION_VERBS = {
    # Engineering & Architecture
    "architected", "engineered", "designed", "developed", "implemented",
    "built", "constructed", "integrated", "refactored", "automated",
    "containerized", "migrated", "deployed", "configured", "debugged",
    # Optimization & Results
    "optimized", "reduced", "accelerated", "boosted", "improved",
    "streamlined", "scaled", "maximized", "minimized", "enhanced",
    # Leadership & Collaboration
    "spearheaded", "pioneered", "led", "directed", "orchestrated",
    "founded", "mentored", "championed", "collaborated", "published"
}

WEAK_PASSIVE_PHRASES = [
    "responsible for", "worked on", "assisted with", "helped with",
    "duties included", "handled", "part of a team that", "tasked with"
]

ADVANCED_TECH = {
    "docker", "kubernetes", "aws", "azure", "gcp", "fastapi", "react",
    "mongodb", "postgresql", "redis", "kafka", "terraform", "ci/cd",
    "pytorch", "rag", "llm", "microservices", "graphql"
}

METRIC_PATTERNS = [
    r"\b\d+(?:\.\d+)?%",                            # 45%, 12.5%
    r"\b(?:\$|€|£|₹)\s*\d+(?:,\d+)*(?:\.\d+)?[kKmMbB]?", # $50k, €1.2M
    r"\b\d+[kKmMbB]\+?\s*(?:users|requests|queries|records|events|lines|qps|rps|dau|mau)?\b", # 100k+ users
    r"\b\d+x\b",                                   # 3x, 10x
    r"\breduced\s+by\s+\d+",                       # reduced by 30
    r"\bincreased\s+by\s+\d+",                      # increased by 50
    r"\b\d+\s*(?:ms|seconds|minutes|hours|days)\b" # 200ms, 5 days
]


def calculate_ats_score(
    text: str,
    skills: list[str],
    job_description: Optional[str] = None
) -> dict:
    """
    Production-grade multi-dimensional ATS scoring engine.
    Evaluates:
      1. Format & Parseability (max 15)
      2. Impact & Quantifiable Metrics (max 25)
      3. Action Verbs & Active Voice (max 20)
      4. Technical Breadth & Depth (max 20)
      5. Alignment (Target JD Alignment or General Role Balance) (max 20)
    """
    if not text or not isinstance(text, str):
        return {
            "score": 0,
            "grade": "Needs Major Work",
            "breakdown": {"format": 0, "metrics": 0, "action_verbs": 0, "skills": 0, "alignment": 0},
            "suggestions": ["Upload a readable text-based PDF resume."]
        }

    text_lower = text.lower()
    suggestions = []

    # -------------------------------------------------------------
    # 1. Format & Parseability (Max 15)
    # -------------------------------------------------------------
    format_score = 0
    important_sections = ["experience", "education", "skills", "projects"]
    found_sections = [s for s in important_sections if s in text_lower]
    format_score += int((len(found_sections) / len(important_sections)) * 7)

    # Word count check
    words = text.split()
    word_count = len(words)
    if 350 <= word_count <= 950:
        format_score += 4
    elif 250 <= word_count < 350 or 950 < word_count <= 1200:
        format_score += 2
    else:
        suggestions.append(f"Resume length is {word_count} words. Ideal length is 400–850 words for clear ATS scanning.")

    # Contact information
    email_pattern = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
    phone_pattern = r"(\+?\d[\d\s\-]{8,}\d)"
    has_email = bool(re.search(email_pattern, text))
    has_phone = bool(re.search(phone_pattern, text))
    has_linkedin = "linkedin" in text_lower
    has_github = "github" in text_lower or "portfolio" in text_lower

    contact_points = 0
    if has_email: contact_points += 1
    if has_phone: contact_points += 1
    if has_linkedin: contact_points += 1
    if has_github: contact_points += 1
    format_score += min(contact_points, 4)

    if not has_linkedin:
        suggestions.append("Add your LinkedIn profile link to improve candidate discoverability and verification.")
    if not has_github:
        suggestions.append("Include your GitHub or portfolio link to showcase verified code and project proof.")

    format_score = min(format_score, 15)

    # -------------------------------------------------------------
    # 2. Impact & Quantifiable Metrics (Max 25)
    # -------------------------------------------------------------
    metrics_matches = set()
    for pattern in METRIC_PATTERNS:
        matches = re.findall(pattern, text, flags=re.IGNORECASE)
        for m in matches:
            if isinstance(m, str) and len(m.strip()) > 0:
                metrics_matches.add(m.strip())

    metric_count = len(metrics_matches)
    if metric_count >= 8:
        metrics_score = 25
    elif metric_count >= 5:
        metrics_score = 21
    elif metric_count >= 3:
        metrics_score = 16
    elif metric_count >= 1:
        metrics_score = 10
    else:
        metrics_score = 4

    if metric_count < 5:
        suggestions.append(f"Found {metric_count} quantifiable metrics. Production ATS systems prioritize resumes with at least 5-8 bullet points containing numbers, %, or measurable business impact.")

    # -------------------------------------------------------------
    # 3. Action Verbs & Active Voice (Max 20)
    # -------------------------------------------------------------
    found_power_verbs = set()
    for verb in POWER_ACTION_VERBS:
        if re.search(r"\b" + verb + r"\b", text_lower):
            found_power_verbs.add(verb)

    found_weak_phrases = [p for p in WEAK_PASSIVE_PHRASES if p in text_lower]

    verb_count = len(found_power_verbs)
    if verb_count >= 10:
        verbs_score = 20
    elif verb_count >= 7:
        verbs_score = 16
    elif verb_count >= 4:
        verbs_score = 12
    elif verb_count >= 2:
        verbs_score = 8
    else:
        verbs_score = 4

    # Penalize weak passive phrasing
    if found_weak_phrases:
        verbs_score = max(verbs_score - len(found_weak_phrases) * 2, 2)
        suggestions.append(f"Replace passive phrasing like '{found_weak_phrases[0]}' with strong power verbs (e.g. 'Engineered', 'Optimized', 'Architected').")

    # -------------------------------------------------------------
    # 4. Technical Breadth & Competency (Max 20)
    # -------------------------------------------------------------
    skill_count = len(skills)
    adv_skills_found = [s for s in skills if s.lower() in ADVANCED_TECH]
    adv_count = len(adv_skills_found)

    skills_score = 0
    if skill_count >= 14:
        skills_score += 12
    elif skill_count >= 9:
        skills_score += 10
    elif skill_count >= 5:
        skills_score += 7
    else:
        skills_score += 4

    skills_score += min(adv_count * 2, 8)
    skills_score = min(skills_score, 20)

    # -------------------------------------------------------------
    # 5. Alignment: Target JD Alignment OR General Role Balance (Max 20)
    # -------------------------------------------------------------
    alignment_score = 0
    if job_description and len(job_description.strip()) > 30:
        # Targeted JD alignment
        from app.services.skills import extract_skills
        jd_skills = extract_skills(job_description)
        if jd_skills:
            matching_with_jd = [s for s in skills if s.lower() in [j.lower() for j in jd_skills]]
            match_ratio = len(matching_with_jd) / max(len(jd_skills), 1)
            alignment_score = int(min(match_ratio * 20, 20))
            if match_ratio < 0.6:
                missing = [j for j in jd_skills if j.lower() not in [s.lower() for s in skills]]
                suggestions.append(f"Target JD alignment: Add missing key technologies: {', '.join(missing[:4])}.")
        else:
            alignment_score = 14
    else:
        # General Role Balance & Section Completeness
        balance = 0
        if "github.com" in text_lower or "leetcode" in text_lower:
            balance += 4
        if re.search(r"\b(?:bachelor|master|b\.tech|m\.tech|b\.s\.|m\.s\.|degree|university)\b", text_lower):
            balance += 5
        if re.search(r"\b(?:gpa|cgpa|\d\.\d\s*/\s*\d)\b", text_lower):
            balance += 3
        if re.search(r"\b(?:production|scalable|architecture|rest api|database)\b", text_lower):
            balance += 5
        if "certif" in text_lower or "award" in text_lower or "honor" in text_lower:
            balance += 3
        alignment_score = min(balance, 20)

    total_score = format_score + metrics_score + verbs_score + skills_score + alignment_score
    total_score = min(max(total_score, 10), 99)

    # Grade determination
    if total_score >= 88:
        grade = "A (Top 5% ATS Ready)"
    elif total_score >= 78:
        grade = "B+ (Competitive)"
    elif total_score >= 68:
        grade = "B (Good Foundation)"
    elif total_score >= 55:
        grade = "C (Needs Optimization)"
    else:
        grade = "D (High ATS Drop Risk)"

    return {
        "score": total_score,
        "grade": grade,
        "breakdown": {
            "format": format_score,
            "metrics": metrics_score,
            "action_verbs": verbs_score,
            "skills": skills_score,
            "alignment": alignment_score
        },
        "metrics_count": metric_count,
        "action_verbs_count": verb_count,
        "suggestions": suggestions[:4] if suggestions else ["Your resume demonstrates strong ATS compliance and structure."]
    }