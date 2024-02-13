import sqlite3

from flask import Blueprint, jsonify, request
from app.models.player import Player
from app.models.user import User
from flask_jwt_extended import create_access_token, decode_token
from jwt import decode

players = Blueprint('players', __name__)

@players.route("/read", methods=["GET", "POST"])
def get_players():
    data = request.get_json()

    players_db = Player.query.all()
    output = []

    if "role" in data:
        role = request.get_json()["role"]
        
        for player in players_db:
            if player.ruolo.lower() == role.lower():
                output.append(player.to_json())
    else:
        for player in players_db:
            output.append(player.to_json())


    return jsonify({
        "players": output
    }), 200


@players.route('/read/<int:player_id>', methods=["GET", "POST"])
def get_player_by_id(player_id):
    player = Player.query.filter_by(id=player_id).first()

    if player:
        return jsonify({
            "player": player.to_json()
        }), 200
    else:
        return jsonify({"error": {'code': 404, 'message': 'Player not found (invalid id)'}}), 404

@players.route("/teams/read", methods=["GET", "POST"])
def get_players_teams():
    data = request.get_json()

    players_db = Player.query.all()
    output = {}

    if "role" in data:
        role = request.get_json()["role"]
        for player in players_db:
            if player.ruolo.lower() == role.lower():
                if player.squadra in output:
                    output[player.squadra].append(player.to_json())
                else:
                    output[player.squadra] = [player.to_json()]
    else:
        for player in players_db:
            if player.squadra in output:
                output[player.squadra].append(player.to_json())
            else:
                output[player.squadra] = [player.to_json()]

    return jsonify({
        "teams": output
    }), 200


@players.route("/teams/read/<int:team_id>", methods=["GET", "POST"])
def get_players_teams_by_id(team_id):
    data = request.get_json()
    players_db = Player.query.all()

    team = Player.query.filter_by(squadra_id=team_id).all()

    if team:
        team_name = team[0].squadra

        teams = []
        if "role" in data:
            role = request.get_json()["role"]
            for player in team:
                if player.ruolo.lower() == role.lower():
                    teams.append(player.to_json())
        else:
            for player in team:
                teams.append(player.to_json())

        return jsonify({
            "team": {
                team_name: teams
            }
        }), 200
    else:
        return jsonify({"error": {'code': 404, 'message': 'Team not found (invalid id)'}}), 404


@players.post("/create")
def create_player():
    data = request.get_json()
    user_identity = decode_token(data["token"])
    
    user = User.query.filter_by(username=user_identity['sub']).first()
    if user:
        new_player = Player(data["nome"], data["ruolo"], data["squadra"], data["squadra_id"], data["numero"], data["nascita"], data["nazione"], data["altezza"], data["url_giocatore"], data["url_squadra"], data["url_foto"])
        new_player.save_to_db()


        return jsonify({
            "message": "Player created",
            "player": new_player.to_json()
        }), 201
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404        


@players.route("/delete", methods=["DELETE", "POST"])
def delete_player():
    data = request.get_json()
    user_identity = decode_token(data["token"])
    
    user = User.query.filter_by(username=user_identity['sub']).first()
    if user:

        player = Player.query.filter_by(id=data["player_id"]).first()
        if player:
            player.remove_from_db()

            return jsonify({
                "message": "Player deleted successfully",
            }), 210
        else:
            return jsonify({"error": {'code': 404, 'message': 'Player not found (invalid id)'}}), 404        
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404        



@players.route("/teams/delete", methods=["DELETE", "POST"])
def delete_team():
    data = request.get_json()
    user_identity = decode_token(data["token"])
    
    user = User.query.filter_by(username=user_identity['sub']).first()
    if user:

        player = Player.query.filter_by(squadra_id=data["team_id"]).all()
        if player:
            for plr in player:
                plr.remove_from_db()

            return jsonify({
                "message": "Team deleted successfully",
            }), 210
        else:
            return jsonify({"error": {'code': 404, 'message': 'Team not found (invalid id)'}}), 404        
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404   

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