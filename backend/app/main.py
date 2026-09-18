import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.scheme import GovernmentScheme
from app.models.user import User
from app.models.goal import Goal
from app.data.schemes_seed import GOVERNMENT_SCHEMES
from app.core.security import hash_password

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.transactions import router as transactions_router
from app.api.financial_health import router as health_router
from app.api.journey import router as journey_router
from app.api.goals import router as goals_router
from app.api.schemes import router as schemes_router
from app.api.ai import router as ai_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("sakhi")
security_logger = logging.getLogger("sakhi.security")

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

        # 3. Ensure Demo Profile (Lakshmi) is available with securely hashed password
        demo_user = db.query(User).filter(User.name == "Lakshmi", User.state == "Telangana").first()
        demo_pw_hash = hash_password(settings.DEMO_PASSWORD)

        if not demo_user:
            logger.info("Creating pre-seeded demo user Lakshmi with secure password hash...")
            demo_user = User(
                name="Lakshmi",
                email="lakshmi@sakhi.org",
                phone="+919876543210",
                password_hash=demo_pw_hash,
                role="USER",
                is_active=True,
                age=28,
                state="Telangana",
                gender="women",
                is_shg_member=True,
                has_business_interest=True,
                is_rural=True,
                occupation="Tailoring & Small Trade",
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
        else:
            # Backfill any missing auth fields on existing demo user
            if not demo_user.email:
                demo_user.email = "lakshmi@sakhi.org"
            if not demo_user.phone:
                demo_user.phone = "+919876543210"
            if not demo_user.password_hash:
                demo_user.password_hash = demo_pw_hash
            demo_user.role = "USER"
            demo_user.is_active = True
            db.commit()
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

# CORS Configuration with configurable origins (No wildcards with credentials)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Safe global exception handlers: Never leaks stack traces, secrets, or internal paths
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=exc.headers
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        errors.append(f"{field}: {err.get('msg', 'Invalid input')}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation error: " + "; ".join(errors)}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log securely without leaking secrets
    logger.error(f"Unhandled Exception on {request.method} {request.url.path}: {exc}", exc_info=False)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later."}
    )

# Mount all feature and auth routers
app.include_router(auth_router)
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
