from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator, ConfigDict

class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "echoes-backend"
    timestamp: datetime

class AiStatusResponse(BaseModel):
    connected: bool
    model: str
    mock_mode: bool
    message: str
    available_models: List[str] = []

class SessionCreateRequest(BaseModel):
    title: Optional[str] = Field(default="Eerie Session", max_length=200)
    atmosphere: Optional[str] = Field(default="creepy")

    @field_validator("atmosphere")
    @classmethod
    def validate_atmosphere(cls, v: Optional[str]) -> str:
        valid = {"subtle", "creepy", "gothic", "full_horror"}
        if v and v.lower() in valid:
            return v.lower()
        return "creepy"

class SessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    atmosphere: str
    narrative_notes: Optional[str] = ""
    created_at: datetime
    updated_at: datetime

class SessionEntryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    session_id: str
    command_text: str
    commentary: str
    atmosphere: str
    is_mock: bool
    created_at: datetime

class StoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    session_id: Optional[str] = None
    title: str
    narrative: str
    length: str
    atmosphere: str
    inspiration_type: str
    inspiration_prompt: Optional[str] = None
    ending_style: str
    is_mock: bool
    created_at: datetime

class SessionListItemResponse(BaseModel):
    id: str
    title: str
    atmosphere: str
    created_at: datetime
    updated_at: datetime
    command_count: int
    has_story: bool
    latest_story_title: Optional[str] = None

class SessionDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    atmosphere: str
    narrative_notes: Optional[str] = ""
    created_at: datetime
    updated_at: datetime
    entries: List[SessionEntryResponse] = []
    stories: List[StoryResponse] = []

class CommentRequest(BaseModel):
    command: str = Field(..., min_length=1, max_length=500, description="Shell command string text to interpret")
    atmosphere: Optional[str] = Field(default=None)

    @field_validator("command")
    @classmethod
    def validate_command_not_empty(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Command cannot be empty or whitespace only.")
        return trimmed

class CommentResponse(BaseModel):
    entry_id: str
    session_id: str
    command: str
    commentary: str
    atmosphere: str
    is_mock: bool
    created_at: datetime

class StoryGenerateRequest(BaseModel):
    length: str = Field(default="medium")
    atmosphere: Optional[str] = Field(default="creepy")
    inspiration_type: str = Field(default="session", description="'session' or 'custom'")
    custom_theme: Optional[str] = Field(default=None, max_length=500)
    ending_style: str = Field(default="ambiguous")

    @field_validator("length")
    @classmethod
    def validate_length(cls, v: str) -> str:
        if v.lower() in {"short", "medium", "long"}:
            return v.lower()
        return "medium"

    @field_validator("inspiration_type")
    @classmethod
    def validate_inspiration(cls, v: str) -> str:
        if v.lower() in {"session", "custom"}:
            return v.lower()
        return "session"

    @field_validator("ending_style")
    @classmethod
    def validate_ending(cls, v: str) -> str:
        if v.lower() in {"ambiguous", "bittersweet", "twist", "hopeful"}:
            return v.lower()
        return "ambiguous"

class MessageResponse(BaseModel):
    status: str
    message: str
