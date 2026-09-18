import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Index
from sqlalchemy.orm import relationship
from app.database import Base

class UserSchemeMatch(Base):
    __tablename__ = "user_scheme_matches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    scheme_id = Column(String(36), ForeignKey("government_schemes.id", ondelete="CASCADE"), nullable=False, index=True)
    match_score = Column(Integer, default=100)
    match_reasons = Column(Text, nullable=True)  # Comma separated reasons
    status = Column(String(50), default="matched")  # matched, bookmarked, applied
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="scheme_matches")
    scheme = relationship("GovernmentScheme", back_populates="user_matches")

    __table_args__ = (
        Index("ix_user_scheme_matches_user_scheme", "user_id", "scheme_id"),
    )
