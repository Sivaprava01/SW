import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)

raw_url = settings.DATABASE_URL or "sqlite:///./sakhi.db"

# Normalize postgres:// to postgresql:// for SQLAlchemy 1.4/2.0 compatibility
if raw_url.startswith("postgres://"):
    raw_url = raw_url.replace("postgres://", "postgresql://", 1)

import os
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SQLITE_DB_PATH = os.path.join(BACKEND_DIR, "sakhi.db")
SQLITE_FALLBACK_URL = f"sqlite:///{SQLITE_DB_PATH}"

def build_engine(url: str):
    if url.startswith("postgresql"):
        try:
            # Test connection with a short timeout
            eng = create_engine(url, pool_pre_ping=True, connect_args={"connect_timeout": 3})
            with eng.connect():
                logger.info("Connected to PostgreSQL database.")
            return eng
        except Exception as e:
            logger.warning(f"PostgreSQL connection failed ({e}). Falling back to SQLite.")
            return create_engine(SQLITE_FALLBACK_URL, connect_args={"check_same_thread": False})
    else:
        return create_engine(url, connect_args={"check_same_thread": False})

engine = build_engine(raw_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
