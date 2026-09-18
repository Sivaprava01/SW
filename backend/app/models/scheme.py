"""
Sakhi Government Schemes & User Scheme Bookmarks Database Models.

Represents verified Central and State welfare schemes, eligibility rules,
document checklists, and user application tracking.
"""

from typing import List, Optional
from sqlalchemy import String, Integer, Float, Boolean, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class GovernmentScheme(Base, TimestampMixin):
    """Government and SHG welfare scheme database model."""
    __tablename__ = "government_schemes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    short_name: Mapped[str] = mapped_column(String(50), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    jurisdiction: Mapped[str] = mapped_column(String(100), nullable=False, default="Central", index=True)
    
    # Core Benefit Metrics
    benefit_amount_display: Mapped[str] = mapped_column(String(150), nullable=False)
    cost_or_premium: Mapped[str] = mapped_column(String(150), nullable=False)
    
    # Eligibility Rules
    min_age: Mapped[int] = mapped_column(Integer, nullable=False, default=18)
    max_age: Mapped[int] = mapped_column(Integer, nullable=False, default=70)
    gender_eligibility: Mapped[str] = mapped_column(String(20), nullable=False, default="all")  # female_only, all, male_only
    rural_urban: Mapped[str] = mapped_column(String(20), nullable=False, default="all")  # rural, urban, all
    requires_shg: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    max_annual_income: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    # Plain Language Descriptions & Guidance
    description: Mapped[str] = mapped_column(Text, nullable=False)
    what_it_provides: Mapped[str] = mapped_column(Text, nullable=False)
    target_beneficiaries: Mapped[str] = mapped_column(String(255), nullable=False)
    required_documents_json: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    offline_application_process: Mapped[str] = mapped_column(Text, nullable=False)
    official_portal_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    @property
    def required_documents(self) -> List[str]:
        """Parsed list of required application documents."""
        if self.required_documents_json:
            try:
                import json
                return json.loads(self.required_documents_json)
            except Exception:
                return [self.required_documents_json]
        return []

    def __repr__(self) -> str:
        return f"<GovernmentScheme id={self.id} slug='{self.slug}' name='{self.short_name}'>"



class UserSchemeBookmark(Base, TimestampMixin):
    """User bookmark and application tracking for government schemes."""
    __tablename__ = "user_scheme_bookmarks"
    __table_args__ = (
        UniqueConstraint("user_id", "scheme_id", name="uq_user_scheme_bookmark"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    scheme_id: Mapped[int] = mapped_column(Integer, ForeignKey("government_schemes.id", ondelete="CASCADE"), index=True, nullable=False)
    
    is_bookmarked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    application_status: Mapped[str] = mapped_column(String(50), nullable=False, default="discovered")  # discovered, applied, enrolled, dismissed
    notes: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", backref="scheme_bookmarks")
    scheme: Mapped["GovernmentScheme"] = relationship("GovernmentScheme", backref="user_bookmarks")

    def __repr__(self) -> str:
        return f"<UserSchemeBookmark user_id={self.user_id} scheme_id={self.scheme_id} status='{self.application_status}'>"
