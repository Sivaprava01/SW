"""
Sakhi Government and SHG Welfare Schemes API Endpoints.

Provides access to verified central & state welfare programs catalog,
deterministic user eligibility matching, and application tracking bookmarks.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_optional_user, verify_user_access
from app.models.user import User
from app.core.errors import ResourceNotFoundException
from app.schemas.scheme import (
    SchemeResponse,
    SchemeMatchResponse,
    BookmarkRequest,
    BookmarkResponse,
)
from app.services.user_service import UserService
from app.services.scheme_service import SchemeService

router = APIRouter(tags=["Government & SHG Schemes"])


@router.get(
    "/schemes",
    response_model=List[SchemeResponse],
    summary="List Government Schemes",
    description="Retrieve verified Central and State welfare schemes with optional category, jurisdiction, and SHG filters.",
)
def list_schemes(
    category: Optional[str] = Query(None, description="Filter by category (e.g. Insurance, Savings, Micro-Enterprise)"),
    jurisdiction: Optional[str] = Query(None, description="Filter by jurisdiction (e.g. Central, Telangana)"),
    requires_shg: Optional[bool] = Query(None, description="Filter by SHG membership requirement"),
    search: Optional[str] = Query(None, description="Search term for name or description"),
    db: Session = Depends(get_db),
) -> List[SchemeResponse]:
    """List schemes with optional filters."""
    return SchemeService.list_schemes(
        db=db,
        category=category,
        jurisdiction=jurisdiction,
        requires_shg=requires_shg,
        search=search,
    )


@router.get(
    "/schemes/{scheme_id_or_slug}",
    response_model=SchemeResponse,
    summary="Get Scheme Details",
    description="Retrieve full details, benefits, documents, and application steps for a scheme by ID or slug.",
)
def get_scheme(
    scheme_id_or_slug: str,
    db: Session = Depends(get_db),
) -> SchemeResponse:
    """Get scheme details by ID or slug."""
    scheme = SchemeService.get_scheme_by_id_or_slug(db=db, scheme_id_or_slug=scheme_id_or_slug)
    if not scheme:
        raise ResourceNotFoundException(message=f"Government scheme '{scheme_id_or_slug}' not found")
    return scheme


@router.get(
    "/users/{user_id}/schemes/matched",
    response_model=List[SchemeMatchResponse],
    summary="Get User Matched Schemes",
    description="Evaluate user demographics and financials deterministically against all schemes to return ranked eligible programs with match reasons.",
)
def get_matched_schemes(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
) -> List[SchemeMatchResponse]:
    """Get deterministically matched schemes for a user."""
    verify_user_access(user_id, current_user)
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    
    return SchemeService.get_matched_schemes_for_user(db=db, user_id=user_id)


@router.post(
    "/users/{user_id}/schemes/{scheme_id}/bookmark",
    response_model=BookmarkResponse,
    summary="Bookmark Scheme or Update Application Status",
    description="Bookmark a scheme for a user or update the application lifecycle status (discovered, applied, enrolled, dismissed).",
)
def bookmark_scheme(
    user_id: int,
    scheme_id: int,
    bookmark_in: BookmarkRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
) -> BookmarkResponse:
    """Bookmark or update application status for a scheme."""
    verify_user_access(user_id, current_user)
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")

    scheme = SchemeService.get_scheme_by_id_or_slug(db=db, scheme_id_or_slug=str(scheme_id))
    if not scheme:
        raise ResourceNotFoundException(message=f"Government scheme with ID {scheme_id} not found")

    return SchemeService.bookmark_or_update_scheme(
        db=db,
        user_id=user_id,
        scheme_id=scheme_id,
        bookmark_in=bookmark_in,
    )


@router.get(
    "/users/{user_id}/schemes/bookmarked",
    response_model=List[BookmarkResponse],
    summary="Get User Bookmarked Schemes",
    description="Retrieve all bookmarked or tracked welfare schemes for a user.",
)
def get_user_bookmarks(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
) -> List[BookmarkResponse]:
    """Get all bookmarked schemes for a user."""
    verify_user_access(user_id, current_user)
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")

    return SchemeService.get_user_bookmarks(db=db, user_id=user_id)
