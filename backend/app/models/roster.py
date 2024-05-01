import json
from app.models.database import db
from app.models.player import Player

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
        players = json.loads(self.players)
        roles = {"palleggiatore": 2, "schiacciatore": 4, "opposto": 2, "centrale": 4, "libero": 2}

        for item in players:
            player = Player.query.filter_by(id=item.get("player_id")).first()
            if player:
                role = str(player.ruolo).lower()
                roles[role] -= 1

        print(roles)

        return {
            'id': self.id,
            'league_code': self.league_code,
            'token': self.token,
            'players': players,
            'available_roles': roles
        }
    
    def add_player(self, player):
        players = json.loads(self.players)
        players.append(player.to_json())

        self.players = json.dumps(players)
        self.save_to_db()

    def get_available_position(self, role):
        schiacciatore_positions = [2, 5, 10, 11]
        opposto_positions = [4, 8]
        centrale_positions = [3, 6, 12, 13]
        palleggiatore_positions = [1, 9]
        libero_positions = [7, 14]

        players = json.loads(self.players)
        occupied_positions = []
        for player in players:
            if player.role == role:
                occupied_positions.append(player.court_position)

        possibile_positions = []
        if role == "Schiacciatore":
            possibile_positions = [item for item in schiacciatore_positions if item not in occupied_positions]
        elif role == "Opposto":
            possibile_positions = [item for item in opposto_positions if item not in occupied_positions]
        elif role == "Centrale":
            possibile_positions = [item for item in centrale_positions if item not in occupied_positions]
        elif role == "Palleggiatore":
            possibile_positions = [item for item in palleggiatore_positions if item not in occupied_positions]
        else:
            possibile_positions = [item for item in libero_positions if item not in occupied_positions]

        return possibile_positions[0]