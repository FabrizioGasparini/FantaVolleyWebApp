import json
from app.models.database import db
from app.models.user import User

class League(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    participants = db.Column(db.String, nullable=False)
    owner_token = db.Column(db.String(999), nullable=False)
    invite_code = db.Column(db.String(16), unique=True, nullable=False)
    current_auction = db.Column(db.String(100))
    starting_credits = db.Column(db.Integer, nullable=False)

    def __init__(self, name, participants, owner_token, invite_code, starting_credits):
        self.name = name
        self.invite_code = invite_code
        self.owner_token = owner_token
        self.participants = json.dumps(participants)
        self.current_auction = ""
        #self.starting_credits =

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def remove_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def to_json(self, show_tokens = False):
        if show_tokens == False:
            participants = []
            players = json.loads(self.participants)
            
            for player in players:
                participants.append(User.query.filter_by(token=player).first().id)

            return {
                'name': self.name,
                'participants': participants,
                'invite_code': self.invite_code
            }


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

    def set_auction(self, auction):
        self.current_auction = auction

        db.session.commit()