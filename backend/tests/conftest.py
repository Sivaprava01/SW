"""
Pytest Test Fixtures and Configuration.
"""

from typing import Generator
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import get_db
from app.models.base import Base

# In-memory SQLite engine for fast isolated testing
TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
    expire_on_commit=False,
    class_=Session,
)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db(monkeypatch_session=None):
    """Create all tables in the test database on session start and patch engine."""
    import app.core.database as db_module
    import app.api.v1.endpoints.health as health_module
    
    # Patch main engine and check_db_connection for test session
    orig_engine = db_module.engine
    db_module.engine = test_engine
    
    def test_check_db_connection():
        try:
            with test_engine.connect() as conn:
                from sqlalchemy import text
                conn.execute(text("SELECT 1"))
            return True, "connected"
        except Exception as e:
            return False, str(e)
            
    db_module.check_db_connection = test_check_db_connection
    health_module.check_db_connection = test_check_db_connection

    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)
    db_module.engine = orig_engine


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    """Provide a clean transactional database session per test."""
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """Provide a FastAPI TestClient configured with test database session override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
