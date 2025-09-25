from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)


class Cafe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    wifi = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f"<Cafe {self.name}>"
