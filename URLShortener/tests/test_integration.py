import pytest
from models import URL, db


def test_complete_workflow(client, app):
    """Test the complete URL shortening workflow"""
    with app.app_context():
        # Step 1: Access the main page
        response = client.get('/')
        assert response.status_code == 200

        # Step 2: Shorten a URL
        original_url = 'https://integration-complete-test.com'
        response = client.post('/shorten', data={'url': original_url})

        assert response.status_code == 200

        # Step 3: Find the created URL in database
        url_entry = URL.query.filter_by(original_url=original_url).first()
        assert url_entry is not None
        short_code = url_entry.short_code

        # Initial clicks should be 0
        assert url_entry.clicks == 0

        # Step 4: Test redirect
        response = client.get(f'/{short_code}', follow_redirects=False)
        assert response.status_code in [301, 302, 308]
        assert original_url in response.location

        # Step 5: Verify click was tracked
        url_entry_after_click = URL.query.filter_by(
            short_code=short_code).first()
        assert url_entry_after_click.clicks == 1
        assert url_entry_after_click.last_accessed is not None

        # Step 6: Check stats page
        response = client.get(f'/stats/{short_code}')
        assert response.status_code == 200
        assert original_url in response.data.decode()


def test_multiple_urls_workflow(client, app):
    """Test workflow with multiple URLs"""
    with app.app_context():
        urls_to_shorten = [
            'https://multi-test1.com',
            'https://multi-test2.com',
            'https://multi-test3.com'
        ]

        # Shorten multiple URLs
        for url in urls_to_shorten:
            response = client.post('/shorten', data={'url': url})
            assert response.status_code == 200

        # Verify all URLs are in the database
        saved_urls = URL.query.all()
        assert len(saved_urls) == 3

        # Check all-stats page shows all URLs
        response = client.get('/all-stats')
        assert response.status_code == 200
        response_data = response.data.decode()
        for url in urls_to_shorten:
            assert url in response_data
