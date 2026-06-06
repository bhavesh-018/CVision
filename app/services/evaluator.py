def evaluate_resume(text, skills):

    strengths = []
    weaknesses = []
    suggestions = []

    # strengths

    if len(skills) >= 8:
        strengths.append(
            "Strong technical skill set"
        )

    if "project" in text.lower():
        strengths.append(
            "Projects section present"
        )

    if "intern" in text.lower():
        strengths.append(
            "Industry experience found"
        )

    # weaknesses

    if "aws" not in text.lower():
        weaknesses.append(
            "Cloud technologies not mentioned"
        )

    if "docker" not in text.lower():
        weaknesses.append(
            "Deployment tools not mentioned"
        )

    # suggestions

    suggestions.append(
        "Add quantified achievements"
    )

    suggestions.append(
        "Include deployment experience"
    )

    return {
        "strengths": strengths,
        "weaknesses": weaknesses,
        "suggestions": suggestions
    }