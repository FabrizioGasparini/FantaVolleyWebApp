import secrets, json
from flask import Blueprint, request, jsonify

from app.models.user import User
from app.models.roster_player import RosterPlayer
from app.models.roster import Roster
from app.models.league import League

from flask_jwt_extended import decode_token, get_jwt_identity, jwt_required

rosters = Blueprint('rosters', __name__)


@rosters.post('/update')
@jwt_required()
def create_league():
    data = request.get_json()
    user_identity = get_jwt_identity()

    user = User.query.filter_by(username=user_identity).first()
    if user:

        league = League.query.filter_by(invite_code=data['league_code']).first()
        if league:
            
            roster = Roster.query.filter_by(league_code=league.invite_code, token=user.token).first()

            if roster:

                for player in json.loads(roster.players):
                    print(player)
                    roster_player = RosterPlayer.query.filter_by(roster_id=player['roster_id']).first()
                    roster_player.remove_from_db()

                roster.players = json.dumps([])
                roster.save_to_db()

                players = []
                for player in data['players']:
                    roster_player = RosterPlayer(player['player_id'], player['value'], player['position'], player['captain'])
                    roster_player.save_to_db()

                    players.append(roster_player.to_json())

                roster.players = json.dumps(players)
                roster.save_to_db()

                return jsonify({
                    "message": "Roaster updated successfully",
                    "roster": roster.to_json()
                }), 201
            
            else:

                players = []
                for player in data['players']:
                    roster_player = RosterPlayer(player['player_id'], player['value'], player['position'], player['captain'])
                    roster_player.save_to_db()

                    players.append(roster_player.to_json())

                roster = Roster(data['league_code'], user.token, players)
                roster.save_to_db()

                return jsonify({
                    "message": "Roaster created successfully",
                    "roster": roster.to_json()
                }), 201
        else:
            return jsonify({"error": {'code': 400, 'message': 'League not found (invalid code)'}}), 400
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404

@rosters.get('/read')
@jwt_required()
def read_auction():
    data = request.get_json()
    user_identity = get_jwt_identity()

    user = User.query.filter_by(username=user_identity).first()
    if user:
        league = League.query.filter_by(invite_code=data["league_code"]).first()
        if league:

            roster = Roster.query.filter_by(token=user.token).first()

            if roster:
                return jsonify({
                    "roster": roster.to_json()
                }), 200
            
            else:
                return jsonify({"error": {'code': 404, 'message': 'Roster not found'}}), 404
        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404