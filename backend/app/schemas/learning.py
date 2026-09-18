"""
Sakhi Learning Modules & Lessons Schemas.

Pydantic v2 schemas for educational modules, audio scripts, quizzes, and user completion tracking.
"""

import datetime as dt
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.knowledge import LocalizedText


class QuizQuestion(BaseModel):
    """Interactive comprehension question at end of lesson."""
    question: LocalizedText
    options: List[LocalizedText]
    correct_option_index: int = Field(..., ge=0, le=4)
    explanation: LocalizedText


class LessonResponse(BaseModel):
    """Structured educational micro-lesson."""
    lesson_id: str
    title: LocalizedText
    duration_minutes: int
    audio_narration_script: LocalizedText
    key_takeaways: List[LocalizedText]
    quiz: Optional[QuizQuestion] = None


class ModuleResponse(BaseModel):
    """Educational learning module containing micro-lessons."""
    module_id: str
    category: str
    title: LocalizedText
    description: LocalizedText
    icon: str
    total_lessons: int
    lessons: List[LessonResponse] = Field(default_factory=list)


class LessonCompleteRequest(BaseModel):
    """Payload to mark a lesson completed."""
    quiz_score: Optional[int] = Field(default=None, ge=0, le=100, description="Optional quiz score percentage")


class UserLessonProgressResponse(BaseModel):
    """User completion status for a lesson."""
    id: int
    user_id: int
    module_id: str
    lesson_id: str
    is_completed: bool
    quiz_score: Optional[int]
    created_at: dt.datetime
    updated_at: dt.datetime

    model_config = ConfigDict(from_attributes=True)


class UserLearningSummaryResponse(BaseModel):
    """Overall learning progress overview for a user."""
    user_id: int
    total_available_lessons: int
    completed_lessons_count: int
    overall_progress_percentage: float
    completed_lesson_ids: List[str]
