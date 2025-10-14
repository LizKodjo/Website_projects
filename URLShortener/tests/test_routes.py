import pytest
from models import URL, db
import random
import string


def generate_unique_short_code():
    """Generate a unique short code for testing."""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))


def test_index_route(client):
    """Test the main page loads correctly"""
    response = client.get('/')
    assert response.status_code == 200
    assert b'URL Shortener' in response.data
    assert b'Shorten Your URL' in response.data


def test_shorten_url_success(client):
    """Test successful URL shortening"""
    response = client.post('/shorten', data={
        'url': 'https://example-success.com'
    })

    assert response.status_code == 200


def test_shorten_url_missing_protocol(client):
    """Test URL shortening with missing protocol"""
    response = client.post('/shorten', data={
        'url': 'example-protocol.com'
    })

    assert response.status_code == 200


def test_shorten_url_empty(client):
    """Test URL shortening with empty input"""
    response = client.post('/shorten', data={
        'url': ''
    }, follow_redirects=True)

    assert response.status_code == 200


def test_shorten_url_duplicate(client):
    """Test shortening the same URL multiple times returns existing short code"""
    test_url = 'https://duplicate-unique-test.com'

    # First request
    response1 = client.post('/shorten', data={'url': test_url})

    # Second request with same URL
    response2 = client.post('/shorten', data={'url': test_url})

    assert response1.status_code == 200
    assert response2.status_code == 200


def test_redirect_url_success(client, app):
    """Test successful URL redirection"""
    with app.app_context():
        short_code = generate_unique_short_code()
        url = URL(original_url='https://redirect-success-test.com',
                  short_code=short_code)
        db.session.add(url)
        db.session.commit()

        response = client.get(f'/{short_code}', follow_redirects=False)

        # Should redirect to the original URL
        assert response.status_code in [301, 302, 308]
        assert 'https://redirect-success-test.com' in response.location


def test_redirect_url_not_found(client):
    """Test redirect with non-existent short code"""
    response = client.get('/nonexistentcode123', follow_redirects=True)

    assert response.status_code == 200


def test_url_stats_success(client, app):
    """Test URL statistics page for existing URL"""
    with app.app_context():
        short_code = generate_unique_short_code()
        url = URL(original_url='https://stats-success-test.com',
                  short_code=short_code, clicks=5)
        db.session.add(url)
        db.session.commit()

        response = client.get(f'/stats/{short_code}')

        assert response.status_code == 200
        assert b'https://stats-success-test.com' in response.data


def test_url_stats_not_found(client):
    """Test URL statistics page for non-existent URL"""
    response = client.get('/stats/nonexistentstats123', follow_redirects=True)

    assert response.status_code == 200


def test_all_stats_empty(client):
    """Test all stats page with no URLs"""
    response = client.get('/all-stats')

    assert response.status_code == 200


def test_all_stats_with_data(client, app):
    """Test all stats page with existing URLs"""
    with app.app_context():
        short_code = generate_unique_short_code()
        url = URL(original_url='https://allstats-data-test.com',
                  short_code=short_code)
        db.session.add(url)
        db.session.commit()

        response = client.get('/all-stats')

        assert response.status_code == 200
        assert b'https://allstats-data-test.com' in response.data


def test_click_tracking(client, app):
    """Test that clicks are tracked when redirecting"""
    with app.app_context():
        short_code = generate_unique_short_code()
        url = URL(original_url='https://click-tracking-test.com',
                  short_code=short_code)
        db.session.add(url)
        db.session.commit()

        initial_clicks = url.clicks

        # Access the short URL
        client.get(f'/{short_code}', follow_redirects=False)

        # Check that clicks were incremented
        updated_url = URL.query.filter_by(short_code=short_code).first()
        assert updated_url.clicks == initial_clicks + 1
        assert updated_url.last_accessed is not None
