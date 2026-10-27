from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class SessionModel(Base):
    __tablename__ = "sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(200), nullable=False, default="Eerie Session")
    atmosphere = Column(String(50), nullable=False, default="creepy")
    narrative_notes = Column(Text, nullable=True, default="")
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    entries = relationship("SessionEntryModel", back_populates="session", cascade="all, delete-orphan", order_by="SessionEntryModel.created_at")
    stories = relationship("StoryModel", back_populates="session", cascade="all, delete-orphan", order_by="StoryModel.created_at.desc()")

class SessionEntryModel(Base):
    __tablename__ = "session_entries"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    command_text = Column(String(500), nullable=False)
    commentary = Column(Text, nullable=False)
    atmosphere = Column(String(50), nullable=False, default="creepy")
    is_mock = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=utc_now)

    session = relationship("SessionModel", back_populates="entries")

class StoryModel(Base):
    __tablename__ = "stories"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(250), nullable=False)
    narrative = Column(Text, nullable=False)
    length = Column(String(20), nullable=False, default="medium")
    atmosphere = Column(String(50), nullable=False, default="creepy")
    inspiration_type = Column(String(20), nullable=False, default="session")
    inspiration_prompt = Column(Text, nullable=True)
    ending_style = Column(String(50), nullable=False, default="ambiguous")
    is_mock = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=utc_now)

    session = relationship("SessionModel", back_populates="stories")
