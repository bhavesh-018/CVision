import os
import json
import google.generativeai as genai

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def review_resume(resume_text: str):

    prompt = f"""
Analyze this resume and return ONLY valid JSON.

Format:

{{
    "strengths": [],
    "weaknesses": [],
    "ats_improvements": [],
    "overall_feedback": ""
}}

Resume:
{resume_text}

Return only JSON.
"""

    try:

        response = model.generate_content(prompt)

        content = response.text.strip()

        if content.startswith("```json"):
            content = content.replace("```json", "")
            content = content.replace("```", "")
            content = content.strip()

        return json.loads(content)

    except Exception as e:

        return {
            "error": str(e)
        }