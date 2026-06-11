from app.db.chroma_manager import ChromaManager
from app.db.sqlite_manager import SQLiteManager
from datetime import datetime

def split_by_sections(text: str, markers: dict) -> dict:
    """A simple heuristic to split resume text into sections based on headers."""
    sections = {}
    lines = text.split("\n")
    current_section = "summary"
    current_text = []

    for line in lines:
        lower_line = line.strip().lower()
        found_marker = False
        # If line is short, it might be a header
        if len(lower_line) < 40:
            for section, keywords in markers.items():
                if any(lower_line.startswith(kw) or lower_line == kw for kw in keywords):
                    if current_text:
                        sections[current_section] = sections.get(current_section, "") + "\n" + "\n".join(current_text)
                    current_section = section
                    current_text = []
                    found_marker = True
                    break
        
        if not found_marker:
            current_text.append(line)
            
    if current_text:
        sections[current_section] = sections.get(current_section, "") + "\n" + "\n".join(current_text)
        
    return {k: v.strip() for k, v in sections.items() if v.strip()}

def chunk_resume(resume_text: str) -> list[tuple[str, str]]:
    """Returns list of (section_name, chunk_text) tuples"""
    SECTION_MARKERS = {
        "summary": ["summary", "objective", "profile", "about"],
        "skills": ["skills", "technical skills", "technologies"],
        "experience": ["experience", "work experience", "employment"],
        "projects": ["projects", "personal projects", "portfolio"],
        "education": ["education", "academic background"],
        "certifications": ["certifications", "certificates", "awards"]
    }
    
    sections = split_by_sections(resume_text, SECTION_MARKERS)
    chunks = []
    
    for section_name, section_text in sections.items():
        if len(section_text) > 500:
            step = 450
            window = 500
            for start in range(0, len(section_text), step):
                chunk = section_text[start:start + window]
                if len(chunk) > 50:
                    chunks.append((section_name, chunk))
        else:
            if len(section_text) > 30:
                chunks.append((section_name, section_text))
    
    if not chunks:
        for start in range(0, len(resume_text), 450):
            chunks.append(("general", resume_text[start:start + 500]))
    
    return chunks

async def ingest_resume(
    resume_text: str,
    session_id: str,
    filename: str,
    ats_score: int
) -> list[str]:
    chunks = chunk_resume(resume_text)
    
    ids = []
    texts = []
    metadatas = []
    
    for i, (section, text) in enumerate(chunks):
        chunk_id = f"resume_{session_id}_{section}_{i}"
        ids.append(chunk_id)
        texts.append(text)
        metadatas.append({
            "session_id": session_id,
            "filename": filename,
            "section": section,
            "chunk_index": i,
            "ats_score": ats_score,
            "upload_date": datetime.now().isoformat()
        })
    
    if texts:
        ChromaManager().store("resumes", texts, metadatas, ids)
    
    # ✅ Update SQLite profile so Coach sidebar shows real ATS score + resume as Connected
    db = SQLiteManager()
    db.update_profile(
        session_id=session_id,
        ats_score=ats_score
    )
    
    return ids
