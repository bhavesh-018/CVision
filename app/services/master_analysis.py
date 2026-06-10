import os
import json
import google.generativeai as genai

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def master_analysis(
    resume_text: str,
    job_description: str = ""
):

    prompt = f"""
You are an expert recruiter,
ATS specialist,
resume writer,
and technical interviewer.

Analyze the resume.

Return ONLY valid JSON.

{{
  "review": {{
    "strengths": [],
    "weaknesses": [],
    "ats_improvements": [],
    "overall_feedback": ""
  }},

  "interview": {{
    "technical_questions": [],
    "project_questions": [],
    "behavioral_questions": []
  }},

  "rewrite": {{
    "improved_bullets": [
      {{
        "section": "",
        "original": "",
        "improved": ""
      }}
    ]
  }}
}}

Resume:

{resume_text}

Job Description:

{job_description}
"""

    try:

        response = model.generate_content(
            prompt
        )

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