import re


def calculate_ats_score(text, skills):

    text_lower = text.lower()

    breakdown = {
        "skills": 0,
        "projects": 0,
        "experience": 0,
        "education": 0,
        "contact": 0,
        "format": 0
    }

    # Skills (25)

    skill_count = len(skills)

    if skill_count >= 10:
        breakdown["skills"] = 25
    elif skill_count >= 7:
        breakdown["skills"] = 20
    elif skill_count >= 4:
        breakdown["skills"] = 15
    else:
        breakdown["skills"] = 10

    # Projects (20)

    project_keywords = [
        "project",
        "projects",
        "portfolio"
    ]

    if any(keyword in text_lower for keyword in project_keywords):
        breakdown["projects"] = 20

    # Experience (20)

    experience_keywords = [
        "experience",
        "internship",
        "employment",
        "work experience"
    ]

    if any(keyword in text_lower for keyword in experience_keywords):
        breakdown["experience"] = 20

    # Education (15)

    education_keywords = [
        "education",
        "bachelor",
        "master",
        "degree",
        "university",
        "college"
    ]

    if any(keyword in text_lower for keyword in education_keywords):
        breakdown["education"] = 15

    # Contact (10)

    email_pattern = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"

    phone_pattern = r"(\+?\d[\d\s\-]{8,})"

    has_email = re.search(email_pattern, text)
    has_phone = re.search(phone_pattern, text)

    if has_email and has_phone:
        breakdown["contact"] = 10
    elif has_email:
        breakdown["contact"] = 5

    # Format (10)

    section_count = 0

    important_sections = [
        "skills",
        "education",
        "experience",
        "projects"
    ]

    for section in important_sections:
        if section in text_lower:
            section_count += 1

    breakdown["format"] = round(
        (section_count / len(important_sections)) * 10
    )

    score = sum(breakdown.values())

    return {
        "score": score,
        "breakdown": breakdown
    }