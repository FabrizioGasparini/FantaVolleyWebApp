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
    rosters = db.Column(db.String, nullable=False)

    def __init__(self, name, participants, owner_token, invite_code, starting_credits):
        self.name = name
        self.invite_code = invite_code
        self.owner_token = owner_token
        self.participants = json.dumps(participants)
        self.current_auction = ""
        self.starting_credits = starting_credits
        self.rosters = json.dumps([])

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def remove_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def to_json(self, show_tokens = False):
        participants = []
        players = json.loads(self.participants)
        if show_tokens == False:
            
            for player in players:
                participants.append({"id": User.query.filter_by(token=player["token"]).first().id, "credits": player["credits"]})

            return {
                'name': self.name,
                'participants': participants,
                'invite_code': self.invite_code
            }

        roster_players = []
        rosters = json.loads(self.rosters)
        for item in rosters:
            print(item)
            for player in item['roster']:
                roster_players.append(player['player_id'])

        return {
            'name': self.name,
            'owner_token': self.owner_token,
            'participants': json.loads(self.participants),
            'invite_code': self.invite_code,
            'current_auction': self.current_auction,
            'roster_players': roster_players,
            'rosters': rosters
        }
    
    def add_participant(self, token):
        participants = json.loads(self.participants)
        participants.append({"token":token, "credits": self.starting_credits})

        self.participants = json.dumps(participants)

        self.save_to_db()

    def remove_participant(self, token):
        participants = json.loads(self.participants)
        filtered_array = [item for item in participants if item.get("token") != token]
        participants = filtered_array

        self.participants = json.dumps(participants)

        self.save_to_db()

    def set_credits(self, token, credits):
        participants = json.loads(self.participants)
        for item in participants:
            if item.get("token") == token:
                item["credits"] = credits

        self.participants = json.dumps(participants)
        self.save_to_db()

    def set_auction(self, auction):
        self.current_auction = auction

        self.save_to_db()

    def add_roster(self, token, roster):
        rosters = json.loads(self.rosters)

        for old_roster in rosters:
            if old_roster["token"] == token:
                old_roster['roster'] += roster

                print(old_roster['roster'])

                self.rosters = json.dumps(rosters)
                self.save_to_db()
                return True
                    
        rosters.append({"token": token, "roster": roster})

        self.rosters = json.dumps(rosters)
        self.save_to_db()
        return True

    def remove_roster(self, token):
        rosters = json.loads(self.rosters)

        for roster in rosters:
            if roster.token == token:
                rosters.remove(roster)
                self.rosters = json.dumps(rosters)

                self.save_to_db()

                return True
            
        return False
