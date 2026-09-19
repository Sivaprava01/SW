"""
Sakhi Database Engine and Session Management Module.

Configures SQLAlchemy 2.x engine, connection pool, session factory,
and dependency injection helper for FastAPI.
"""

from typing import Generator, Tuple
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.core.logging import logger

# Construct engine arguments based on database dialect
connect_args = {}
engine_kwargs = {
    "echo": settings.DB_ECHO,
    "future": True,
}

if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False
    engine_kwargs["connect_args"] = connect_args
else:
    # PostgreSQL pooling configurations
    engine_kwargs["pool_size"] = settings.DB_POOL_SIZE
    engine_kwargs["max_overflow"] = settings.DB_MAX_OVERFLOW
    engine_kwargs["pool_pre_ping"] = True

engine = create_engine(settings.DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
    class_=Session,
)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a transactional database session per request.
    Closes the session cleanly upon request completion.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> Tuple[bool, str]:
    """
    Ping the database by executing a lightweight query ('SELECT 1').
    Returns (True, 'ok') on success, or (False, error_message) on failure.
    """
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True, "connected"
    except Exception as exc:
        logger.error(f"Database readiness ping failed: {exc}", exc_info=True)
        return False, str(exc)


def init_db() -> None:
    """Ensure database schema is created and perform necessary column migrations."""
    from app.models import Base
    from app.core.security import hash_password

    # 1. Create tables if not existing
    Base.metadata.create_all(bind=engine)

    # 2. Add hashed_password column if missing on existing Postgres/SQLite databases
    with engine.begin() as conn:
        try:
            if settings.DATABASE_URL.startswith("postgresql"):
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS hashed_password VARCHAR(255);"))
            else:
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN hashed_password VARCHAR(255);"))
                except Exception:
                    pass
        except Exception as e:
            logger.warning(f"Database column migration note: {e}")

