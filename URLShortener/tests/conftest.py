import pytest
import os
import tempfile
from app import app as flask_app
from models import db
import random
import string


@pytest.fixture(scope='function')
def app():
    """Create and configure a new app instance for each test."""
    # Create a temporary file to isolate the database for each test
    db_fd, db_path = tempfile.mkstemp()
    flask_app.config['TESTING'] = True
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    flask_app.config['WTF_CSRF_ENABLED'] = False
    flask_app.config['SECRET_KEY'] = 'test-secret-key'

    with flask_app.app_context():
        db.create_all()

    yield flask_app

    # Clean up database and close connection
    with flask_app.app_context():
        db.session.remove()
        db.drop_all()

    # Close and remove the temporary database
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test runner for the app."""
    return app.test_cli_runner()


def generate_unique_short_code():
    """Generate a unique short code for testing."""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))


@pytest.fixture
def sample_url(app):
    """Create a sample URL in the database for testing."""
    from models import URL
    from datetime import datetime

    with app.app_context():
        short_code = generate_unique_short_code()
        url = URL(
            original_url=f'https://example-{short_code}.com',
            short_code=short_code,
            created_at=datetime.utcnow(),
            clicks=5
        )
        db.session.add(url)
        db.session.commit()
        return url
