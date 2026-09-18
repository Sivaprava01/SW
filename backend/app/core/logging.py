"""
Sakhi Logging Configuration Module.

Configures consistent standard or JSON logging across the entire application.
"""

import json
import logging
import sys
from datetime import datetime, timezone
from app.core.config import settings


class JSONFormatter(logging.Formatter):
    """Structured JSON formatter for production log aggregators."""
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
            "environment": settings.ENVIRONMENT,
        }
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_entry)


def setup_logging() -> None:
    """Configure root and application loggers."""
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    
    handler = logging.StreamHandler(sys.stdout)
    if settings.LOG_FORMAT.lower() == "json":
        handler.setFormatter(JSONFormatter())
    else:
        log_format = "%(asctime)s | %(levelname)-8s | %(name)s:%(funcName)s:%(lineno)d - %(message)s"
        date_format = "%Y-%m-%d %H:%M:%S"
        handler.setFormatter(logging.Formatter(fmt=log_format, datefmt=date_format))

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.handlers = [handler]
    
    # Silence overly verbose third-party loggers if not in DEBUG
    if not settings.DEBUG:
        logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
        logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    else:
        logging.getLogger("uvicorn.access").setLevel(logging.INFO)


logger = logging.getLogger("sakhi")
