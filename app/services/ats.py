import re


ADVANCED_SKILLS = [
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "fastapi",
    "react",
    "mongodb",
    "postgresql",
    "redis",
]

ACTION_WORDS = [
    "built",
    "developed",
    "implemented",
    "designed",
    "optimized",
    "created",
    "deployed",
    "improved",
    "reduced",
    "increased",
    "engineered",
    "automated",
]


def calculate_ats_score(text, skills):

    text_lower = text.lower()

    breakdown = {
        "skills": 0,
        "projects": 0,
        "experience": 0,
        "education": 0,
        "contact": 0,
        "format": 0,
    }

    # ------------------------
    # Skills (25)
    # ------------------------

    skill_count = len(skills)

    advanced_skill_count = sum(
        1
        for skill in skills
        if skill.lower() in ADVANCED_SKILLS
    )

    skills_score = 0

    if skill_count >= 12:
        skills_score += 15
    elif skill_count >= 8:
        skills_score += 12
    elif skill_count >= 5:
        skills_score += 8
    else:
        skills_score += 4

    skills_score += min(
        advanced_skill_count * 2,
        10
    )

    breakdown["skills"] = min(
        skills_score,
        25
    )

    # ------------------------
    # Projects (20)
    # ------------------------

    project_score = 0

    project_keywords = [
        "project",
        "projects",
        "portfolio",
    ]

    if any(
        keyword in text_lower
        for keyword in project_keywords
    ):
        project_score += 8

    technologies = [
        "react",
        "node",
        "fastapi",
        "mongodb",
        "mysql",
        "docker",
        "aws",
    ]

    tech_found = sum(
        tech in text_lower
        for tech in technologies
    )

    project_score += min(
        tech_found,
        7
    )

    if "github" in text_lower:
        project_score += 3

    if (
        "render" in text_lower
        or "vercel" in text_lower
        or "netlify" in text_lower
        or "railway" in text_lower
    ):
        project_score += 2

    breakdown["projects"] = min(
        project_score,
        20
    )

    # ------------------------
    # Experience (20)
    # ------------------------

    experience_score = 0

    experience_keywords = [
        "experience",
        "internship",
        "employment",
        "work experience",
    ]

    if any(
        keyword in text_lower
        for keyword in experience_keywords
    ):
        experience_score += 8

    action_word_count = sum(
        text_lower.count(word)
        for word in ACTION_WORDS
    )

    experience_score += min(
        action_word_count,
        7
    )

    if re.search(r"\d+%", text):
        experience_score += 5

    breakdown["experience"] = min(
        experience_score,
        20
    )

    # ------------------------
    # Education (15)
    # ------------------------

    education_keywords = [
        "education",
        "bachelor",
        "master",
        "degree",
        "university",
        "college",
    ]

    education_score = 0

    if any(
        keyword in text_lower
        for keyword in education_keywords
    ):
        education_score += 10

    if re.search(
        r"cgpa|gpa|\d\.\d",
        text_lower
    ):
        education_score += 5

    breakdown["education"] = min(
        education_score,
        15
    )

    # ------------------------
    # Contact (10)
    # ------------------------

    email_pattern = (
        r"[A-Za-z0-9._%+-]+@"
        r"[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
    )

    phone_pattern = (
        r"(\+?\d[\d\s\-]{8,})"
    )

    contact_score = 0

    if re.search(
        email_pattern,
        text
    ):
        contact_score += 3

    if re.search(
        phone_pattern,
        text
    ):
        contact_score += 3

    if "linkedin" in text_lower:
        contact_score += 2

    if "github" in text_lower:
        contact_score += 2

    breakdown["contact"] = min(
        contact_score,
        10
    )

    # ------------------------
    # Format (10)
    # ------------------------

    section_count = 0

    important_sections = [
        "skills",
        "education",
        "experience",
        "projects",
    ]

    for section in important_sections:
        if section in text_lower:
            section_count += 1

    format_score = round(
        (section_count /
         len(important_sections))
        * 8
    )

    word_count = len(
        text.split()
    )

    if 300 <= word_count <= 900:
        format_score += 2

    breakdown["format"] = min(
        format_score,
        10
    )

    score = sum(
        breakdown.values()
    )

    return {
        "score": score,
        "breakdown": breakdown,
    }