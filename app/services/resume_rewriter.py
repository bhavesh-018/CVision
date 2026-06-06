import os
import json
import google.generativeai as genai

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def rewrite_resume(resume_text: str):
    """
    Analyzes a resume and rewrites weak bullet points
    into stronger ATS-friendly achievement-oriented bullets.
    """

    prompt = f"""
You are an expert resume writer and ATS specialist.

Analyze the resume below.

Identify weak, generic, or less impactful bullet points.

Rewrite them into stronger, achievement-oriented,
ATS-friendly bullet points.

Rules:
- Rewrite only if the bullet can be improved.
- Focus on impact, outcomes, scale, optimization, performance, reliability, or business value.
- Do NOT simply replace words with synonyms.
- Do NOT use buzzwords like "architected", "leveraged", "utilized" unless truly appropriate.
- Preserve technical accuracy.
- Highlight measurable achievements when present.
- Return the strongest resume version of each bullet.

Return ONLY valid JSON.

Format:

{{
    "improved_bullets": [
        {{
            "section": "Projects",
            "original": "",
            "improved": ""
        }}
    ]
}}

Resume:

{resume_text}
"""

    try:

        response = model.generate_content(prompt)

        content = response.text.strip()

        if content.startswith("```json"):
            content = (
                content
                .replace("```json", "")
                .replace("```", "")
                .strip()
            )

        return json.loads(content)

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }