import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.scheme import GovernmentScheme
from app.models.user import User
from app.models.goal import Goal
from app.data.schemes_seed import GOVERNMENT_SCHEMES

from app.api.users import router as users_router
from app.api.transactions import router as transactions_router
from app.api.financial_health import router as health_router
from app.api.journey import router as journey_router
from app.api.goals import router as goals_router
from app.api.schemes import router as schemes_router
from app.api.ai import router as ai_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sakhi")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize DB tables
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    # 2. Seed authentic government schemes
    db = SessionLocal()
    try:
        existing_count = db.query(GovernmentScheme).count()
        if existing_count == 0:
            logger.info("Seeding authentic Government Schemes...")
            for s_data in GOVERNMENT_SCHEMES:
                scheme = GovernmentScheme(**s_data)
                db.add(scheme)
            db.commit()
            logger.info(f"Successfully seeded {len(GOVERNMENT_SCHEMES)} government schemes.")

        # 3. Ensure Demo Profile (Lakshmi) is available for instant evaluation
        demo_user = db.query(User).filter(User.name == "Lakshmi", User.state == "Telangana").first()
        if not demo_user:
            logger.info("Creating pre-seeded demo user Lakshmi...")
            demo_user = User(
                name="Lakshmi",
                age=28,
                state="Telangana",
                monthly_income=12000.0,
                monthly_expenses=7000.0,
                savings=10000.0,
                debt=20000.0,
                financial_goal="Daughter's Education"
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            demo_goal = Goal(
                user_id=demo_user.id,
                name="Daughter's Education",
                category="Education",
                target_amount=50000.0,
                current_amount=10000.0,
                target_date="12"
            )
            db.add(demo_goal)
            db.commit()
            logger.info(f"Created demo user Lakshmi with ID: {demo_user.id}")
    except Exception as e:
        logger.error(f"Error during startup seeding: {e}")
        db.rollback()
    finally:
        db.close()

    yield
    logger.info("Shutting down Sakhi backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Sakhi: AI-Powered Financial Companion for Rural Women & Financial Literacy",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all feature routers
app.include_router(users_router)
app.include_router(transactions_router)
app.include_router(health_router)
app.include_router(journey_router)
app.include_router(goals_router)
app.include_router(schemes_router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {
        "app": "Sakhi API",
        "status": "online",
        "version": "1.0.0",
        "philosophy": "Backend calculates -> AI explains -> User understands"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "sakhi-backend"}
