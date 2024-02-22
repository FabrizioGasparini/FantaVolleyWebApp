import secrets, json
from flask import Blueprint, request, jsonify

from app.models.user import User
from app.models.player import Player
from app.models.league import League

from flask_jwt_extended import decode_token, get_jwt_identity, jwt_required

leagues = Blueprint('leagues', __name__)


@leagues.post('/create')
@jwt_required()
def create_league():
    data = request.get_json()
    user_identity = get_jwt_identity()

    user = User.query.filter_by(username=user_identity).first()
    if user:

        is_name_used = League.query.filter_by(name=data["name"]).first()
        if not is_name_used:
            invite_code = secrets.token_urlsafe(8)
            
            new_league = League(data["name"], [user.token], data["token"], invite_code, 0)
            new_league.save_to_db()

            return jsonify({
                "message": "League created",
                "league": new_league.to_json(True)
            }), 201
        else:
            return jsonify({"error": {'code': 400, 'message': 'Invalid name (already used)'}}), 400
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404


@leagues.post('/join')
@jwt_required()
def join_league():
    data = request.get_json()
    user_identity = get_jwt_identity()
    
    user = User.query.filter_by(username=user_identity).first()
    if user:
        
        league = League.query.filter_by(invite_code=data["invite_code"]).first()
        if league:
            
            participants = json.loads(league.participants)
            if user.token not in participants:
                league.add_participant(user.token)

                return jsonify({
                    "message": "League joined successfully",
                    "league": league.to_json(False)
                }), 200
            else:
                return jsonify({"error": {'code': 400, 'message': 'League already joined'}}), 400
        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404       
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404 


@leagues.post('/read')
@jwt_required()
def read_league():
    data = request.get_json()
    user_identity = get_jwt_identity()
    
    user = User.query.filter_by(username=user_identity).first()
    if user:
        
        league = League.query.filter_by(invite_code=data["invite_code"]).first()
        if league:

            participants = json.loads(league.participants)
            if user.token in participants:
                return jsonify({
                    "league": league.to_json(user.token == league.owner_token)
                }), 200
            else:
                return jsonify({"error": {'code': 401, 'message': 'User not in this league'}}), 401
        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404 


@leagues.route("/delete", methods=["DELETE", "POST"])
@jwt_required()
def delete_league():
    data = request.get_json()
    user_identity = get_jwt_identity()
    
    user = User.query.filter_by(username=user_identity).first()
    if user:
        
        league = League.query.filter_by(owner_token=user.token, invite_code=data["invite_code"]).first()
        if league:
            league.remove_from_db()
            return jsonify({
                "message": "League deleted successfully",
            }), 210
        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404       
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404 