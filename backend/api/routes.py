from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.database.connection import get_db
from backend.database.models import SessionModel, SessionEntryModel, StoryModel
from backend.schemas.schemas import (
    HealthResponse,
    AiStatusResponse,
    SessionCreateRequest,
    SessionResponse,
    SessionDetailResponse,
    SessionListItemResponse,
    CommentRequest,
    CommentResponse,
    StoryGenerateRequest,
    StoryResponse,
    MessageResponse
)
from backend.services.ai_service import ai_service, AiUnavailableException

router = APIRouter(prefix="/api")

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="ok",
        service="echoes-backend",
        timestamp=datetime.now(timezone.utc)
    )

@router.get("/ai/status", response_model=AiStatusResponse)
async def ai_status():
    """Reports status of local Ollama connection, configured model, and mock status."""
    status_dict = await ai_service.check_status()
    return AiStatusResponse(**status_dict)

@router.post("/sessions", response_model=SessionDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_session(req: SessionCreateRequest, db: Session = Depends(get_db)):
    """Create a new simulated terminal session."""
    session_obj = SessionModel(
        title=req.title or "Eerie Session",
        atmosphere=req.atmosphere or "creepy",
        narrative_notes=""
    )
    db.add(session_obj)
    db.commit()
    db.refresh(session_obj)
    return session_obj

@router.get("/sessions", response_model=List[SessionListItemResponse])
async def list_sessions(db: Session = Depends(get_db)):
    """List all saved sessions with summary statistics."""
    sessions = db.query(SessionModel).order_by(desc(SessionModel.updated_at)).all()
    results = []
    for s in sessions:
        cmd_count = len(s.entries)
        latest_story = s.stories[0].title if s.stories else None
        results.append(
            SessionListItemResponse(
                id=s.id,
                title=s.title,
                atmosphere=s.atmosphere,
                created_at=s.created_at,
                updated_at=s.updated_at,
                command_count=cmd_count,
                has_story=len(s.stories) > 0,
                latest_story_title=latest_story
            )
        )
    return results

@router.get("/sessions/{session_id}", response_model=SessionDetailResponse)
async def get_session(session_id: str, db: Session = Depends(get_db)):
    """Retrieve full transcript and stories for a session."""
    session_obj = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found."
        )
    return session_obj

@router.delete("/sessions/{session_id}", response_model=MessageResponse)
async def delete_session(session_id: str, db: Session = Depends(get_db)):
    """Delete a specific session and all its associated entries and stories."""
    session_obj = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found."
        )
    db.delete(session_obj)
    db.commit()
    return MessageResponse(
        status="success",
        message=f"Session '{session_id}' deleted successfully."
    )

@router.delete("/sessions/{session_id}/history", response_model=MessageResponse)
async def clear_session_history(session_id: str, db: Session = Depends(get_db)):
    """Clear all command transcript entries and generated stories for a specific session."""
    session_obj = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found."
        )
    db.query(SessionEntryModel).filter(SessionEntryModel.session_id == session_id).delete()
    db.query(StoryModel).filter(StoryModel.session_id == session_id).delete()
    session_obj.narrative_notes = ""
    session_obj.updated_at = datetime.now(timezone.utc)
    db.commit()
    return MessageResponse(
        status="success",
        message=f"Transcript and stories cleared for session '{session_id}'."
    )

@router.delete("/history", response_model=MessageResponse)
async def clear_all_history(db: Session = Depends(get_db)):
    """Clear entire application session history (all sessions)."""
    db.query(SessionEntryModel).delete()
    db.query(StoryModel).delete()
    db.query(SessionModel).delete()
    db.commit()
    return MessageResponse(
        status="success",
        message="All local session history has been purged."
    )

@router.post("/sessions/{session_id}/comment", response_model=CommentResponse)
async def submit_comment(
    session_id: str,
    req: CommentRequest,
    db: Session = Depends(get_db)
):
    """
    Submit a plain text shell command string to the simulated terminal.
    NOTE: Commands are NEVER executed. They are treated solely as text for fictional commentary.
    """
    session_obj = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found."
        )

    atmosphere = req.atmosphere or session_obj.atmosphere

    # Build bounded recent history for context
    recent_entries = (
        db.query(SessionEntryModel)
        .filter(SessionEntryModel.session_id == session_id)
        .order_by(desc(SessionEntryModel.created_at))
        .limit(3)
        .all()
    )
    context_list = [{"command": e.command_text, "commentary": e.commentary} for e in reversed(recent_entries)]

    try:
        commentary, is_mock = await ai_service.generate_commentary(
            command_text=req.command,
            atmosphere=atmosphere,
            recent_history=context_list
        )
    except AiUnavailableException as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate commentary. The spectral channel was disrupted."
        )

    # Persist entry
    entry = SessionEntryModel(
        session_id=session_id,
        command_text=req.command,
        commentary=commentary,
        atmosphere=atmosphere,
        is_mock=is_mock
    )
    db.add(entry)
    session_obj.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(entry)

    return CommentResponse(
        entry_id=entry.id,
        session_id=session_id,
        command=entry.command_text,
        commentary=entry.commentary,
        atmosphere=entry.atmosphere,
        is_mock=entry.is_mock,
        created_at=entry.created_at
    )

@router.post("/sessions/{session_id}/story", response_model=StoryResponse)
async def generate_session_story(
    session_id: str,
    req: StoryGenerateRequest,
    db: Session = Depends(get_db)
):
    """
    Generate an eerie horror story inspired by the session's submitted commands or custom theme.
    """
    session_obj = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found."
        )

    atmosphere = req.atmosphere or session_obj.atmosphere
    session_commands = [e.command_text for e in session_obj.entries]

    try:
        title, narrative, is_mock = await ai_service.generate_story(
            length=req.length,
            atmosphere=atmosphere,
            inspiration_type=req.inspiration_type,
            custom_theme=req.custom_theme,
            ending_style=req.ending_style,
            session_commands=session_commands
        )
    except AiUnavailableException as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate story. The narrative thread was severed."
        )

    story = StoryModel(
        session_id=session_id,
        title=title,
        narrative=narrative,
        length=req.length,
        atmosphere=atmosphere,
        inspiration_type=req.inspiration_type,
        inspiration_prompt=req.custom_theme,
        ending_style=req.ending_style,
        is_mock=is_mock
    )
    db.add(story)
    session_obj.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(story)

    return story
