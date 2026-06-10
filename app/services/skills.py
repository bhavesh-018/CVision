import json

with open(
    "app/data/skills.json",
    "r"
) as f:
    SKILLS_DB = json.load(f)

ALIASES = {
    "REST API": [
        "rest api",
        "rest apis",
        "restful api",
        "restful apis"
    ],

    "OOP": [
        "oop",
        "object oriented programming",
        "object-oriented programming"
    ],

    "Data Structures": [
        "data structures",
        "dsa"
    ],

    "CI/CD": [
        "ci/cd",
        "github actions",
        "gitlab ci",
        "jenkins"
    ],

    "LLM": [
        "llm",
        "large language model",
        "gpt",
        "gemini"
    ],

    "RAG": [
        "rag",
        "retrieval augmented generation"
    ]
}

def extract_skills(text: str):

    text_lower = text.lower()

    found_skills = set()

    for skill in SKILLS_DB:

        if skill.lower() in text_lower:
            found_skills.add(skill)

        aliases = ALIASES.get(
            skill,
            []
        )

        for alias in aliases:

            if alias.lower() in text_lower:
                found_skills.add(skill)

    return sorted(
        list(found_skills)
    )