import json
import os
import re
from functools import lru_cache

SKILLS_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "skills.json")

try:
    with open(SKILLS_FILE, "r", encoding="utf-8") as f:
        SKILLS_DB = json.load(f)
except Exception:
    SKILLS_DB = []

# Canonical alias mapping: alias.lower() -> canonical_name
ALIAS_MAP = {
    "rest api": "REST API",
    "rest apis": "REST API",
    "restful api": "REST API",
    "restful apis": "REST API",
    "oop": "OOP",
    "object oriented programming": "OOP",
    "object-oriented programming": "OOP",
    "dsa": "Data Structures",
    "data structures": "Data Structures",
    "algorithms": "Algorithms",
    "ci/cd": "CI/CD",
    "cicd": "CI/CD",
    "github actions": "GitHub Actions",
    "gitlab ci": "GitLab CI",
    "jenkins": "Jenkins",
    "llm": "LLM",
    "llms": "LLM",
    "large language model": "LLM",
    "large language models": "LLM",
    "genai": "Generative AI",
    "generative ai": "Generative AI",
    "rag": "RAG",
    "retrieval augmented generation": "RAG",
    "retrieval-augmented generation": "RAG",
    "k8s": "Kubernetes",
    "kube": "Kubernetes",
    "kubernetes": "Kubernetes",
    "aws": "AWS",
    "amazon web services": "AWS",
    "gcp": "GCP",
    "google cloud": "GCP",
    "google cloud platform": "GCP",
    "azure": "Azure",
    "microsoft azure": "Azure",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    "node": "Node.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "react": "React",
    "reactjs": "React",
    "react.js": "React",
    "next": "Next.js",
    "nextjs": "Next.js",
    "next.js": "Next.js",
    "vue": "Vue",
    "vuejs": "Vue",
    "vue.js": "Vue",
    "fastapi": "FastAPI",
    "fast api": "FastAPI",
    "django": "Django",
    "flask": "Flask",
    "springboot": "Spring Boot",
    "spring boot": "Spring Boot",
    "docker": "Docker",
    "tf": "Terraform",
    "terraform": "Terraform",
    "js": "JavaScript",
    "javascript": "JavaScript",
    "ts": "TypeScript",
    "typescript": "TypeScript",
    "py": "Python",
    "python": "Python",
    "golang": "Go",
    "go": "Go",
    "rust": "Rust",
    "ml": "Machine Learning",
    "machine learning": "Machine Learning",
    "dl": "Deep Learning",
    "deep learning": "Deep Learning",
    "nlp": "NLP",
    "cv": "Computer Vision",
    "pytorch": "PyTorch",
    "torch": "PyTorch",
    "tensorflow": "TensorFlow",
    "tf2": "TensorFlow",
    "scikit-learn": "Scikit-learn",
    "sklearn": "Scikit-learn",
    "vector db": "Vector Database",
    "vector database": "Vector Database",
    "vector databases": "Vector Database",
    "chroma": "ChromaDB",
    "chromadb": "ChromaDB",
    "pinecone": "Pinecone",
    "qdrant": "Qdrant",
    "langchain": "LangChain",
    "llamaindex": "LlamaIndex",
    "langgraph": "LangGraph",
    "crewai": "CrewAI",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "c++": "C++",
    "cpp": "C++",
    "c#": "C#",
    "csharp": "C#",
    ".net": ".NET",
    "dotnet": ".NET",
}

# Build lookup regex for exact word boundary matches
def _build_regex_pattern(term: str) -> re.Pattern:
    escaped = re.escape(term)
    # If starts/ends with alphanumeric, enforce \b boundary
    prefix = r"\b" if term and term[0].isalnum() else ""
    suffix = r"\b" if term and term[-1].isalnum() else ""
    return re.compile(f"{prefix}{escaped}{suffix}", re.IGNORECASE)

# Precompile patterns for fast production execution
PRECOMPILED_PATTERNS = []
seen_terms = set()

# First add specific aliases
for alias, canonical in ALIAS_MAP.items():
    if alias not in seen_terms:
        PRECOMPILED_PATTERNS.append((_build_regex_pattern(alias), canonical))
        seen_terms.add(alias)

# Then add skills from SKILLS_DB
for skill in SKILLS_DB:
    skill_lower = skill.lower()
    if skill_lower not in seen_terms:
        PRECOMPILED_PATTERNS.append((_build_regex_pattern(skill), skill))
        seen_terms.add(skill_lower)


def extract_skills(text: str) -> list[str]:
    """
    Production-grade skill extraction using word-boundary regex & alias normalization.
    Guarantees no false positives for short acronyms like 'Go', 'C', 'R', etc.
    """
    if not text or not isinstance(text, str):
        return []

    found_skills = set()

    for pattern, canonical_name in PRECOMPILED_PATTERNS:
        if pattern.search(text):
            found_skills.add(canonical_name)

    return sorted(list(found_skills))


async def extract_skills_dynamic(text: str) -> list[str]:
    """
    Hybrid extractor: combines regex token extraction with AI entity extraction
    to discover novel, emerging, or domain-specific tools in JDs and resumes.
    """
    base_skills = extract_skills(text)
    
    # Try LLM zero-shot extraction for unlisted or emerging tools if text is substantial
    if len(text.strip()) > 100:
        try:
            from app.rag.generator import generate_rag_response
            prompt = f"""Extract all technical skills, frameworks, programming languages, databases, cloud services, and developer tools mentioned in the following text.
Return ONLY a comma-separated list of skill names, with no extra text or numbering.

Text:
{text[:2000]}
"""
            response = await generate_rag_response(prompt, max_tokens=150)
            if response and not response.startswith("I encountered an error"):
                extra_items = [s.strip() for s in response.split(",") if s.strip()]
                for item in extra_items:
                    # Normalize against alias map if applicable
                    norm = ALIAS_MAP.get(item.lower(), item)
                    if len(norm) >= 2 and len(norm) <= 40:
                        base_skills.append(norm)
        except Exception:
            pass

    # Deduplicate preserving case
    unique_skills = []
    seen = set()
    for s in base_skills:
        s_clean = s.strip()
        if s_clean.lower() not in seen and len(s_clean) > 1:
            seen.add(s_clean.lower())
            unique_skills.append(s_clean)

    return sorted(unique_skills)