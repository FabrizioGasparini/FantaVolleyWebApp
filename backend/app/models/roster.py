import json
from app.models.database import db

class Roster(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    league_code = db.Column(db.String, nullable=False)
    token = db.Column(db.String, nullable=False)
    players = db.Column(db.String, nullable=False)

    def __init__(self, league_code, token, players):
        self.league_code = league_code
        self.token = token
        self.players = json.dumps(players)
        self.list = json.dumps(players)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def remove_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def to_json(self):
        return {
            'id': self.id,
            'league_code': self.league_code,
            'token': self.token,
            'players': json.loads(self.players)
        }
    