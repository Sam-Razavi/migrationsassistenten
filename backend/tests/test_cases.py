import pytest
from httpx import AsyncClient

CASE_PAYLOAD = {
    "case_number": "MIG-2026-001",
    "applicant_name": "Ali Ahmadi",
    "dob": "1985-03-15",
    "nationality": "Afghansk",
    "rejection_date": "2026-01-10",
    "decision_type": "family_reunification",
    "rejection_reason": "Otillräcklig bevisning för familjebanden",
}


async def test_create_case(async_client: AsyncClient, auth_headers):
    resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    assert resp.status_code == 201
    data = resp.json()
    assert data["case_number"] == CASE_PAYLOAD["case_number"]
    assert data["applicant_name"] == CASE_PAYLOAD["applicant_name"]
    assert "id" in data


async def test_list_cases(async_client: AsyncClient, auth_headers):
    await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    resp = await async_client.get("/cases/", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    # Each item has required fields
    for item in data:
        assert "id" in item
        assert "case_number" in item


async def test_get_case_by_id(async_client: AsyncClient, auth_headers):
    create_resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    case_id = create_resp.json()["id"]

    resp = await async_client.get(f"/cases/{case_id}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["id"] == case_id


async def test_get_case_404(async_client: AsyncClient, auth_headers):
    resp = await async_client.get("/cases/99999", headers=auth_headers)
    assert resp.status_code == 404


async def test_update_case_evidence_and_timeline(async_client: AsyncClient, auth_headers):
    create_resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    case_id = create_resp.json()["id"]

    evidence = [
        {"id": "e1", "label": "Pass", "description": "Giltigt pass", "is_preset": True, "checked": True}
    ]
    timeline = [
        {"id": "t1", "date": "2025-06-01", "description": "Ansökan inlämnad"}
    ]
    update_resp = await async_client.put(
        f"/cases/{case_id}",
        json={"evidence": evidence, "timeline": timeline},
        headers=auth_headers,
    )
    assert update_resp.status_code == 200
    data = update_resp.json()
    assert len(data["evidence"]) == 1
    assert data["evidence"][0]["label"] == "Pass"
    assert len(data["timeline"]) == 1


async def test_update_case_counter_arguments(async_client: AsyncClient, auth_headers):
    create_resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    case_id = create_resp.json()["id"]

    counter_args = [
        {"id": "ca1", "category": "familjeband", "text": "Vi har levt tillsammans i 10 år"}
    ]
    update_resp = await async_client.put(
        f"/cases/{case_id}",
        json={"counter_arguments": counter_args},
        headers=auth_headers,
    )
    assert update_resp.status_code == 200
    data = update_resp.json()
    assert len(data["counter_arguments"]) == 1
    assert data["counter_arguments"][0]["category"] == "familjeband"
