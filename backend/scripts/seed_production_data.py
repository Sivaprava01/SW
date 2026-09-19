"""
Sakhi Production Data Bootstrap & Seeding Script.

Idempotently seeds authentic Central & State welfare schemes and demo reference profiles
into PostgreSQL or SQLite database.
"""

import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal, check_db_connection
from app.core.logging import logger, setup_logging
from app.services.scheme_service import SchemeService
from app.services.user_service import UserService


def run_seed():
    """Execute complete production database seed routine."""
    setup_logging()
    logger.info("Starting Sakhi production database seed...")

    # 1. Verify Database Connectivity
    is_connected, msg = check_db_connection()
    if not is_connected:
        logger.error(f"Cannot connect to database: {msg}")
        sys.exit(1)

    db = SessionLocal()
    try:
        # 2. Seed Government & SHG Schemes
        logger.info("Seeding verified Central and State welfare schemes...")
        scheme_count = SchemeService.seed_schemes_if_empty(db=db)
        logger.info(f"Successfully seeded/verified {scheme_count} government schemes.")

        logger.info("Database bootstrap completed successfully! All services ready for production traffic.")
    except Exception as exc:
        logger.error(f"Error during production seeding: {exc}", exc_info=True)
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
