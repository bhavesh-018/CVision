import re


SECTION_PATTERNS = {
    "summary": [
        r"\bsummary\b",
        r"\bobjective\b",
        r"\bprofile\b"
    ],
    "education": [
        r"\beducation\b",
        r"\bacademic\b"
    ],
    "experience": [
        r"\bexperience\b",
        r"\bwork experience\b",
        r"\bemployment\b"
    ],
    "projects": [
        r"\bprojects\b",
        r"\bpersonal projects\b"
    ],
    "skills": [
        r"\bskills\b",
        r"\btechnical skills\b"
    ],
    "certifications": [
        r"\bcertifications\b",
        r"\bcertificates\b"
    ]
}


def analyze_sections(text: str):

    text = text.lower()

    sections = {}

    for section, patterns in SECTION_PATTERNS.items():

        found = any(
            re.search(pattern, text)
            for pattern in patterns
        )

        sections[section] = found

    missing_sections = [
        section
        for section, exists in sections.items()
        if not exists
    ]

    return {
        "sections": sections,
        "missing_sections": missing_sections
    }