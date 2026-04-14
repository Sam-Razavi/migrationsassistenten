import pytest
from datetime import date, timedelta
from httpx import AsyncClient

CASE_PAYLOAD = {
    "case_number": "UM-DL-001",
    "applicant_name": "Layla Nouri",
    "dob": "1992-05-10",
    "nationality": "Iranskt",
    "rejection_date": "2026-04-01",
    "decision_type": "family_reunification",
}


async def test_appeal_deadline_computed_on_create(async_client: AsyncClient, auth_headers):
    resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()

    expected = (date.fromisoformat("2026-04-01") + timedelta(days=21)).isoformat()
    assert data["appeal_deadline"] == expected


async def test_appeal_deadline_in_list(async_client: AsyncClient, auth_headers):
    await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    resp = await async_client.get("/cases/", headers=auth_headers)
    assert resp.status_code == 200
    cases = resp.json()
    assert any(c.get("appeal_deadline") is not None for c in cases)


async def test_appeal_deadline_updates_on_rejection_date_change(async_client: AsyncClient, auth_headers):
    create_resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    case_id = create_resp.json()["id"]

    new_rejection = "2026-05-01"
    update_resp = await async_client.put(
        f"/cases/{case_id}",
        json={"rejection_date": new_rejection},
        headers=auth_headers,
    )
    assert update_resp.status_code == 200
    expected = (date.fromisoformat(new_rejection) + timedelta(days=21)).isoformat()
    assert update_resp.json()["appeal_deadline"] == expected


async def test_appeal_deadline_not_changed_on_other_update(async_client: AsyncClient, auth_headers):
    create_resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    case_id = create_resp.json()["id"]
    original_deadline = create_resp.json()["appeal_deadline"]

    update_resp = await async_client.put(
        f"/cases/{case_id}",
        json={"rejection_reason": "Brister i bevisningen"},
        headers=auth_headers,
    )
    assert update_resp.json()["appeal_deadline"] == original_deadline
