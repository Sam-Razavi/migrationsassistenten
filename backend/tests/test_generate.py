import pytest
from unittest.mock import patch, AsyncMock
from httpx import AsyncClient

CASE_PAYLOAD = {
    "case_number": "MIG-GEN-001",
    "applicant_name": "Fatima Khalil",
    "dob": "1990-07-20",
    "nationality": "Irakisk",
    "rejection_date": "2026-02-01",
    "decision_type": "asylum",
}

MOCK_CHUNKS = ["YRKANDE\n", "Klaganden yrkar", " att domstolen beviljar asyl.\n", "[DONE]"]


async def _mock_generate_appeal(*args, **kwargs):
    for chunk in MOCK_CHUNKS[:-1]:
        yield chunk


async def test_generate_streams_and_saves(async_client: AsyncClient, auth_headers):
    create_resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    assert create_resp.status_code == 201
    case_id = create_resp.json()["id"]

    with patch(
        "app.routers.generate.generate_appeal",
        side_effect=_mock_generate_appeal,
    ):
        resp = await async_client.post(
            f"/generate/{case_id}",
            headers=auth_headers,
        )

    assert resp.status_code == 200
    assert "text/event-stream" in resp.headers["content-type"]

    lines = [l for l in resp.text.split("\n") if l.startswith("data: ")]
    assert any("[DONE]" in l for l in lines)

    # Verify document was saved
    case_resp = await async_client.get(f"/cases/{case_id}", headers=auth_headers)
    assert case_resp.status_code == 200
    saved_doc = case_resp.json().get("generated_document", "")
    assert "YRKANDE" in saved_doc


async def test_generate_404_on_missing_case(async_client: AsyncClient, auth_headers):
    with patch("app.routers.generate.generate_appeal", side_effect=_mock_generate_appeal):
        resp = await async_client.post("/generate/99999", headers=auth_headers)
    assert resp.status_code == 404
