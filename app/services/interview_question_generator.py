import os
import json
import google.generativeai as genai

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_interview_questions(
    resume_text: str,
    job_description: str = ""
):

    prompt = f"""
Generate interview questions based on the resume and job description.

Return ONLY valid JSON.

Format:

{{
  "technical_questions": [],
  "project_questions": [],
  "behavioral_questions": []
}}

Resume:
{resume_text}

Job Description:
{job_description}
"""

    response = model.generate_content(prompt)

    content = response.text.strip()

    if content.startswith("```json"):
        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()

    return json.loads(content)