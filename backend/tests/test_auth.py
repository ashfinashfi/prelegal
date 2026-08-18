"""Authentication endpoint tests."""

def test_signup_success(client):
    response = client.post(
        "/api/auth/signup",
        json={"email": "test@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == "test@example.com"
    assert "access_token" in response.cookies


def test_signup_duplicate_email(client):
    client.post(
        "/api/auth/signup",
        json={"email": "duplicate@example.com", "password": "securepassword123"},
    )
    response = client.post(
        "/api/auth/signup",
        json={"email": "duplicate@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


def test_signup_password_too_short(client):
    response = client.post(
        "/api/auth/signup",
        json={"email": "short@example.com", "password": "short"},
    )
    assert response.status_code in (400, 422)


def test_signin_success(client):
    client.post(
        "/api/auth/signup",
        json={"email": "signin@example.com", "password": "securepassword123"},
    )
    response = client.post(
        "/api/auth/signin",
        json={"email": "signin@example.com", "password": "securepassword123"},
    )
    assert response.status_code == 200
    assert response.json()["user"]["email"] == "signin@example.com"


def test_signin_invalid_password(client):
    client.post(
        "/api/auth/signup",
        json={"email": "wrongpwd@example.com", "password": "securepassword123"},
    )
    response = client.post(
        "/api/auth/signin",
        json={"email": "wrongpwd@example.com", "password": "incorrectpassword"},
    )
    assert response.status_code == 401


def test_get_me_authenticated(client):
    client.post(
        "/api/auth/signup",
        json={"email": "me@example.com", "password": "securepassword123"},
    )
    response = client.get("/api/auth/me")
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"


def test_get_me_unauthenticated(client):
    client.cookies.clear()
    response = client.get("/api/auth/me")
    assert response.status_code == 401
