import secrets, json
from flask import Blueprint, request, jsonify

from app.models.user import User
from app.models.player import Player
from app.models.league import League

from flask_jwt_extended import decode_token

leagues = Blueprint('leagues', __name__)

@leagues.post('/create')
def create_league():
    try: 
        data = request.get_json()
    except:
        return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
 
    if 'token' in data:
        try:
            user_identity = decode_token(data["token"])

            user = User.query.filter_by(username=user_identity["sub"]).first()
            if user:
                try:
                    invite_code = secrets.token_urlsafe(8)

                    if League.query.filter_by(name=data["name"]).first():
                        return jsonify({"error": {'code': 400, 'message': 'Invalid name (already used)'}}), 400

                    new_league = League(data["name"], [user.token], data["token"], invite_code)
                    new_league.save_to_db()

                    return jsonify({
                        "message": "League created",
                        "league": new_league.to_json(True)
                    }), 201
                except:
                    return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
                
        except:
            return jsonify({
                "error": 
                {
                    "code": 401,
                    "message": "Invalid token"
                }
            }), 401           

    
    return jsonify({
        "error": 
        {
            "code": 401,
            "message": "Invalid token"
        }
    }), 400

@leagues.post('/join')
def join_league():
    try: 
        data = request.get_json()
    except:
        return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
 
    if 'token' in data:
        try:
            user_identity = decode_token(data["token"])
            
            user = User.query.filter_by(username=user_identity['sub']).first()
            if user:
                try:
                    league = League.query.filter_by(invite_code=data["invite_code"]).first()

                    if league:
                        participants = json.loads(league.participants)
                        if user.token in participants:
                            return jsonify({"error": {'code': 400, 'message': 'League already joined'}}), 400

                        league.add_participant(user.token)

                        return jsonify({
                            "message": "League joined successfully",
                            "league": league.to_json(False)
                        }), 200
                    else:
                        return jsonify({"error": {'code': 404, 'message': 'League Not Found'}}), 404

                except:
                    return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
                
        except:
            return jsonify({
                "error": 
                {
                    "code": 401,
                    "message": "Invalid token"
                }
            }), 401           

    
    return jsonify({
        "error": 
        {
            "code": 401,
            "message": "Invalid token"
        }
    }), 400


@leagues.route("/delete", methods=["DELETE", "POST"])
def delete_league():
    try: 
        data = request.get_json()
    except:
        return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
 
    if 'token' in data:
        user_identity = decode_token(data["token"])
        try:
            user = User.query.filter_by(username=user_identity['sub']).first()
            if user:
                league = League.query.filter_by(owner_token=user.token).first()
                if league:
                    league.remove_from_db()

                    return jsonify({
                        "message": "League deleted successfully",
                    }), 210
                else:
                    return jsonify({
                        "error":
                        {
                            "code": 404,
                            "error": "League Not Found"
                        }
                    }), 404

        except:
            return jsonify({
                "error": 
                {
                    "code": 401,
                    "message": "Invalid token"
                }
            }), 401           

    
    return jsonify({
        "error": 
        {
            "code": 401,
            "message": "Invalid token"
        }
    }), 401


@leagues.post('/read')
def read_league():
    try: 
        data = request.get_json()
    except:
        return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
 
    if 'token' in data:
        try:
            user_identity = decode_token(data["token"])
            
            user = User.query.filter_by(username=user_identity['sub']).first()
            if user:
                try:
                    league = League.query.filter_by(invite_code=data["invite_code"]).first()

                    if league:
                        participants = json.loads(league.participants)

                        if user.token in participants:
                            if user.token == league.owner_token:
                                return jsonify({
                                    "league": league.to_json(True)
                                }), 200
                            else:
                                return jsonify({
                                    "league": league.to_json(False)
                                }), 200

                        return jsonify({"error": {'code': 401, 'message': 'User Not in this league'}}), 401

                    else:
                        return jsonify({"error": {'code': 404, 'message': 'League Not Found'}}), 404

                except:
                    return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
            else:
                return jsonify({
                "error": 
                {
                    "code": 401,
                    "message": "Invalid token"
                }
            }), 401  
        except:
            return jsonify({
                "error": 
                {
                    "code": 401,
                    "message": "Invalid token"
                }
            }), 401           
    else:
        return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400