from app.services.skills import extract_skills


SKILL_ALIASES = {
    "sql": ["mysql", "postgresql", "sqlite"],
    "javascript": ["js"],
    "node.js": ["nodejs", "node js"],
    "react": ["reactjs", "react.js"],
    "aws": ["amazon web services"],
    "ci/cd": ["github actions", "gitlab ci", "jenkins"],
    "machine learning": ["ml"],
    "llm": ["large language model", "gpt", "gemini"],
}

ROLE_REQUIREMENTS = {
    "backend engineer": {
        "core": {
            "Python": 10,
            "FastAPI": 10,
            "SQL": 10,
            "Docker": 10,
            "Git": 10,
        },
        "secondary": {
            "AWS": 5,
            "Redis": 5,
            "Kubernetes": 5,
            "CI/CD": 5,
        },
    },

    "full stack developer": {
        "core": {
            "JavaScript": 10,
            "React": 10,
            "Node.js": 10,
            "MongoDB": 10,
            "Git": 10,
        },
        "secondary": {
            "Docker": 5,
            "AWS": 5,
            "TypeScript": 5,
            "Next.js": 5,
        },
    },

    "frontend developer": {
        "core": {
            "JavaScript": 10,
            "React": 15,
            "HTML": 10,
            "CSS": 10,
            "Git": 5,
        },
        "secondary": {
            "TypeScript": 5,
            "Redux": 5,
            "Next.js": 5,
            "Tailwind": 5,
        },
    },

    "software engineer": {
        "core": {
            "Java": 10,
            "Python": 10,
            "SQL": 10,
            "Git": 10,
            "Data Structures": 10,
        },
        "secondary": {
            "Docker": 5,
            "REST API": 5,
            "OOP": 5,
            "System Design": 5,
        },
    },

    "ai engineer": {
        "core": {
            "Python": 15,
            "Machine Learning": 15,
            "RAG": 10,
            "LLM": 10,
        },
        "secondary": {
            "FastAPI": 5,
            "Vector Database": 5,
            "LangChain": 5,
            "Docker": 5,
        },
    },

    "devops engineer": {
        "core": {
            "Docker": 15,
            "Kubernetes": 15,
            "AWS": 10,
            "Linux": 10,
        },
        "secondary": {
            "Terraform": 5,
            "CI/CD": 5,
            "Jenkins": 5,
            "Monitoring": 5,
        },
    },

    "data engineer": {
        "core": {
            "Python": 10,
            "SQL": 15,
            "ETL": 10,
            "Data Pipeline": 15,
        },
        "secondary": {
            "Spark": 5,
            "Kafka": 5,
            "AWS": 5,
            "Airflow": 5,
        },
    },

    "java developer": {
        "core": {
            "Java": 20,
            "Spring Boot": 15,
            "SQL": 10,
            "Git": 5,
        },
        "secondary": {
            "Docker": 5,
            "Microservices": 5,
            "Kafka": 5,
            "AWS": 5,
        },
    },

    "python developer": {
        "core": {
            "Python": 20,
            "FastAPI": 10,
            "Django": 10,
            "SQL": 10,
        },
        "secondary": {
            "Docker": 5,
            "AWS": 5,
            "Redis": 5,
            "Celery": 5,
        },
    },
}


def skill_exists(skill, resume_skills_lower):
    skill_lower = skill.lower()

    if skill_lower in resume_skills_lower:
        return True

    aliases = SKILL_ALIASES.get(skill_lower, [])

    for alias in aliases:
        if alias.lower() in resume_skills_lower:
            return True

    return False


def calculate_experience_score(text_lower):
    keywords = [
        "internship",
        "experience",
        "developer",
        "engineer",
        "implemented",
        "developed",
        "designed",
        "built",
    ]

    count = sum(
        1 for keyword in keywords
        if keyword in text_lower
    )

    return min(count * 2, 15)


def calculate_project_score(text_lower):
    keywords = [
        "project",
        "github",
        "api",
        "application",
        "system",
        "platform",
        "deployed",
        "production",
    ]

    count = sum(
        1 for keyword in keywords
        if keyword in text_lower
    )

    return min(count, 10)


def calculate_industry_score(text_lower):
    keywords = [
        "git",
        "docker",
        "agile",
        "testing",
        "rest api",
        "microservices",
    ]

    count = sum(
        1 for keyword in keywords
        if keyword in text_lower
    )

    return min(count, 5)


def calculate_role_readiness(
    resume_text: str,
    role: str,
):
    role = role.lower().strip()

    if role not in ROLE_REQUIREMENTS:
        return {
            "error": f"Unsupported role: {role}",
            "supported_roles": list(
                ROLE_REQUIREMENTS.keys()
            ),
        }

    resume_skills = extract_skills(resume_text)

    resume_skills_lower = {
        skill.lower()
        for skill in resume_skills
    }

    role_data = ROLE_REQUIREMENTS[role]

    score = 0

    matching_skills = []
    missing_skills = []

    # Core Skills (50)
    for skill, weight in role_data["core"].items():

        if skill_exists(
            skill,
            resume_skills_lower
        ):
            score += weight
            matching_skills.append(skill)

        else:
            missing_skills.append(skill)

    # Secondary Skills (20)
    for skill, weight in role_data["secondary"].items():

        if skill_exists(
            skill,
            resume_skills_lower
        ):
            score += weight
            matching_skills.append(skill)

        else:
            missing_skills.append(skill)

    text_lower = resume_text.lower()

    # Experience Signals (15)
    score += calculate_experience_score(
        text_lower
    )

    # Project Quality (10)
    score += calculate_project_score(
        text_lower
    )

    # Industry Readiness (5)
    score += calculate_industry_score(
        text_lower
    )

    readiness_score = min(
        round(score),
        100
    )

    if readiness_score >= 85:
        readiness_level = "Job Ready"

    elif readiness_score >= 70:
        readiness_level = "Almost Ready"

    elif readiness_score >= 50:
        readiness_level = "Needs Improvement"

    else:
        readiness_level = "Beginner"

    roadmap = [
        f"Learn {skill}"
        for skill in missing_skills[:8]
    ]

    strengths = [
        f"Strong knowledge of {skill}"
        for skill in matching_skills[:8]
    ]

    return {
        "role": role.title(),
        "readiness_score": readiness_score,
        "readiness_level": readiness_level,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "strengths": strengths,
        "roadmap": roadmap,
    }