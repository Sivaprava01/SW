"""
Unit & Integration Tests for Sakhi B7 Government & SHG Schemes.

Tests scheme cataloging, filtering, deterministic rule-based eligibility matcher,
and user bookmark / application status tracking.
"""

from fastapi.testclient import TestClient


def test_list_and_seed_schemes(client: TestClient):
    """Test auto-seeding and retrieving authentic welfare schemes."""
    response = client.get("/api/v1/schemes")
    assert response.status_code == 200
    schemes = response.json()

    assert len(schemes) >= 12
    slugs = [s["slug"] for s in schemes]
    assert "pmsby-accidental-insurance" in slugs
    assert "pmjjby-life-insurance" in slugs
    assert "mssc-women-savings" in slugs
    assert "stree-nidhi-credit-telangana" in slugs
    assert "ayushman-bharat-pmjay" in slugs

    # Check required documents parsing
    pmsby = next(s for s in schemes if s["slug"] == "pmsby-accidental-insurance")
    assert isinstance(pmsby["required_documents"], list)
    assert len(pmsby["required_documents"]) > 0


def test_scheme_filters(client: TestClient):
    """Test filtering schemes by category, jurisdiction, and SHG requirement."""
    # Filter by category
    res_cat = client.get("/api/v1/schemes?category=Insurance")
    assert res_cat.status_code == 200
    cat_schemes = res_cat.json()
    assert len(cat_schemes) >= 2
    assert all("Insurance" in s["category"] for s in cat_schemes)

    # Filter by jurisdiction
    res_jur = client.get("/api/v1/schemes?jurisdiction=Telangana")
    assert res_jur.status_code == 200
    jur_schemes = res_jur.json()
    assert len(jur_schemes) >= 2
    assert all(s["jurisdiction"] == "Telangana" for s in jur_schemes)

    # Filter by SHG requirement
    res_shg = client.get("/api/v1/schemes?requires_shg=true")
    assert res_shg.status_code == 200
    shg_schemes = res_shg.json()
    assert len(shg_schemes) >= 2
    assert all(s["requires_shg"] is True for s in shg_schemes)

    # Search filter
    res_search = client.get("/api/v1/schemes?search=Mudra")
    assert res_search.status_code == 200
    search_schemes = res_search.json()
    assert len(search_schemes) >= 1
    assert "Mudra" in search_schemes[0]["name"]


def test_get_scheme_by_slug_and_id(client: TestClient):
    """Test retrieving a scheme by slug and integer ID."""
    # By slug
    res_slug = client.get("/api/v1/schemes/mssc-women-savings")
    assert res_slug.status_code == 200
    data = res_slug.json()
    assert data["short_name"] == "MSSC"
    assert data["gender_eligibility"] == "female_only"

    # By ID
    scheme_id = data["id"]
    res_id = client.get(f"/api/v1/schemes/{scheme_id}")
    assert res_id.status_code == 200
    assert res_id.json()["slug"] == "mssc-women-savings"

    # Not found
    res_404 = client.get("/api/v1/schemes/non-existent-welfare-program")
    assert res_404.status_code == 404


def test_deterministic_matching_lakshmi(client: TestClient):
    """
    Test deterministic eligibility matcher for reference persona Lakshmi:
    28 yr old female, rural Telangana, SHG member, monthly income ₹15,000 (annual ₹1,80,000).
    """
    # Create Lakshmi profile
    user_res = client.post(
        "/api/v1/users",
        json={
            "name": "Lakshmi Devi",
            "age": 28,
            "gender": "female",
            "state": "Telangana",
            "locality_type": "rural",
            "is_shg_member": True,
            "monthly_income": 15000.0,
            "monthly_expenses": 7000.0,
        },
    )
    assert user_res.status_code == 201
    user_id = user_res.json()["id"]

    matched_res = client.get(f"/api/v1/users/{user_id}/schemes/matched")
    assert matched_res.status_code == 200
    matched = matched_res.json()

    assert len(matched) >= 12

    # Check Stree Nidhi (Telangana, Female, Rural, SHG member) -> 100% eligible
    stree_nidhi = next(s for s in matched if s["short_name"] == "Stree Nidhi")
    assert stree_nidhi["is_eligible"] is True
    assert stree_nidhi["match_score"] == 100.0
    assert len(stree_nidhi["missing_requirements"]) == 0
    assert len(stree_nidhi["eligibility_reasons"]) == 6

    # Check Ayushman Bharat (Income <= 250k) -> 100% eligible
    ayushman = next(s for s in matched if s["short_name"] == "Ayushman Bharat")
    assert ayushman["is_eligible"] is True
    assert ayushman["match_score"] == 100.0

    # Check MSSC (Female only) -> 100% eligible
    mssc = next(s for s in matched if s["short_name"] == "MSSC")
    assert mssc["is_eligible"] is True
    assert mssc["match_score"] == 100.0


def test_deterministic_matching_disqualifications(client: TestClient):
    """
    Test deterministic matcher detects criteria disqualifications:
    75 yr old male, urban Karnataka, non-SHG, income ₹1,00,000/mo (₹12,00,000/yr).
    """
    user_res = client.post(
        "/api/v1/users",
        json={
            "name": "Ramesh Kumar",
            "age": 75,
            "gender": "male",
            "state": "Karnataka",
            "locality_type": "urban",
            "is_shg_member": False,
            "monthly_income": 100000.0,
            "monthly_expenses": 60000.0,
        },
    )
    user_id = user_res.json()["id"]

    matched_res = client.get(f"/api/v1/users/{user_id}/schemes/matched")
    assert matched_res.status_code == 200
    matched = matched_res.json()

    # PMJJBY (Max age 50) -> Ineligible on age
    pmjjby = next(s for s in matched if s["short_name"] == "PMJJBY")
    assert pmjjby["is_eligible"] is False
    assert any("exceeds maximum age limit" in r for r in pmjjby["missing_requirements"])

    # Stree Nidhi (Female only, Telangana only, Rural only, SHG required)
    stree_nidhi = next(s for s in matched if s["short_name"] == "Stree Nidhi")
    assert stree_nidhi["is_eligible"] is False
    assert stree_nidhi["match_score"] < 50.0
    assert any("exclusively designed for women" in r for r in stree_nidhi["missing_requirements"])
    assert any("Telangana" in r for r in stree_nidhi["missing_requirements"])
    assert any("Rural" in r for r in stree_nidhi["missing_requirements"])
    assert any("Self-Help Group" in r for r in stree_nidhi["missing_requirements"])

    # Ayushman Bharat (Max income 2.5L) -> Ineligible on income
    ayushman = next(s for s in matched if s["short_name"] == "Ayushman Bharat")
    assert ayushman["is_eligible"] is False
    assert any("exceeds threshold" in r for r in ayushman["missing_requirements"])


def test_scheme_bookmark_and_lifecycle(client: TestClient):
    """Test user bookmarking a scheme and advancing through application status lifecycle."""
    user_res = client.post("/api/v1/users", json={"name": "Sita", "age": 30})
    user_id = user_res.json()["id"]

    scheme_res = client.get("/api/v1/schemes/pmsby-accidental-insurance")
    scheme_id = scheme_res.json()["id"]

    # 1. Bookmark the scheme
    bm_res = client.post(
        f"/api/v1/users/{user_id}/schemes/{scheme_id}/bookmark",
        json={
            "is_bookmarked": True,
            "application_status": "applied",
            "notes": "Submitted form at SBI village branch",
        },
    )
    assert bm_res.status_code == 200
    data = bm_res.json()
    assert data["is_bookmarked"] is True
    assert data["application_status"] == "applied"
    assert data["notes"] == "Submitted form at SBI village branch"
    assert data["scheme"]["short_name"] == "PMSBY"

    # 2. Get bookmarked list
    list_bm = client.get(f"/api/v1/users/{user_id}/schemes/bookmarked")
    assert list_bm.status_code == 200
    bookmarks = list_bm.json()
    assert len(bookmarks) == 1
    assert bookmarks[0]["scheme_id"] == scheme_id

    # 3. Check that matched endpoint reflects user_application_status
    matched_res = client.get(f"/api/v1/users/{user_id}/schemes/matched")
    matched = matched_res.json()
    pmsby_matched = next(s for s in matched if s["id"] == scheme_id)
    assert pmsby_matched["user_application_status"] == "applied"

    # 4. Update status to enrolled
    upd_res = client.post(
        f"/api/v1/users/{user_id}/schemes/{scheme_id}/bookmark",
        json={
            "is_bookmarked": True,
            "application_status": "enrolled",
            "notes": "Policy active, premium debited",
        },
    )
    assert upd_res.status_code == 200
    assert upd_res.json()["application_status"] == "enrolled"

    # 5. Un-bookmark
    unbm_res = client.post(
        f"/api/v1/users/{user_id}/schemes/{scheme_id}/bookmark",
        json={
            "is_bookmarked": False,
            "application_status": "dismissed",
        },
    )
    assert unbm_res.status_code == 200
    assert unbm_res.json()["is_bookmarked"] is False

    list_bm_after = client.get(f"/api/v1/users/{user_id}/schemes/bookmarked")
    assert list_bm_after.status_code == 200
    assert len(list_bm_after.json()) == 0


def test_scheme_error_handling_404s(client: TestClient):
    """Test 404 error responses for invalid scheme or user IDs."""
    # Invalid user on matched schemes
    res1 = client.get("/api/v1/users/999999/schemes/matched")
    assert res1.status_code == 404

    # Invalid user on bookmarked schemes
    res2 = client.get("/api/v1/users/999999/schemes/bookmarked")
    assert res2.status_code == 404

    # Create a valid user
    u_res = client.post("/api/v1/users", json={"name": "Priya", "age": 25})
    user_id = u_res.json()["id"]

    # Invalid scheme on bookmarking
    res3 = client.post(
        f"/api/v1/users/{user_id}/schemes/999999/bookmark",
        json={"is_bookmarked": True, "application_status": "discovered"}
    )
    assert res3.status_code == 404

    # Invalid user on bookmarking
    res4 = client.post(
        "/api/v1/users/999999/schemes/1/bookmark",
        json={"is_bookmarked": True, "application_status": "discovered"}
    )
    assert res4.status_code == 404

