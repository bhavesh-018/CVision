from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.rag.pipeline import RAGPipeline
from app.db.sqlite_manager import SQLiteManager
from app.rag.ingestion.resume_ingester import ingest_resume
from app.services.parser import extract_resume_text
from app.services.skills import extract_skills
from app.services.ats import calculate_ats_score

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    session_id: str
    message: str
    conversation_history: list[dict] = []

class ChatResponse(BaseModel):
    response: str
    session_id: str
    message_count: int
    sources_used: list[str] = []

@router.post("/resume", response_model=ChatResponse)
async def resume_chat(request: ChatRequest):
    try:
        pipeline = RAGPipeline()
        
        # Get RAG response
        response = await pipeline.answer_resume_question(
            question=request.message,
            session_id=request.session_id,
            conversation_history=request.conversation_history
        )
        
        # Save to SQLite
        db = SQLiteManager()
        db.save_message(
            session_id=request.session_id,
            role="user",
            content=request.message
        )
        db.save_message(
            session_id=request.session_id,
            role="assistant",
            content=response
        )
        
        message_count = db.get_message_count(request.session_id)
        
        return ChatResponse(
            response=response,
            session_id=request.session_id,
            message_count=message_count,
            sources_used=["resumes"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/resume/stream")
async def resume_chat_stream(request: ChatRequest):
    # Save user message immediately
    db = SQLiteManager()
    db.save_message(
        session_id=request.session_id,
        role="user",
        content=request.message
    )
    
    pipeline = RAGPipeline()
    
    async def event_generator():
        full_response = ""
        try:
            async for chunk in pipeline.answer_resume_question_stream(
                question=request.message,
                session_id=request.session_id,
                conversation_history=request.conversation_history
            ):
                full_response += chunk
                yield chunk
        finally:
            # Save assistant message at the end
            db.save_message(
                session_id=request.session_id,
                role="assistant",
                content=full_response
            )
            
    return StreamingResponse(event_generator(), media_type="text/plain")

@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    db = SQLiteManager()
    messages = db.get_messages(session_id)
    return {"session_id": session_id, "messages": messages}

@router.delete("/history/{session_id}")
async def clear_chat_history(session_id: str):
    db = SQLiteManager()
    db.clear_messages(session_id)
    return {"cleared": True}
