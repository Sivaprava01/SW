"""
Sakhi 7-Stage Financial Journey Schemas.

Pydantic v2 schemas representing the deterministic milestone roadmap.
"""

from typing import List, Literal, Optional
from pydantic import BaseModel, Field
from app.schemas.knowledge import LocalizedText


class JourneyStageResponse(BaseModel):
    """Single stage in the 7-stage financial journey."""
    stage_number: int = Field(..., ge=1, le=7)
    stage_key: str
    title: LocalizedText
    subtitle: LocalizedText
    status: Literal["completed", "in_progress", "locked"]
    progress_percentage: float = Field(..., ge=0.0, le=100.0)
    target_metric_label: str
    target_metric_value: str
    unlocked_badge: Optional[str] = None
    action_cta: LocalizedText


class JourneyRoadmapResponse(BaseModel):
    """Overall 7-stage financial empowerment roadmap evaluated for a user."""
    user_id: int
    current_active_stage: int
    completed_stages_count: int
    total_stages: int = 7
    overall_journey_progress_percentage: float
    next_milestone_action: LocalizedText
    stages: List[JourneyStageResponse]
