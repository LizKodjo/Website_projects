from datetime import datetime
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class URL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(500), nullable=False)
    short_code = db.Column(db.String(10), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    clicks = db.Column(db.Integer, default=0)
    last_accessed = db.Column(db.DateTime)

    def __repr__(self):
        return f'<URL {self.original_url} -> {self.short_code}>'
