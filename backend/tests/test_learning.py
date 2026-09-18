"""
Unit & Integration Tests for Sakhi B6 Learning Modules, Lessons & User Progress.
"""

from fastapi.testclient import TestClient


def test_list_learning_modules(client: TestClient):
    """Test retrieving all educational modules and lessons."""
    response = client.get("/api/v1/learning/modules")
    assert response.status_code == 200
    data = response.json()

    assert len(data) >= 3
    first_mod = data[0]
    assert first_mod["module_id"] == "mod-1-cashflow"
    assert len(first_mod["lessons"]) >= 2
    assert "audio_narration_script" in first_mod["lessons"][0]
    assert "te" in first_mod["lessons"][0]["audio_narration_script"]


def test_get_module_and_lesson_by_id(client: TestClient):
    """Test retrieving a single module and single lesson."""
    mod_res = client.get("/api/v1/learning/modules/mod-2-emergency-shield")
    assert mod_res.status_code == 200
    assert mod_res.json()["module_id"] == "mod-2-emergency-shield"

    les_res = client.get("/api/v1/learning/lessons/les-1-1-income-expense")
    assert les_res.status_code == 200
    assert les_res.json()["lesson_id"] == "les-1-1-income-expense"
    assert les_res.json()["quiz"] is not None


def test_complete_lesson_and_check_progress(client: TestClient):
    """Test marking a lesson completed with quiz score and checking progress percentage."""
    user_res = client.post("/api/v1/users", json={"name": "Lakshmi", "age": 28})
    user_id = user_res.json()["id"]

    # Initially 0 completed
    init_res = client.get(f"/api/v1/users/{user_id}/learning/progress")
    assert init_res.status_code == 200
    assert init_res.json()["completed_lessons_count"] == 0
    assert init_res.json()["overall_progress_percentage"] == 0.0

    # Complete lesson 1 with 100% quiz score
    comp_res = client.post(
        f"/api/v1/users/{user_id}/learning/lessons/les-1-1-income-expense/complete",
        json={"quiz_score": 100}
    )
    assert comp_res.status_code == 200
    assert comp_res.json()["is_completed"] is True
    assert comp_res.json()["quiz_score"] == 100

    # Check progress summary
    summary_res = client.get(f"/api/v1/users/{user_id}/learning/progress")
    assert summary_res.status_code == 200
    data = summary_res.json()
    assert data["completed_lessons_count"] == 1
    assert data["overall_progress_percentage"] > 0.0
    assert "les-1-1-income-expense" in data["completed_lesson_ids"]
