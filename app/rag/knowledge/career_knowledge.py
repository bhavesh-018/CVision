from app.db.chroma_manager import ChromaManager

CAREER_KNOWLEDGE = [
    # Role Requirements
    {
        "text": "AI Engineer role: Core skills are Python, Machine Learning, Deep Learning, "
                "LLMs (GPT, Gemini, Claude), RAG systems, Vector Databases (ChromaDB, Pinecone, Weaviate), "
                "Prompt Engineering, FastAPI. Secondary: LangChain, LlamaIndex, Docker, AWS.",
        "metadata": {"topic": "role_requirements", "role": "AI Engineer", "difficulty": "advanced"}
    },
    {
        "text": "AI Engineer salary ranges: Fresher (0-1 yr): $70k-$90k | Mid (2-4 yr): $110k-$150k | "
                "Senior (5+ yr): $160k-$250k. India: Fresher ₹6-12 LPA, Senior ₹25-50 LPA.",
        "metadata": {"topic": "salary", "role": "AI Engineer", "difficulty": "general"}
    },
    {
        "text": "How to become AI Engineer from scratch: 1) Python mastery (3 months) "
                "2) ML fundamentals - Andrew Ng Coursera (2 months) 3) Build RAG project (1 month) "
                "4) LLM fine-tuning project (1 month) 5) Deploy with FastAPI on cloud (2 weeks) "
                "6) Open source contribution (ongoing). Total: 6-9 months.",
        "metadata": {"topic": "career_advice", "role": "AI Engineer", "difficulty": "beginner"}
    },
    
    # Backend Engineer
    {
        "text": "Backend Engineer role: Core skills are Python (FastAPI/Django) or Java (Spring Boot), "
                "SQL databases (PostgreSQL, MySQL), Docker, Git, REST APIs, basic Linux. "
                "Secondary: Redis, Kubernetes, AWS, Message queues (Kafka, RabbitMQ).",
        "metadata": {"topic": "role_requirements", "role": "Backend Engineer", "difficulty": "intermediate"}
    },
    
    # Learning Resources
    {
        "text": "Best AI/ML learning resources: 1) fast.ai - practical deep learning (free) "
                "2) DeepLearning.AI by Andrew Ng (Coursera) 3) Hugging Face NLP course (free) "
                "4) Stanford CS229 (free YouTube) 5) Papers With Code (research) "
                "6) Kaggle competitions (practice) 7) LangChain documentation.",
        "metadata": {"topic": "learning_resources", "role": "AI Engineer", "difficulty": "beginner"}
    },
    
    {
        "text": "Best certifications for software engineers: AWS Solutions Architect, "
        "Google Cloud Professional, Kubernetes CKAD/CKA, TensorFlow Developer, "
        "DeepLearning.AI Deep Learning Specialization, MongoDB Developer, "
        "Docker Certified Associate.",
        "metadata": {"topic": "certifications", "role": "general", "difficulty": "intermediate"}
    },
    
    # Career Advice
    {
        "text": "Portfolio building for AI roles: Build 3 types of projects: "
        "1) RAG chatbot using LLM + vector DB 2) Fine-tuned model for specific domain "
        "3) End-to-end ML pipeline with deployment. Host on GitHub with detailed READMEs. "
        "Write 2-3 blog posts explaining your approach.",
        "metadata": {"topic": "career_advice", "role": "AI Engineer", "difficulty": "beginner"}
    },
    
    {
        "text": "Resume tips for tech roles: Use STAR format for bullets (Situation, Task, Action, Result). "
        "Quantify impact: 'Reduced latency by 40%' not 'improved performance'. "
        "Keep to 1 page for < 3 years experience. Include GitHub link. "
        "ATS-friendly: avoid tables, columns, images. Use standard section headers.",
        "metadata": {"topic": "career_advice", "role": "general", "difficulty": "beginner"}
    },
]

def load_career_knowledge():
    chroma = ChromaManager()
    career_col = chroma.get_collection("career_knowledge")
    if career_col.count() == 0:
        texts = [k["text"] for k in CAREER_KNOWLEDGE]
        metadatas = [k["metadata"] for k in CAREER_KNOWLEDGE]
        ids = [f"knowledge_{i}" for i in range(len(CAREER_KNOWLEDGE))]
        chroma.store("career_knowledge", texts, metadatas, ids)
        print("Loaded Career Knowledge into ChromaDB.")
