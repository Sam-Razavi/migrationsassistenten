import pytest
from httpx import AsyncClient


async def test_register_success(async_client: AsyncClient):
    resp = await async_client.post(
        "/auth/register",
        json={"email": "new_user2@example.com", "password": "SecurePass!99"},
    )
    assert resp.status_code == 201, f"Expected 201, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert data["email"] == "new_user2@example.com"
    assert "id" in data
    assert "hashed_password" not in data
    assert "created_at" in data


async def test_register_duplicate_email(async_client: AsyncClient):
    payload = {"email": "dup@example.com", "password": "Pass123!"}
    await async_client.post("/auth/register", json=payload)
    resp = await async_client.post("/auth/register", json=payload)
    assert resp.status_code == 400


async def test_login_success(async_client: AsyncClient, test_user):
    resp = await async_client.post(
        "/auth/login",
        data={"username": test_user["email"], "password": test_user["password"]},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


async def test_login_wrong_password(async_client: AsyncClient, test_user):
    resp = await async_client.post(
        "/auth/login",
        data={"username": test_user["email"], "password": "WrongPassword!"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 401


async def test_me_with_valid_token(async_client: AsyncClient, auth_headers):
    resp = await async_client.get("/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "email" in data
    assert "id" in data


async def test_me_with_invalid_token(async_client: AsyncClient):
    resp = await async_client.get(
        "/auth/me", headers={"Authorization": "Bearer invalidtoken"}
    )
    assert resp.status_code == 401
