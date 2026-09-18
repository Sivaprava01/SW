import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger("sakhi.database")

def get_engine():
    raw_url = settings.DATABASE_URL or "postgresql://postgres:postgres@localhost:5432/sakhi"

    # Normalize postgres:// to postgresql:// for SQLAlchemy compatibility
    if raw_url.startswith("postgres://"):
        raw_url = raw_url.replace("postgres://", "postgresql://", 1)

    is_postgres = raw_url.startswith("postgresql")
    is_sqlite = raw_url.startswith("sqlite")

    if is_postgres:
        connect_args = {"connect_timeout": 5}
        try:
            eng = create_engine(
                raw_url,
                pool_size=10,
                max_overflow=20,
                pool_recycle=3600,
                pool_pre_ping=True,
                connect_args=connect_args
            )
            # Verify immediate connection test
            with eng.connect():
                logger.info("Successfully connected to primary PostgreSQL database.")
            return eng
        except Exception as e:
            if settings.ENVIRONMENT == "production":
                logger.critical(f"FATAL: Failed to connect to primary PostgreSQL in production: {e}")
                raise RuntimeError(f"PostgreSQL connection failed in production: {e}")
            else:
                # In development or testing, warn explicitly and fallback to local SQLite if allowed
                backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                sqlite_path = os.path.join(backend_dir, "sakhi.db")
                logger.warning(
                    f"PostgreSQL connection failed in {settings.ENVIRONMENT} ({e}). "
                    f"Falling back to local SQLite at {sqlite_path} for development/testing only."
                )
                return create_engine(
                    f"sqlite:///{sqlite_path}",
                    connect_args={"check_same_thread": False}
                )
    elif is_sqlite:
        logger.info(f"Using explicitly configured SQLite database: {raw_url}")
        return create_engine(raw_url, connect_args={"check_same_thread": False})
    else:
        logger.info(f"Connecting to database with driver: {raw_url.split('://')[0]}")
        return create_engine(raw_url)

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
