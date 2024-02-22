import secrets, json
from flask import Blueprint, request, jsonify

from app.models.user import User
from app.models.player import Player
from app.models.league import League
from app.models.auction import Auction, AuctionStatus

from flask_jwt_extended import create_access_token, decode_token, jwt_required, get_jwt_identity
from flask_jwt_extended.exceptions import JWTExtendedException

auctions = Blueprint('auctions', __name__)


@auctions.post('/create')
@jwt_required()
def create_auction():
    user_identity = get_jwt_identity()

    user = User.query.filter_by(username=user_identity).first()
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


@auctions.post('/start')
@jwt_required()
def start_auction():
    data = request.get_json()
    user_identity = get_jwt_identity()

    user = User.query.filter_by(username=user_identity).first()
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
    

@auctions.post('/end')
@jwt_required()
def end_auction():
    user_identity = get_jwt_identity()

    user = User.query.filter_by(username=user_identity).first()
    if user:

        league = League.query.filter_by(owner_token=user.token).first()
        if league:

            auction = Auction.query.filter_by(token=league.current_auction).first()
            if auction:
                if auction.status == AuctionStatus.IN_PROGRESS:
                    end = auction.end()

                    if end:
                        return jsonify({
                            "message": "Auction ended",
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


@auctions.post('/bid')
@jwt_required()
def bid_auction():
    data = request.get_json()
    user_identity = get_jwt_identity()

    user = User.query.filter_by(username=user_identity).first()
    if user:

        league = League.query.filter_by(invite_code=data["invite_code"]).first()
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
    

@auctions.get('/read')
def read_auction():
    data = request.get_json()

    league = League.query.filter_by(invite_code=data["invite_code"]).first()
    if league:

        auction = Auction.query.filter_by(token=league.current_auction).first()
        if auction:
            return jsonify({
                "auction": auction.to_json()
            }), 200
        else:
            return jsonify({"error": {'code': 404, 'message': 'Auction not found'}}), 404
    else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404
    

@auctions.post('/close')
@jwt_required()
def close_auction():
    user_identity = get_jwt_identity()

    user = User.query.filter_by(username=user_identity).first()
    if user:

        league = League.query.filter_by(owner_token=user.token).first()
        if league:

            auction = Auction.query.filter_by(token=league.current_auction).first()
            if auction:
                if auction.status != AuctionStatus.IN_PROGRESS:
                    auction_results = json.loads(auction.results)
                    auction_participants = auction.get_participants()

                    auction.remove_from_db()

                    league.set_auction("")
                    
                    for participant in auction_participants:
                        roaster = []
                        for result in auction_results:
                            if result["bidder_token"] == participant:
                                roaster.append({"player_id": result["player_id"], "value": result["bid"]})
                                auction_results.remove(result)

                        league.add_roaster(participant, roaster)

                    return jsonify({
                        "message": "Auction closed"
                    }), 210
                else:
                    return jsonify({"error": {'code': 400, 'message': 'Auction is still in progress'}}), 400
            else:
                return jsonify({"error": {'code': 404, 'message': 'Auction not found'}}), 404
        else:
            return jsonify({"error": {'code': 404, 'message': 'League not found'}}), 404
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404  