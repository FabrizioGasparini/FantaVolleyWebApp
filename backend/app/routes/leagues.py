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
            
            new_league = League(data["name"], [user.token], user.token, invite_code, 0)
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


@leagues.get('/read/<string:invite_code>')
@jwt_required()
def read_league(invite_code):
    user_identity = get_jwt_identity()
    user = User.query.filter_by(username=user_identity).first()

    league = League.query.filter_by(invite_code=invite_code).first()
         
    if league:
        participants = json.loads(league.participants)

        if user.token in participants:
            return jsonify({
                "league": league.to_json()
            }), 200
        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found (invalid user token)'}}), 404    
    else:
        return jsonify({"error": {'code': 404, 'message': 'League not found (invalid invite code)'}}), 404 

@leagues.post('/read')
@jwt_required()
def read_league_post():
    user_identity = get_jwt_identity()
    user = User.query.filter_by(username=user_identity).first()
    
    if user:        
        leagues = League.query.all()
         
        output_leagues = []
        for league in leagues:
            participants = json.loads(league.participants)
            
            if user.token in participants:
                output_leagues.append(league.to_json(user.token == league.owner_token))

        return jsonify({
            "leagues": output_leagues
        }), 200

    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404 
    
@leagues.get('/read')
def read_league_get():
    leagues = League.query.all()

    output_leagues = []
    for league in leagues:
        output_leagues.append(league.to_json(False))

    return jsonify({
        "leagues": output_leagues
    }), 200



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
            return jsonify({"error": {'code': 404, 'message': 'League not found (invalid invite code or token)'}}), 404       
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404 
    

@leagues.post('/leave')
@jwt_required()
def leave_league():
    data = request.get_json()
    user_identity = get_jwt_identity()
    
    user = User.query.filter_by(username=user_identity).first()
    if user:
        
        league = League.query.filter_by(invite_code=data["invite_code"]).first()
        if league:
            
            participants = json.loads(league.participants)
            if user.token in participants:
                league.remove_participant(user.token)

                return jsonify({
                    "message": "League left successfully"
                }), 200
            else:
                return jsonify({"error": {'code': 400, 'message': 'User not in league'}}), 400
        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404       
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404 