import secrets, json
from flask import Blueprint, request, jsonify

from app.models.user import User
from app.models.player import Player
from app.models.league import League
from app.models.auction import Auction, AuctionStatus

from flask_jwt_extended import decode_token, create_access_token
from flask_jwt_extended.exceptions import JWTExtendedException

auctions = Blueprint('auctions', __name__)

@auctions.post('/create')
def create_auction():
    data = request.get_json()
    user_identity = decode_token(data["token"])

    user = User.query.filter_by(username=user_identity["sub"]).first()
    if user:

        league = League.query.filter_by(owner_token=user.token).first()
        if league:
            if league.current_auction == "":
                auction_token = secrets.token_urlsafe(16)

                auction = Auction(auction_token, user.token)
                auction.save_to_db()

                league.set_auction(auction_token)

                return jsonify({
                    "message": "Auction created",
                    "auction": auction.to_json()
                }), 201
            else:
                return jsonify({"error": {'code': 404, 'message': 'Auction already created'}}), 404
        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404  
    


@auctions.post('/delete')
def delete_auction():
    data = request.get_json()
    user_identity = decode_token(data["token"])

    user = User.query.filter_by(username=user_identity["sub"]).first()
    if user:

        league = League.query.filter_by(owner_token=user.token).first()
        if league:

            auction = Auction.query.filter_by(token=league.current_auction).first()
            if auction:
                auction.remove_from_db()

                league.set_auction("")

                return jsonify({
                    "message": "Auction deleted"
                }), 210
            else:
                return jsonify({"error": {'code': 404, 'message': 'Auction not found'}}), 404
        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404  


@auctions.post('/start')
def start_auction():
    data = request.get_json()
    user_identity = decode_token(data["token"])

    user = User.query.filter_by(username=user_identity["sub"]).first()
    if user:

        league = League.query.filter_by(owner_token=user.token).first()
        if league:

            player = Player.query.filter_by(id=data["player_id"]).first()
            if player:

                auction = Auction.query.filter_by(token=league.current_auction).first()
                if auction:
                    if auction.status == AuctionStatus.WAITING:
                        start = auction.start(player.id)

                        if start:
                            return jsonify({
                                "message": "Auction started", 
                                "auction": auction.to_json()
                            }), 201
                        else:
                            return jsonify({"error": {'code': 400, 'message': 'User already taken'}}), 400
                    else:
                        return jsonify({"error": {'code': 400, 'message': 'Auction in progress'}}), 400
                else:
                    return jsonify({"error": {'code': 404, 'message': 'Auction not found'}}), 404
            else:
                return jsonify({"error": {'code': 404, 'message': 'Player not found'}}), 404
        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404  
    
                


@auctions.post('/bid')
def bid_auction():
    data = request.get_json()
    user_identity = decode_token(data["token"])

    user = User.query.filter_by(username=user_identity["sub"]).first()
    if user:

        league = League.query.filter_by(owner_token=user.token).first()
        if league:

            auction = Auction.query.filter_by(token=league.current_auction).first()
            if auction:
                if auction.status == AuctionStatus.IN_PROGRESS:
                    bid = auction.bid(user.token)
                        
                    if bid:
                        return jsonify({
                            "message": "Bid placed",
                            "auction": auction.to_json(False)
                        }), 201
                    else:
                        return jsonify({"error": {'code': 400, 'message': 'User bet is already the highest'}}), 400
                
                elif auction.status == AuctionStatus.CLOSED:
                    return jsonify({"error": {'code': 400, 'message': 'Auction already ended'}}), 400
                else:
                    return jsonify({"error": {'code': 400, 'message': 'Auction not started yet'}}), 400
                
            else:
                return jsonify({"error": {'code': 404, 'message': 'Auction not found'}}), 404
        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404  
    


@auctions.post('/close')
def close_auction():
    data = request.get_json()
    user_identity = decode_token(data["token"])

    user = User.query.filter_by(username=user_identity["sub"]).first()
    if user:

        league = League.query.filter_by(owner_token=user.token).first()
        if league:

            auction = Auction.query.filter_by(token=league.current_auction).first()
            if auction:
                if auction.status == AuctionStatus.IN_PROGRESS:
                    close = auction.close()

                    if close:
                        return jsonify({
                            "message": "Auction closed",
                            "auction": auction.to_json()
                        }), 201
                    else:
                        return jsonify({"error": {'code': 400, 'message': 'No user placed a bid'}}), 400
                    
                elif auction.status == AuctionStatus.CLOSED:
                    return jsonify({"error": {'code': 400, 'message': 'Auction already ended'}}), 400
                else:
                    return jsonify({"error": {'code': 400, 'message': 'Auction not started yet'}}), 400
                
            else:
                return jsonify({"error": {'code': 404, 'message': 'Auction not found'}}), 404
        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404  
    

@auctions.post('/get')
def get_auction():
    data = request.get_json()

    auction = Auction.query.filter_by(token=data["auction_token"]).first()
    if auction:
        if auction.status == AuctionStatus.IN_PROGRESS:
            if "token" in data:
                league = League.query.filter_by(owner_token=data["token"]).first()

                if league:
                    if league.current_auction == data["auction_token"]:
                        return jsonify({
                            "message": "Auction closed",
                            "auction": auction.to_json()
                        }), 201
                    
            return jsonify({
                "message": "Auction closed",
                "auction": auction.to_json(False)
            }), 201
        elif auction.status == AuctionStatus.CLOSED:
            return jsonify({"error": {'code': 400, 'message': 'Auction already ended'}}), 400
        else:
            return jsonify({"error": {'code': 400, 'message': 'Auction not started yet'}}), 400
        
    else:
        return jsonify({"error": {'code': 404, 'message': 'Auction not found'}}), 404