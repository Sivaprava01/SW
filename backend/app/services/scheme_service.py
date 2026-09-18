"""
Sakhi Government Scheme Service.

Handles scheme catalog querying, auto-seeding of authentic central & state schemes,
deterministic eligibility evaluation for users, and user bookmark tracking.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.user import User
from app.models.scheme import GovernmentScheme, UserSchemeBookmark
from app.schemas.scheme import (
    SchemeResponse,
    SchemeMatchResponse,
    BookmarkRequest,
)
from app.services.scheme_matcher import SchemeMatcher
from app.data.schemes_seed import AUTHENTIC_SCHEMES_DATA


class SchemeService:
    """Service layer for Government and SHG Schemes."""

    @classmethod
    def seed_schemes_if_empty(cls, db: Session) -> int:
        """Seed authentic welfare schemes if the table is empty."""
        existing_count = db.query(GovernmentScheme).count()
        if existing_count > 0:
            return existing_count

        created_count = 0
        for item in AUTHENTIC_SCHEMES_DATA:
            scheme = GovernmentScheme(**item)
            db.add(scheme)
            created_count += 1
        
        db.commit()
        return created_count

    @classmethod
    def list_schemes(
        cls,
        db: Session,
        category: Optional[str] = None,
        jurisdiction: Optional[str] = None,
        requires_shg: Optional[bool] = None,
        search: Optional[str] = None,
    ) -> List[GovernmentScheme]:
        """Query government schemes catalog with optional filters."""
        # Ensure database is seeded
        cls.seed_schemes_if_empty(db)

        query = db.query(GovernmentScheme).filter(GovernmentScheme.is_active == True)

        if category:
            query = query.filter(GovernmentScheme.category.ilike(f"%{category}%"))
        
        if jurisdiction:
            query = query.filter(GovernmentScheme.jurisdiction.ilike(f"%{jurisdiction}%"))

        if requires_shg is not None:
            query = query.filter(GovernmentScheme.requires_shg == requires_shg)

        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                or_(
                    GovernmentScheme.name.ilike(search_pattern),
                    GovernmentScheme.short_name.ilike(search_pattern),
                    GovernmentScheme.description.ilike(search_pattern),
                    GovernmentScheme.category.ilike(search_pattern),
                    GovernmentScheme.target_beneficiaries.ilike(search_pattern),
                )
            )

        return query.order_by(GovernmentScheme.id.asc()).all()

    @classmethod
    def get_scheme_by_id_or_slug(
        cls,
        db: Session,
        scheme_id_or_slug: str,
    ) -> Optional[GovernmentScheme]:
        """Retrieve a scheme by integer ID or unique slug identifier."""
        cls.seed_schemes_if_empty(db)

        if scheme_id_or_slug.isdigit():
            scheme = db.query(GovernmentScheme).filter(GovernmentScheme.id == int(scheme_id_or_slug)).first()
            if scheme:
                return scheme

        return db.query(GovernmentScheme).filter(GovernmentScheme.slug == scheme_id_or_slug).first()

    @classmethod
    def get_matched_schemes_for_user(
        cls,
        db: Session,
        user_id: int,
    ) -> List[SchemeMatchResponse]:
        """
        Evaluate and return all active government schemes ranked by deterministic eligibility for a user.
        """
        cls.seed_schemes_if_empty(db)

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return []

        schemes = db.query(GovernmentScheme).filter(GovernmentScheme.is_active == True).all()
        user_bookmarks = db.query(UserSchemeBookmark).filter(UserSchemeBookmark.user_id == user_id).all()
        bookmark_map = {b.scheme_id: b for b in user_bookmarks}

        matched_results: List[SchemeMatchResponse] = []
        for scheme in schemes:
            eval_result = SchemeMatcher.evaluate(user=user, scheme=scheme)
            user_b = bookmark_map.get(scheme.id)
            status_val = user_b.application_status if user_b else None

            # Build SchemeMatchResponse
            base_data = SchemeResponse.model_validate(scheme).model_dump()
            base_data.update({
                "match_score": eval_result["match_score"],
                "is_eligible": eval_result["is_eligible"],
                "eligibility_reasons": eval_result["eligibility_reasons"],
                "missing_requirements": eval_result["missing_requirements"],
                "user_application_status": status_val,
            })
            matched_results.append(SchemeMatchResponse(**base_data))

        # Sort: 100% eligible first, then match_score descending, then id ascending
        matched_results.sort(
            key=lambda x: (1 if x.is_eligible else 0, x.match_score, -x.id),
            reverse=True
        )

        return matched_results

    @classmethod
    def bookmark_or_update_scheme(
        cls,
        db: Session,
        user_id: int,
        scheme_id: int,
        bookmark_in: BookmarkRequest,
    ) -> UserSchemeBookmark:
        """Create or update a bookmark / application progress for a user on a scheme."""
        bookmark = (
            db.query(UserSchemeBookmark)
            .filter(
                UserSchemeBookmark.user_id == user_id,
                UserSchemeBookmark.scheme_id == scheme_id,
            )
            .first()
        )

        if bookmark:
            bookmark.is_bookmarked = bookmark_in.is_bookmarked
            bookmark.application_status = bookmark_in.application_status
            if bookmark_in.notes is not None:
                bookmark.notes = bookmark_in.notes
        else:
            bookmark = UserSchemeBookmark(
                user_id=user_id,
                scheme_id=scheme_id,
                is_bookmarked=bookmark_in.is_bookmarked,
                application_status=bookmark_in.application_status,
                notes=bookmark_in.notes,
            )
            db.add(bookmark)

        db.commit()
        db.refresh(bookmark)
        return bookmark

    @classmethod
    def get_user_bookmarks(
        cls,
        db: Session,
        user_id: int,
    ) -> List[UserSchemeBookmark]:
        """Retrieve all active scheme bookmarks for a user."""
        return (
            db.query(UserSchemeBookmark)
            .filter(
                UserSchemeBookmark.user_id == user_id,
                UserSchemeBookmark.is_bookmarked == True,
            )
            .order_by(UserSchemeBookmark.updated_at.desc())
            .all()
        )
