import json

with open("app/data/skills.json", "r") as f:
    SKILLS_DB = json.load(f)


def extract_skills(text: str):

    found_skills = []

    text_lower = text.lower()

    for skill in SKILLS_DB:

        if skill.lower() in text_lower:
            found_skills.append(skill)

    return sorted(found_skills)