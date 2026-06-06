from app.services.skills import extract_skills

CRITICAL_SKILLS = {
    "aws",
    "docker",
    "kubernetes",
    "redis",
    "postgresql",
    "system design",
    "microservices",
    "terraform",
    "ci/cd"
}

def match_job_description(
    resume_text: str,
    job_description: str
):

    resume_skills = extract_skills(resume_text)

    jd_skills = extract_skills(job_description)

    matching_skills = sorted(
        list(
            set(resume_skills)
            &
            set(jd_skills)
        )
    )

    missing_skills = sorted(
        list(
            set(jd_skills)
            -
            set(resume_skills)
        )
    )

    critical_missing_skills = [
        skill
        for skill in missing_skills
        if skill.lower() in CRITICAL_SKILLS
    ]

    if len(jd_skills) == 0:
        match_score = 0
    else:
        match_score = round(
            (len(matching_skills) / len(jd_skills))
            * 100
        )

    recommendations = []

    if critical_missing_skills:

        recommendations.append(
            "Focus on learning these high-impact skills: "
            + ", ".join(critical_missing_skills)
        )

    elif missing_skills:

        recommendations.append(
            "Consider gaining experience with: "
            + ", ".join(missing_skills)
        )

    if match_score >= 80:
        recommendations.append(
            "Strong match for this role"
        )

    elif match_score >= 60:
        recommendations.append(
            "Good match, but some skills are missing"
        )

    else:
        recommendations.append(
            "Significant skill gaps detected"
        )

    return {
        "match_score": match_score,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "critical_missing_skills": critical_missing_skills,
        "recommendations": recommendations
    }