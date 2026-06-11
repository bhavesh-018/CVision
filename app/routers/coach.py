from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db.sqlite_manager import SQLiteManager
from app.rag.pipeline import RAGPipeline

router = APIRouter(prefix="/coach", tags=["coach"])

class CoachRequest(BaseModel):
    session_id: str
    message: str
    career_goals: str = ""
    target_role: str = ""

class CoachResponse(BaseModel):
    response: str
    session_id: str
    action_items: list[str] = []
    roadmap: dict = {}
    resources: list[dict] = []

class GoalRequest(BaseModel):
    session_id: str
    target_role: str
    career_goals: str
    experience_years: int = 0

@router.post("/chat", response_model=CoachResponse)
async def coach_chat(request: CoachRequest):
    db = SQLiteManager()
    
    # Load conversation history
    history = db.get_messages(request.session_id, limit=8)
    
    # Update career goals if provided
    if request.career_goals or request.target_role:
        db.update_profile(
            session_id=request.session_id,
            career_goals=request.career_goals,
            target_role=request.target_role
        )
    
    # Get user profile
    profile = db.get_profile(request.session_id)
    
    # RAG pipeline
    pipeline = RAGPipeline()
    result = await pipeline.career_coaching_response(
        message=request.message,
        session_id=request.session_id,
        career_goals=profile.get("career_goals", request.career_goals),
        conversation_history=history
    )
    
    # Save messages
    db.save_message(request.session_id, "user", request.message)
    db.save_message(request.session_id, "assistant", result["response"])
    
    return CoachResponse(
        response=result["response"],
        session_id=request.session_id,
    )

@router.post("/set-goals")
async def set_career_goals(request: GoalRequest):
    db = SQLiteManager()
    db.update_profile(
        session_id=request.session_id,
        target_role=request.target_role,
        career_goals=request.career_goals,
        experience_years=request.experience_years
    )
    
    # Get initial coaching response
    pipeline = RAGPipeline()
    initial_message = f"I want to become a {request.target_role}. {request.career_goals}"
    result = await pipeline.career_coaching_response(
        message=initial_message,
        session_id=request.session_id,
        career_goals=request.career_goals,
        conversation_history=[]
    )
    
    # Save initial exchange
    db.save_message(request.session_id, "user", initial_message)
    db.save_message(request.session_id, "assistant", result["response"])
    
    return {
        "session_id": request.session_id,
        "initial_advice": result["response"],
        "target_role": request.target_role
    }

@router.get("/profile/{session_id}")
async def get_profile(session_id: str):
    db = SQLiteManager()
    return db.get_profile(session_id)

@router.get("/history/{session_id}")
async def get_history(session_id: str):
    db = SQLiteManager()
    messages = db.get_messages(session_id, limit=50)
    # the sqlite manager returns reversed, but frontend probably wants chronological or latest at bottom
    # We will return them chronological (oldest first)
    return messages
