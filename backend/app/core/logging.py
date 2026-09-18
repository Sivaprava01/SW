"""
Sakhi Logging Configuration Module.

Configures consistent standard logging across the entire application.
"""

import logging
import sys
from app.core.config import settings


def setup_logging() -> None:
    """Configure root and application loggers."""
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    
    log_format = "%(asctime)s | %(levelname)-8s | %(name)s:%(funcName)s:%(lineno)d - %(message)s"
    date_format = "%Y-%m-%d %H:%M:%S"

    # Reset any existing handlers on root
    logging.basicConfig(
        level=log_level,
        format=log_format,
        datefmt=date_format,
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True
    )
    
    # Silence overly verbose third-party loggers if not in DEBUG
    if not settings.DEBUG:
        logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
        logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    else:
        logging.getLogger("uvicorn.access").setLevel(logging.INFO)


logger = logging.getLogger("sakhi")
