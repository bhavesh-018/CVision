from app.rag.retriever import RAGRetriever, rerank_chunks
from app.rag.context_assembler import ContextAssembler
from app.rag.prompt_builder import build_resume_chat_prompt, build_career_coach_prompt
from app.rag.generator import generate_rag_response, generate_rag_response_stream

class RAGPipeline:
    
    def __init__(self):
        self.retriever = RAGRetriever()
        self.assembler = ContextAssembler()
    
    async def answer_resume_question(
        self,
        question: str,
        session_id: str,
        conversation_history: list[dict]
    ) -> str:
        """Full RAG pipeline for Resume Chat"""
        
        # 1. Retrieve
        chunks = await self.retriever.retrieve_resume_context(
            query=question,
            session_id=session_id,
            n_results=5
        )
        
        # 2. Re-rank
        chunks = rerank_chunks(question, chunks, max_chunks=3)
        
        # 3. Assemble context
        context = self.assembler.assemble_resume_chat_context(
            resume_chunks=chunks,
            user_message=question,
            conversation_history=conversation_history
        )
        
        # 4. Build prompt
        prompt = build_resume_chat_prompt(context, question)
        
        # 5. Generate
        response = await generate_rag_response(prompt)
        
        return response

    async def answer_resume_question_stream(
        self,
        question: str,
        session_id: str,
        conversation_history: list[dict]
    ):
        """Full RAG pipeline for Resume Chat with Streaming"""
        
        chunks = await self.retriever.retrieve_resume_context(
            query=question,
            session_id=session_id,
            n_results=5
        )
        
        chunks = rerank_chunks(question, chunks, max_chunks=3)
        
        context = self.assembler.assemble_resume_chat_context(
            resume_chunks=chunks,
            user_message=question,
            conversation_history=conversation_history
        )
        
        prompt = build_resume_chat_prompt(context, question)
        
        async for chunk in generate_rag_response_stream(prompt):
            yield chunk
    
    async def career_coaching_response(
        self,
        message: str,
        session_id: str,
        career_goals: str,
        conversation_history: list[dict]
    ) -> dict:
        """Full RAG pipeline for Career Coach"""
        
        # 1. Retrieve from all sources
        multi_context = await self.retriever.retrieve_multi_source(
            query=message,
            session_id=session_id,
            sources=["resumes", "github_projects", "linkedin_profiles", "career_knowledge"]
        )
        
        # 2. Assemble
        context = self.assembler.assemble_career_coach_context(
            multi_source_context=multi_context,
            career_goals=career_goals,
            conversation_history=conversation_history
        )
        
        # 3. Build prompt
        prompt = build_career_coach_prompt(context, message)
        
        # 4. Generate
        response = await generate_rag_response(prompt, temperature=0.8)
        
        return {"response": response, "sources_used": list(multi_context.keys())}
