from models import Cafe, Admin
from werkzeug.security import check_password_hash, generate_password_hash
from unittest.mock import patch


def test_create_cafe():
    cafe = Cafe(name="Test Cafe", location="TestVille", wifi="Excellent")
    assert cafe.name == "Test Cafe"
    assert cafe.location == "TestVille"
    assert cafe.wifi == "Excellent"


def test_admin_password_hashing():
    admin = Admin(username="liza", password_hash="hashed")
    admin.password_hash = generate_password_hash("secret123")
    assert check_password_hash(admin.password_hash, "secret123")


@patch('app.mail.send')
def test_contact_form(mock_send, client):
    response = client.post('/contact', data={
        'name': 'Liza',
        'email': 'liza@example.com',
        'message': 'Hello!'
    }, follow_redirects=True)
    assert b"Thanks for reaching out!" in response.data
    mock_send.assert_called_once()
