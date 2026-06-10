import chromadb
from chromadb.config import Settings
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
import threading


class ChromaManager:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                instance = super().__new__(cls)
                instance._initialized = False
                cls._instance = instance
        return cls._instance

    def initialize(self):
        if self._initialized:
            return
        self.client = chromadb.PersistentClient(
            path="./chroma_db",
            settings=Settings(anonymized_telemetry=False),
        )
        self.embedder = SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        self._ensure_collections()
        self._initialized = True

    def _ensure_collections(self):
        collections = [
            "resumes",
            "github_projects",
            "linkedin_profiles",
            "jobs",
            "career_knowledge",
            "interview_knowledge",
        ]
        for name in collections:
            self.client.get_or_create_collection(
                name=name,
                embedding_function=self.embedder,
                metadata={"hnsw:space": "cosine"},
            )

    def get_collection(self, name: str):
        return self.client.get_collection(
            name=name,
            embedding_function=self.embedder,
        )

    def store(
        self,
        collection: str,
        texts: list,
        metadatas: list,
        ids: list,
    ):
        if not texts:
            return
        col = self.get_collection(collection)
        col.upsert(documents=texts, metadatas=metadatas, ids=ids)

    def query(
        self,
        collection: str,
        query_text: str,
        n_results: int = 5,
        where: dict = None,
    ) -> dict:
        col = self.get_collection(collection)
        # Clamp n_results to actual count
        count = col.count()
        n = min(n_results, count) if count > 0 else 1
        kwargs = {"query_texts": [query_text], "n_results": n}
        if where:
            kwargs["where"] = where
        try:
            return col.query(**kwargs)
        except Exception:
            return {"documents": [[]], "metadatas": [[]], "distances": [[]]}

    def get_by_ids(self, collection: str, ids: list) -> dict:
        col = self.get_collection(collection)
        return col.get(ids=ids)

    def delete(self, collection: str, ids: list):
        col = self.get_collection(collection)
        col.delete(ids=ids)

    def count(self, collection: str) -> int:
        return self.get_collection(collection).count()

    def collection_stats(self) -> dict:
        collections = [
            "resumes",
            "github_projects",
            "linkedin_profiles",
            "jobs",
            "career_knowledge",
            "interview_knowledge",
        ]
        return {c: self.count(c) for c in collections}
