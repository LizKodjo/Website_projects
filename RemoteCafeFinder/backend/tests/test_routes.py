import pytest
from app import app, db
from models import Cafe, Admin


@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client


def test_home_page(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"Remote Cafe Finder" in response.data


def test_add_cafe(client):
    response = client.post('/add-cafe', data={
        'name': 'Test Cafe',
        'location': 'Test Location',
        'wifi': 'Excellent'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b"Test Cafe added successfully!" in response.data


def test_login_fail(client):
    response = client.post('/login', data={
        'username': 'wrong',
        'password': 'wrong'
    }, follow_redirects=True)
    assert b"Invalid credentials" in response.data


def test_admin_dashboard_requires_login(client):
    response = client.get('/admin-dashboard', follow_redirects=True)
    assert b"Please log in to access the dashboard." in response.data


def test_edit_cafe_requires_login(client):
    response = client.get('/edit-cafe/1', follow_redirects=True)
    assert b"Please log in to access the dashboard." in response.data


def test_delete_cafe_requires_login(client):
    response = client.post('/delete-cafe/1', follow_redirects=True)
    assert b"Please log in to access the dashboard." in response.data


def test_export_requires_login(client):
    response = client.get('/export', follow_redirects=True)
    assert b"Please log in to access the dashboard." in response.data
