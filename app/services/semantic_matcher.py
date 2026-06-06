from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load model once at startup
model = SentenceTransformer("all-MiniLM-L6-v2")


def calculate_semantic_similarity(resume_text: str, job_description: str):
    """
    Returns semantic similarity score between resume and job description.
    """

    resume_embedding = model.encode([resume_text])
    jd_embedding = model.encode([job_description])

    similarity = cosine_similarity(
        resume_embedding,
        jd_embedding
    )[0][0]

    return round(float(similarity) * 100, 2)

def get_match_level(score):
    if score >= 80:
        return "Excellent Match"
    elif score >= 65:
        return "Good Match"
    elif score >= 50:
        return "Average Match"
    return "Low Match"