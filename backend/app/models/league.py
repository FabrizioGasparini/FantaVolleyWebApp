import json
from app.models.database import db
from app.models.user import User

class League(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    participants = db.Column(db.String, nullable=False)
    owner_token = db.Column(db.String, nullable=False)
    invite_code = db.Column(db.String, unique=True, nullable=False)
    current_auction = db.Column(db.String, nullable=False)
    starting_credits = db.Column(db.Integer, nullable=False)
    roasters = db.Column(db.String, nullable=False)

    def __init__(self, name, participants, owner_token, invite_code, starting_credits):
        self.name = name
        self.invite_code = invite_code
        self.owner_token = owner_token
        self.participants = json.dumps(participants)
        self.current_auction = ""
        self.starting_credits = starting_credits
        self.roasters = json.dumps([])

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

    def add_roaster(self, token, roaster):
        roasters = json.loads(self.roasters)

        for old_roaster in roasters:
            if old_roaster["token"] == token:
                old_roaster['roaster'] += roaster

                print(old_roaster['roaster'])

                self.roasters = json.dumps(roasters)
                db.session.commit()
                return True
                    
        roasters.append({"token": token, "roaster": roaster})

        self.roasters = json.dumps(roasters)
        db.session.commit()
        return True

    def remove_roaster(self, token):
        roasters = json.loads(self.roasters)

        for roaster in roasters:
            if roaster.token == token:
                roasters.remove(roaster)
                self.roasters = json.dumps(roasters)

                db.session.commit()

                return True
            
        return False
