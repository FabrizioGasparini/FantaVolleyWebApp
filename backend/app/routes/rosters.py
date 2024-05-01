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
def update_court():
    data = request.get_json()
    user_identity = get_jwt_identity()

    user = User.query.filter_by(username=user_identity).first()
    if user:

        league = League.query.filter_by(invite_code=data['invite_code']).first()
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
                    roster_player = RosterPlayer(player['player_id'], player['value'], player['court_position'], player['captain'])
                    roster_player.save_to_db()

                    players.append(roster_player.to_json())

                roster.players = json.dumps(players)
                roster.save_to_db()

                return jsonify({
                    "message": "Roster updated successfully",
                    "roster": roster.to_json()
                }), 201
            
            else:

                players = []
                for player in data['players']:
                    roster_player = RosterPlayer(player['player_id'], player['value'], player['court_position'], player['captain'])
                    roster_player.save_to_db()

                    players.append(roster_player.to_json())

                roster = Roster(data['invite_code'], user.token, players)
                roster.save_to_db()

                return jsonify({
                    "message": "Roster created successfully",
                    "roster": roster.to_json()
                }), 201
        else:
            return jsonify({"error": {'code': 400, 'message': 'League not found (invalid code)'}}), 400
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404
    

@rosters.post('/update/<int:court_position>')
@jwt_required()
def update_court_position(court_position):
    data = request.get_json()
    user_identity = get_jwt_identity()

    if court_position < -1 or court_position > 14:
        return jsonify({"error": {'code': 404, 'message': 'Invalid or missing parameter (invalid court position)'}}), 404

    user = User.query.filter_by(username=user_identity).first()
    if user:

        league = League.query.filter_by(invite_code=data['invite_code']).first()
        if league:
            
            roster = Roster.query.filter_by(league_code=league.invite_code, token=user.token).first()

            if roster:
                roster_player = RosterPlayer.query.filter_by(player_id=data["player_id"]).first()
                old_position = roster_player.court_position
                
                old_roster_player = RosterPlayer.query.filter_by(court_position=court_position).first()
                roster_player.court_position = court_position

                if old_roster_player:
                    old_roster_player.court_position = old_position
                    old_roster_player.save_to_db()



                print(roster_player.court_position)
                roster_player.save_to_db()

                players = []
                for player in json.loads(roster.players):
                    if player['player_id'] == roster_player.player_id:
                        players.append(roster_player.to_json())
                    else:
                        players.append(player)

                roster.players = json.dumps(players)
                roster.save_to_db()
                
                return jsonify({
                    "message": "Roster updated successfully",
                    "roster": roster.to_json()
                }), 201
            
            else:
                return jsonify({"error": {'code': 400, 'message': 'Roster not found'}}), 400
        else:
            return jsonify({"error": {'code': 400, 'message': 'League not found (invalid code)'}}), 400
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404
    


@rosters.post('/read')
@jwt_required()
def read_auction():
    data = request.get_json()
    user_identity = get_jwt_identity()

    user = User.query.filter_by(username=user_identity).first()
    if user:
        league = League.query.filter_by(invite_code=data["invite_code"]).first()
        if league:

            roster = Roster.query.filter_by(token=user.token).first()

            if roster:
                return jsonify({
                    "roster": roster.to_json()
                }), 200
            else:
                new_roster = Roster(data["invite_code"], user.token, [])
                new_roster.save_to_db()

                return jsonify({
                    "roster": roster.to_json()
                }), 200

        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404


@rosters.get('/read/<string:invite_code>')
@jwt_required()
def read_auction_code(invite_code):
    user_identity = get_jwt_identity()

    user = User.query.filter_by(username=user_identity).first()
    if user:
        league = League.query.filter_by(invite_code=invite_code).first()
        if league:

            roster = Roster.query.filter_by(token=user.token).first()

            if roster:
                return jsonify({
                    "roster": roster.to_json()
                }), 200
            else:
                new_roster = Roster(invite_code, user.token, [])
                new_roster.save_to_db()

                return jsonify({
                    "roster": roster.to_json()
                }), 200

        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404