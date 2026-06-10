from app.db.chroma_manager import ChromaManager

class RAGRetriever:
    
    def __init__(self):
        self.chroma = ChromaManager()
    
    async def retrieve_resume_context(
        self,
        query: str,
        session_id: str,
        n_results: int = 5
    ) -> list[str]:
        """Retrieve relevant resume chunks for chat Q&A"""
        results = self.chroma.query(
            collection="resumes",
            query_text=query,
            n_results=n_results,
            where={"session_id": session_id}
        )
        return self._extract_documents(results)
    
    async def retrieve_career_knowledge(
        self,
        query: str,
        topic_filter: str = None,
        n_results: int = 5
    ) -> list[str]:
        """Retrieve career advice knowledge for Career Coach"""
        where = {}
        if topic_filter:
            where["topic"] = topic_filter
        
        results = self.chroma.query(
            collection="career_knowledge",
            query_text=query,
            n_results=n_results,
            where=where if where else None
        )
        return self._extract_documents(results)
    
    async def retrieve_multi_source(
        self,
        query: str,
        session_id: str,
        sources: list[str] = None
    ) -> dict[str, list[str]]:
        """Retrieve from multiple collections for Career Coach synthesis"""
        if sources is None:
            sources = ["resumes", "github_projects", "linkedin_profiles", "career_knowledge"]
        
        context = {}
        for source in sources:
            where = {"session_id": session_id} if source != "career_knowledge" else None
            results = self.chroma.query(
                collection=source,
                query_text=query,
                n_results=3,
                where=where
            )
            context[source] = self._extract_documents(results, threshold=0.8 if source == "career_knowledge" else 0.7)
        
        return context
    
    def _extract_documents(self, results: dict, threshold: float = 0.8) -> list[str]:
        """Extract document texts, filter by distance threshold"""
        docs = results.get("documents", [[]])[0]
        distances = results.get("distances", [[]])[0]
        
        return [
            doc for doc, dist in zip(docs, distances)
            if dist < threshold
        ]

def rerank_chunks(
    query: str,
    chunks: list[str],
    max_chunks: int = 3
) -> list[str]:
    """Simple re-ranking by keyword overlap."""
    query_words = set(query.lower().split())
    
    scored = []
    for chunk in chunks:
        chunk_words = set(chunk.lower().split())
        overlap = len(query_words & chunk_words)
        scored.append((overlap, chunk))
    
    scored.sort(reverse=True, key=lambda x: x[0])
    return [chunk for _, chunk in scored[:max_chunks]]
