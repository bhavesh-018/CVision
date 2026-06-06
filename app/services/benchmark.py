def benchmark_resume(
    ats_score: int,
    skills_count: int,
    sections: dict
):

    category_scores = {
        "skills": 0,
        "projects": 0,
        "experience": 0,
        "education": 0
    }

    # Skills (0-100)

    if skills_count >= 20:
        category_scores["skills"] = 95

    elif skills_count >= 15:
        category_scores["skills"] = 85

    elif skills_count >= 10:
        category_scores["skills"] = 75

    elif skills_count >= 5:
        category_scores["skills"] = 60

    else:
        category_scores["skills"] = 40

    # Projects

    category_scores["projects"] = (
        80 if sections.get("projects")
        else 30
    )

    # Experience

    category_scores["experience"] = (
        85 if sections.get("experience")
        else 30
    )

    # Education

    category_scores["education"] = (
        75 if sections.get("education")
        else 30
    )

    # Weighted percentile

    overall_percentile = round(
        (
            ats_score * 0.35 +
            category_scores["skills"] * 0.30 +
            category_scores["projects"] * 0.15 +
            category_scores["experience"] * 0.15 +
            category_scores["education"] * 0.05
        )
    )

    if overall_percentile >= 85:
        benchmark_level = "Excellent"

    elif overall_percentile >= 70:
        benchmark_level = "Good"

    elif overall_percentile >= 55:
        benchmark_level = "Average"

    else:
        benchmark_level = "Needs Improvement"

    comparison = {}

    for category, score in category_scores.items():

        if score >= 85:
            comparison[category] = "Outstanding"

        elif score >= 70:
            comparison[category] = "Above Average"

        elif score >= 55:
            comparison[category] = "Average"

        else:
            comparison[category] = "Below Average"

    insights = []

    if category_scores["skills"] < 80:
        insights.append(
            "Expand your skill set with cloud and DevOps technologies."
        )

    if category_scores["projects"] < 85:
        insights.append(
            "Add more complex projects with measurable business impact."
        )

    if category_scores["experience"] < 85:
        insights.append(
            "Gain additional internship or production experience."
        )

    if category_scores["education"] < 80:
        insights.append(
            "Include certifications or academic achievements."
        )
    
    return {
        "overall_percentile": overall_percentile,
        "benchmark_level": benchmark_level,
        "category_scores": category_scores,
        "comparison": comparison,
        "insights": insights
    }