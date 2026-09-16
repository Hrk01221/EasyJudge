from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# **** Test Function Name Should always start with test

# Test Home API
def test_home():
    response = client.get("/")

    # Status Code Check
    assert response.status_code == 200

    # Response data Checl
    assert response.json() == {"message" : "Hello Hrk"}

# Test Add API
def test_add():
    response = client.get("/add?x=20&y=29")

    assert response.status_code == 200

    assert response.json() == {"result" : 49}

# Test add user API
def test_add_user():
    response = client.post("/add_user" , json={
        "name" : "Hrk",
        "age" : 23,
        "sub" : "CSE"
    })

    assert response.status_code == 200
    assert response.json()["message"] == "User Created"

    data = response.json()["user"]

    assert data["name"] == "Hrk"
    assert data["age"] == 23
    assert data["sub"] == "CSE"