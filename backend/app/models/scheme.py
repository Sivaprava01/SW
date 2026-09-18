import uuid
from sqlalchemy import Column, String, Text, Integer, Float, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class GovernmentScheme(Base):
    __tablename__ = "government_schemes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    what_it_provides = Column(Text, nullable=False)
    target_users = Column(Text, nullable=False)
    basic_eligibility = Column(Text, nullable=False)
    required_documents = Column(Text, nullable=False)
    application_process = Column(Text, nullable=False)
    official_source = Column(String(500), nullable=False)
    state = Column(String(100), nullable=False, default="Central")
    category = Column(String(100), nullable=False)

    # Matcher fields
    min_age = Column(Integer, nullable=True)
    max_age = Column(Integer, nullable=True)
    gender_target = Column(String(20), default="all")  # "women", "all"
    max_income = Column(Float, nullable=True)
    is_rural_relevant = Column(Boolean, default=True)
    is_shg_related = Column(Boolean, default=False)
    is_business_related = Column(Boolean, default=False)

    user_matches = relationship("UserSchemeMatch", back_populates="scheme", cascade="all, delete-orphan")
