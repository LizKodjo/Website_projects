
from datetime import datetime
import random
import string
from flask import Flask, flash, redirect, render_template, request, url_for
import os
from dotenv import load_dotenv
from models import URL, db

load_dotenv()


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = os.getenv(
    "SQLALCHEMY_TRACK_MODIFICATIONS")

db.init_app(app)


def generate_short_code(length=6):
    """Generate a random short code"""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/shorten', methods=['POST'])
def shorten_url():
    original_url = request.form.get('url')

    if not original_url:
        flash('Please enter a URL', 'error')
        return redirect(url_for('index'))

    # Add http:// if missing
    if not original_url.startswith(('http://', 'https://')):
        original_url = 'http://' + original_url

    # Check if URL already exists
    existing_url = URL.query.filter_by(original_url=original_url).first()
    if existing_url:
        short_code = existing_url.short_code
    else:
        # Generate unique short code
        short_code = generate_short_code()
        while URL.query.filter_by(short_code=short_code).first():
            short_code = generate_short_code()

        # Create new URL entry
        new_url = URL(
            original_url=original_url,
            short_code=short_code,
            created_at=datetime.utcnow()
        )
        db.session.add(new_url)
        db.session.commit()

    short_url = request.host_url + short_code
    return render_template('index.html', short_url=short_url, original_url=original_url)


@app.route('/<short_code>')
def redirect_to_original(short_code):
    url_entry = URL.query.filter_by(short_code=short_code).first()

    if url_entry:
        url_entry.clicks += 1
        url_entry.last_accessed = datetime.utcnow()
        db.session.commit()
        return redirect(url_entry.original_url)
    else:
        flash('Short URL not found', 'error')
        return redirect(url_for('index'))


@app.route('/stats/<short_code>')
def url_stats(short_code):
    url_entry = URL.query.filter_by(short_code=short_code).first()
    if url_entry:
        return render_template('stats.html', url=url_entry)
    else:
        flash('URL not found', 'error')
        return redirect(url_for('index'))


@app.route('/all-stats')
def all_stats():
    urls = URL.query.order_by(URL.created_at.desc()).all()
    return render_template('all_stats.html', urls=urls)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)
