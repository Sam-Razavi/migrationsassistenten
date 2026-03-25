import pytest
from unittest.mock import patch
from httpx import AsyncClient

CASE_PAYLOAD = {
    "case_number": "MIG-EXP-001",
    "applicant_name": "Omar Hassan",
    "dob": "1978-11-05",
    "nationality": "Somalisk",
    "rejection_date": "2026-01-20",
    "decision_type": "permanent_residence",
}


async def test_export_404_missing_case(async_client: AsyncClient, auth_headers):
    resp = await async_client.get("/export/99999", headers=auth_headers)
    assert resp.status_code == 404


async def test_export_400_no_document(async_client: AsyncClient, auth_headers):
    create_resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    case_id = create_resp.json()["id"]

    resp = await async_client.get(f"/export/{case_id}", headers=auth_headers)
    assert resp.status_code == 400


async def test_export_pdf_response_headers(async_client: AsyncClient, auth_headers):
    create_resp = await async_client.post("/cases/", json=CASE_PAYLOAD, headers=auth_headers)
    case_id = create_resp.json()["id"]

    # Set a generated document directly
    await async_client.put(
        f"/cases/{case_id}",
        json={"generated_document": "YRKANDE\nTest överklagande.\n"},
        headers=auth_headers,
    )

    with patch("app.routers.export.generate_pdf", return_value=b"%PDF-mock"):
        resp = await async_client.get(f"/export/{case_id}", headers=auth_headers)

    assert resp.status_code == 200
    assert resp.headers["content-type"] == "application/pdf"
    assert "attachment" in resp.headers["content-disposition"]
    assert resp.content == b"%PDF-mock"
