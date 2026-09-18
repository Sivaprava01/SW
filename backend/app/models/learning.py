"""
Sakhi User Learning Progress Database Model.

Tracks lesson completion, quiz attempts, and user educational journey status.
"""

from typing import Optional
from sqlalchemy import String, Integer, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class UserLearningProgress(Base, TimestampMixin):
    """User progress on educational micro-lessons."""
    __tablename__ = "user_learning_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "lesson_id", name="uq_user_lesson_progress"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    module_id: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    lesson_id: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    quiz_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", backref="learning_progress")

    def __repr__(self) -> str:
        return f"<UserLearningProgress user_id={self.user_id} lesson='{self.lesson_id}' completed={self.is_completed}>"
