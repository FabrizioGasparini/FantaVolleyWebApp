import sqlite3 
from app.models.database import db
from app.models.expired_token import ExpiredToken

class RosterPlayer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, nullable=False)
    value = db.Column(db.Integer, nullable=False)
    points = db.Column(db.Integer, nullable=False)
    court_position = db.Column(db.Integer, nullable=False)
    captain = db.Column(db.Boolean, nullable=False)
    injured = db.Column(db.Boolean, nullable=False)
    traded = db.Column(db.Boolean, nullable=False)

    def __init__(self, player_id, value, court_position, captain):
        self.player_id = player_id
        self.value = value
        self.court_position = court_position
        self.captain = captain
        self.points = 0
        self.injured = False
        self.traded = False

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def remove_from_db(self):
        db.session.delete(self)
        db.session.commit()
    

    def to_json(self):
        return {
            'player_id': self.player_id,
            'value': self.value,
            'points': self.points,
            'court_position': self.court_position,
            'captain': self.captain,
            'injured': self.injured,
            'traded': self.traded
        }
