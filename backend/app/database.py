import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)

database_url = settings.DATABASE_URL

# Auto-fallback logic if PostgreSQL is not reachable or unauthenticated
try:
    if database_url.startswith("postgresql"):
        # Test connection with a short timeout
        engine = create_engine(database_url, pool_pre_ping=True, connect_args={"connect_timeout": 3})
        with engine.connect() as conn:
            logger.info("Successfully connected to PostgreSQL database.")
    else:
        engine = create_engine(database_url, connect_args={"check_same_thread": False})
except Exception as e:
    logger.warning(f"Could not connect to configured DATABASE_URL ({database_url}): {e}")
    logger.warning("Falling back to local SQLite database: sqlite:///./sakhi.db")
    database_url = "sqlite:///./sakhi.db"
    engine = create_engine(database_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
