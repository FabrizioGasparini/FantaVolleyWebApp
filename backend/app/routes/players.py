import sqlite3

from flask import Blueprint, jsonify, request
from app.models.player import Player
from app.models.user import User
from flask_jwt_extended import create_access_token, decode_token
from jwt import decode

players = Blueprint('players', __name__)

@players.route("/read/", methods=["GET", "POST"])
def get_players():
    players_db = Player.query.all()


    output = []
    try:
        role = request.get_json()["ruolo"]
        for player in players_db:
            if player.ruolo.lower() == role.lower():
                output.append(player.to_json())
    except:
        for player in players_db:
            output.append(player.to_json())


    return jsonify({
        "players": output
    }), 200


@players.route('/read/<int:player_id>')
def get_player_by_id(player_id):
    player = Player.query.filter_by(id=player_id).first()

    if not player:
        return jsonify({
                "error": 
                {
                    "code": 400,
                    "message": "Invalid id"
                }
            }), 400 

    return jsonify({
        "player": player.to_json()
    }), 200

@players.route("/read/teams", methods=["GET", "POST"])
def get_players_teams():
    players_db = Player.query.all()

    output = {}

    try:
        role = request.get_json()["ruolo"]
        for player in players_db:
            if player.ruolo.lower() == role.lower():
                if player.squadra in output:
                    output[player.squadra].append(player.to_json())
                else:
                    output[player.squadra] = [player.to_json()]
    except:
        for player in players_db:
            if player.squadra in output:
                output[player.squadra].append(player.to_json())
            else:
                output[player.squadra] = [player.to_json()]

    return jsonify({
        "teams": output
    }), 200


@players.route("/read/teams/<int:team_id>")
def get_players_teams_by_id(team_id):
    team = Player.query.filter_by(squadra_id = team_id).all()

    if not team:
        return jsonify({
                "error": 
                {
                    "code": 400,
                    "message": "Invalid id"
                }
            }), 400 

    team_name = team[0].squadra
    teams = []

    for team_db in team:
        teams.append(team_db.to_json())

    return jsonify({
        "team": {
            team_name: teams
        }
    }), 200


@players.post("/create/player")
def create_player():
    try: 
        data = request.get_json()
    except:
        return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
 
    if 'token' in data:
        try:
            user_identity = decode(data["token"], 'fantavolleyadmin8!', algorithms='HS256')
            print(user_identity)
            
            user = User.query.filter_by(username=user_identity['sub'], role=user_identity['ruolo']).first()
            if user:
                try:
                    new_player = Player(data["nome"], data["ruolo"], data["squadra"], data["squadra_id"], data["numero"], data["nascita"], data["nazione"], data["altezza"], data["url_giocatore"], data["url_squadra"], data["url_foto"])
                    new_player.save_to_db()


                    return jsonify({
                        "message": "Player created",
                        "player": new_player.to_json()
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

@players.route("/delete/player", methods=["DELETE", "POST"])
def delete_player():
    try: 
        data = request.get_json()
    except:
        return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
 
    if 'token' in data:
        user_identity = decode(data["token"], 'fantavolleyadmin8!', algorithms='HS256')
        try:
            user = User.query.filter_by(username=user_identity['sub'], role=user_identity['ruolo']).first()
            if user:
                try:
                    player = Player.query.filter_by(id=data["id"]).first()
                except:
                    return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400

                if player:
                    player.remove_from_db()

                    return jsonify({
                        "message": "Player deleted successfully",
                    }), 210
                else:
                    return jsonify({
                        "error":
                        {
                            "code": 400,
                            "error": "Invalid id"
                        }
                    }), 400

                
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


@players.route("/delete/team", methods=["DELETE", "POST"])
def delete_team():
    try: 
        data = request.get_json()
    except:
        return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
 
    if 'token' in data:
        user_identity = decode(data["token"], 'fantavolleyadmin8!', algorithms='HS256')
        try:
            user = User.query.filter_by(username=user_identity['sub'], role=user_identity['ruolo']).first()
            if user:
                try:
                    player = Player.query.filter_by(squadra_id=data["squadra_id"]).all()
                except:
                    return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400

                if player:
                    for plr in player:
                        plr.remove_from_db()

                    return jsonify({
                        "message": "Team deleted successfully",
                    }), 210
                else:
                    return jsonify({
                        "error":
                        {
                            "code": 400,
                            "error": "Invalid id"
                        }
                    }), 400

                
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

# def get_players_db():
#     conn = None
#     try:
#         conn = sqlite3.connect("app/data/players.db")
#     except:
#         print("Errore")

#     cur = conn.cursor()
#     cur.execute("SELECT * FROM giocatori")

#     rows = cur.fetchall()

#     return rows

# players_db = get_players_db()

#     for plr in players_db:
#         print(f"Numero: {int(plr[3])}")
#         new_player = Player(plr[0], plr[1], plr[2], int(plr[3]), plr[4], plr[5], plr[6], plr[7], plr[8], plr[9], plr[10])
#         new_player.save_to_db()