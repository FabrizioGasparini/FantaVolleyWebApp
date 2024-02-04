import sqlite3 
from app.models.database import db

class ExpiredToken(db.Model):
    token = db.Column(db.String(999), unique=True, nullable=False)
    _ = db.Column(db.Integer, primary_key=True)

    def __init__(self, token):
        self.token = token

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()