def calculate_ats_score(text, skills):

    score = 0

    breakdown = {
        "skills": 0,
        "projects": 0,
        "experience": 0,
        "education": 0,
        "contact": 0,
        "format": 0
    }

    # Skills (25)

    skill_score = min(len(skills) * 2.5, 25)

    breakdown["skills"] = round(skill_score)

    # Projects (20)

    if "project" in text.lower():
        breakdown["projects"] = 20

    # Experience (20)

    if "experience" in text.lower():
        breakdown["experience"] = 20

    # Education (15)

    if "education" in text.lower():
        breakdown["education"] = 15

    # Contact (10)

    if "@" in text:
        breakdown["contact"] = 10

    # Format (10)

    breakdown["format"] = 10

    score = sum(breakdown.values())

    return {
        "score": score,
        "breakdown": breakdown
    }