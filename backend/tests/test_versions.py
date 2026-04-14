import pytest
from unittest.mock import patch
from httpx import AsyncClient

CASE_PAYLOAD = {
    "case_number": "UM-VER-001",
    "applicant_name": "Hamid Rezaei",
    "dob": "1980-09-15",
    "nationality": "Afghansk",
    "rejection_date": "2026-03-15",
    "decision_type": "asylum",
}

MOCK_CHUNKS = ["YRKANDE\n", "Klaganden yrkar bifall.\n"]


async def _mock_generate(*args, **kwargs):
    for chunk in MOCK_CHUNKS:
        yield chunk


async def test_no_versions_initially(async_client: AsyncClient, auth_headers):
    create_resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    case_id = create_resp.json()["id"]

    resp = await async_client.get(f"/cases/{case_id}/versions", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json() == []


async def test_version_created_on_generate(async_client: AsyncClient, auth_headers):
    create_resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    case_id = create_resp.json()["id"]

    with patch("app.routers.generate.generate_appeal", side_effect=_mock_generate):
        await async_client.post(f"/generate/{case_id}", headers=auth_headers)

    resp = await async_client.get(f"/cases/{case_id}/versions", headers=auth_headers)
    assert resp.status_code == 200
    versions = resp.json()
    assert len(versions) == 1
    assert versions[0]["label"] == "Genererat"
    assert "content" not in versions[0]


async def test_get_version_detail_includes_content(async_client: AsyncClient, auth_headers):
    create_resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    case_id = create_resp.json()["id"]

    with patch("app.routers.generate.generate_appeal", side_effect=_mock_generate):
        await async_client.post(f"/generate/{case_id}", headers=auth_headers)

    versions_resp = await async_client.get(f"/cases/{case_id}/versions", headers=auth_headers)
    version_id = versions_resp.json()[0]["id"]

    detail_resp = await async_client.get(f"/cases/{case_id}/versions/{version_id}", headers=auth_headers)
    assert detail_resp.status_code == 200
    data = detail_resp.json()
    assert "content" in data
    assert "YRKANDE" in data["content"]


async def test_restore_version(async_client: AsyncClient, auth_headers):
    create_resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    case_id = create_resp.json()["id"]

    with patch("app.routers.generate.generate_appeal", side_effect=_mock_generate):
        await async_client.post(f"/generate/{case_id}", headers=auth_headers)

    # Override the generated document manually
    await async_client.put(
        f"/cases/{case_id}",
        json={"generated_document": "Ny text som ska ersättas"},
        headers=auth_headers,
    )

    # Get first version id
    versions_resp = await async_client.get(f"/cases/{case_id}/versions", headers=auth_headers)
    version_id = versions_resp.json()[0]["id"]

    restore_resp = await async_client.post(
        f"/cases/{case_id}/versions/{version_id}/restore",
        headers=auth_headers,
    )
    assert restore_resp.status_code == 200
    assert "YRKANDE" in restore_resp.json()["generated_document"]


async def test_versions_404_missing_case(async_client: AsyncClient, auth_headers):
    resp = await async_client.get("/cases/99999/versions", headers=auth_headers)
    assert resp.status_code == 404
