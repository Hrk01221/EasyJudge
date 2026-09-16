from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_register():
    response = client.post(f"{settings.API_V1_STR}/auth/register" , json={
        "username": "testuser123",
        "email": "test123@example.com",
        "password": "password123"
    })

    assert response.status_code == 201

    data = response.json()

    assert data["username"] == "testuser123"
    assert data["email"] == "test123@example.com"
    assert "id" in data

def test_login_with_email():
    response = client.post(f"{settings.API_V1_STR}/auth/login" , data={
        "username": "test123@example.com",
        "password": "password123"
    })

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_with_username():
    response = client.post(f"{settings.API_V1_STR}/auth/login" , data={
        "username": "testuser123",
        "password": "password123"
    })

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password():
    response = client.post(
        f"{settings.API_V1_STR}/auth/login",
        data={
            "username": "test123@example.com",
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 401


def test_login_nonexistent_user():
    response = client.post(
        f"{settings.API_V1_STR}/auth/login",
        data={
            "username": "doesnotexist@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 401