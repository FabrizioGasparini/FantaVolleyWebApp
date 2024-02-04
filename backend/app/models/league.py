import json
from app.models.database import db

class League(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    participants = db.Column(db.String, nullable=False)
    owner_token = db.Column(db.String(999), nullable=False)
    invite_code = db.Column(db.String(16), unique=True, nullable=False)

    def __init__(self, name, participants, owner_token, invite_code):
        self.name = name
        self.invite_code = invite_code
        self.owner_token = owner_token
        self.participants = json.dumps(participants)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def remove_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def to_json(self):
        return {
            'name': self.name,
            'owner_token': self.owner_token,
            'participants': json.loads(self.participants),
            'invite_code': self.invite_code
        }
    
    def add_participant(self, token):
        participants = json.loads(self.participants)
        participants.append(token)

        self.participants = json.dumps(participants)

        db.session.commit()