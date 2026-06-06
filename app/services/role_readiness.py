from app.services.skills import extract_skills

SKILL_ALIASES = {
    "sql": [
        "mysql",
        "postgresql",
        "sqlite"
    ],

    "javascript": [
        "js"
    ],

    "node.js": [
        "nodejs",
        "node js"
    ],

    "react": [
        "reactjs",
        "react.js"
    ]
}
ROLE_REQUIREMENTS = {
    "backend engineer": [
        "Python",
        "FastAPI",
        "SQL",
        "MongoDB",
        "Docker",
        "Git",
        "AWS",
        "Redis",
        "Kubernetes"
    ],

    "full stack developer": [
        "JavaScript",
        "React",
        "Node.js",
        "MongoDB",
        "Git",
        "Docker",
        "HTML",
        "CSS"
    ],

    "software engineer": [
        "Java",
        "Python",
        "Git",
        "SQL",
        "Docker",
        "Data Structures"
    ],

    "ai engineer": [
        "Python",
        "FastAPI",
        "Machine Learning",
        "Vector Database",
        "RAG",
        "LLM",
        "Docker"
    ]
}

def skill_exists(skill, resume_skills_lower):

    skill = skill.lower()

    if skill in resume_skills_lower:
        return True

    aliases = SKILL_ALIASES.get(skill, [])

    for alias in aliases:
        if alias.lower() in resume_skills_lower:
            return True

    return False

def calculate_role_readiness(
    resume_text: str,
    role: str
):

    role = role.lower().strip()

    if role not in ROLE_REQUIREMENTS:

        return {
            "error": f"Unsupported role: {role}",
            "supported_roles": list(
                ROLE_REQUIREMENTS.keys()
            )
        }

    resume_skills = extract_skills(resume_text)

    resume_skills_lower = {
        skill.lower()
        for skill in resume_skills
    }

    required_skills = ROLE_REQUIREMENTS[role]

    matching_skills = []

    missing_skills = []

    for skill in required_skills:

        if skill_exists(skill, resume_skills_lower):
            matching_skills.append(skill)

        else:
            missing_skills.append(skill)

    readiness_score = round(
        (
            len(matching_skills)
            / len(required_skills)
        ) * 100
    )

    if readiness_score >= 80:
        readiness_level = "Job Ready"

    elif readiness_score >= 60:
        readiness_level = "Almost Ready"

    elif readiness_score >= 40:
        readiness_level = "Needs Improvement"

    else:
        readiness_level = "Beginner"

    roadmap = [
        f"Learn {skill}"
        for skill in missing_skills
    ]

    strengths = [
        f"Strong knowledge of {skill}"
        for skill in matching_skills[:5]
    ]

    return {
        "role": role.title(),
        "readiness_score": readiness_score,
        "readiness_level": readiness_level,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "strengths": strengths,
        "roadmap": roadmap
    }