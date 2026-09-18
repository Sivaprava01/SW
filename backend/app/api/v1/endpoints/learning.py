"""
Sakhi Learning API Endpoints.

Provides access to educational modules, micro-lessons with audio scripts,
and records user learning progression and quiz attempts.
"""

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.errors import ResourceNotFoundException
from app.schemas.learning import (
    ModuleResponse,
    LessonResponse,
    LessonCompleteRequest,
    UserLessonProgressResponse,
    UserLearningSummaryResponse,
)
from app.services.user_service import UserService
from app.services.learning_service import LearningService

router = APIRouter(tags=["Financial Learning Journey"])


@router.get(
    "/learning/modules",
    response_model=List[ModuleResponse],
    summary="List Learning Modules",
    description="Retrieve all educational modules and micro-lessons with multilingual audio narration scripts."
)
def list_modules() -> List[ModuleResponse]:
    """List educational modules."""
    return LearningService.list_modules()


@router.get(
    "/learning/modules/{module_id}",
    response_model=ModuleResponse,
    summary="Get Learning Module",
    description="Retrieve a single module by ID."
)
def get_module(module_id: str) -> ModuleResponse:
    """Get module by ID."""
    module = LearningService.get_module_by_id(module_id)
    if not module:
        raise ResourceNotFoundException(message=f"Learning module '{module_id}' not found")
    return module


@router.get(
    "/learning/lessons/{lesson_id}",
    response_model=LessonResponse,
    summary="Get Lesson",
    description="Retrieve a single micro-lesson with audio narration transcript and quiz."
)
def get_lesson(lesson_id: str) -> LessonResponse:
    """Get lesson by ID."""
    lesson = LearningService.get_lesson_by_id(lesson_id)
    if not lesson:
        raise ResourceNotFoundException(message=f"Lesson '{lesson_id}' not found")
    return lesson


@router.post(
    "/users/{user_id}/learning/lessons/{lesson_id}/complete",
    response_model=UserLessonProgressResponse,
    summary="Mark Lesson Complete",
    description="Record completion of a micro-lesson for a user with optional quiz score."
)
def complete_lesson(
    user_id: int,
    lesson_id: str,
    complete_in: LessonCompleteRequest,
    db: Session = Depends(get_db),
) -> UserLessonProgressResponse:
    """Mark a lesson complete for a user."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    
    progress = LearningService.mark_lesson_complete(
        db=db, user_id=user_id, lesson_id=lesson_id, complete_in=complete_in
    )
    if not progress:
        raise ResourceNotFoundException(message=f"Lesson with ID '{lesson_id}' not found")
    return progress


@router.get(
    "/users/{user_id}/learning/progress",
    response_model=UserLearningSummaryResponse,
    summary="Get User Learning Summary",
    description="Retrieve the user's completed lessons count and overall completion percentage."
)
def get_user_learning_progress(
    user_id: int,
    db: Session = Depends(get_db),
) -> UserLearningSummaryResponse:
    """Get learning summary for user."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    return LearningService.get_user_learning_summary(db=db, user_id=user_id)
