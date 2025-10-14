import pytest
from models import URL, db
from datetime import datetime
import random
import string


def generate_unique_short_code():
    """Generate a unique short code for testing."""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))


def test_new_url(app):
    """Test creating a new URL entry"""
    with app.app_context():
        short_code = generate_unique_short_code()
        url = URL(
            original_url='https://example.com',
            short_code=short_code,
            created_at=datetime.utcnow()
        )
        db.session.add(url)
        db.session.commit()

        # Check that the URL was saved correctly
        assert url.id is not None
        assert url.original_url == 'https://example.com'
        assert url.short_code == short_code
        assert url.clicks == 0
        assert url.last_accessed is None


def test_url_repr(app):
    """Test URL string representation"""
    with app.app_context():
        short_code = generate_unique_short_code()
        url = URL(original_url='https://example.com', short_code=short_code)
        assert repr(url) == f'<URL https://example.com -> {short_code}>'


def test_url_default_values(app):
    """Test URL default values"""
    with app.app_context():
        short_code = generate_unique_short_code()
        url = URL(original_url='https://test.com', short_code=short_code)
        db.session.add(url)
        db.session.commit()

        assert url.clicks == 0
        assert url.created_at is not None
        assert isinstance(url.created_at, datetime)


def test_url_click_increment(app):
    """Test that URL clicks can be incremented"""
    with app.app_context():
        short_code = generate_unique_short_code()
        url = URL(original_url='https://click-test.com', short_code=short_code)
        db.session.add(url)
        db.session.commit()

        initial_clicks = url.clicks
        url.clicks += 1
        url.last_accessed = datetime.utcnow()
        db.session.commit()

        updated_url = URL.query.get(url.id)
        assert updated_url.clicks == initial_clicks + 1
        assert updated_url.last_accessed is not None


def test_url_unique_short_code(app):
    """Test that short codes must be unique"""
    with app.app_context():
        short_code = generate_unique_short_code()
        url1 = URL(original_url='https://example1.com', short_code=short_code)
        db.session.add(url1)
        db.session.commit()

        # Try to create another URL with the same short code
        url2 = URL(original_url='https://example2.com', short_code=short_code)
        db.session.add(url2)

        # This should raise an integrity error
        with pytest.raises(Exception):
            db.session.commit()

        # Clean up by rolling back
        db.session.rollback()
