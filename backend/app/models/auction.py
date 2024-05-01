import json

from app.models.database import db
from app.models.user import User
from app.models.player import Player

class Auction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(16), unique=True, nullable=False)
    owner_token = db.Column(db.String(999), nullable=False)
    start_time = db.Column(db.DateTime) # unused
    end_time = db.Column(db.DateTime) # unused
    current_player_id = db.Column(db.Integer)
    current_bid = db.Column(db.String)
    status = db.Column(db.Integer, nullable=False)
    results = db.Column(db.String)
    selected_players = db.Column(db.String)

    def __init__(self, token, owner_token):
        self.token = token
        self.owner_token = owner_token
        self.current_bid = json.dumps({"player_id": 0, "bidder_username": "", "bidder_token": "", "bid": 0})
        self.status = AuctionStatus.WAITING
        self.results = json.dumps([])
        self.selected_players = json.dumps([])
        self.current_player_id = 0

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def remove_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def to_json(self, show_tokens = True, token = ""):
        current_bid = json.loads(self.current_bid)
        current_bid.update({"bidder_self": current_bid.get('bidder_token') == token})
        
        current_player = {}
        if self.current_player_id != 0:
            player = Player.query.filter_by(id=self.current_player_id).first()
            if player:
                current_player = player.to_json()

        selected_players = json.loads(self.selected_players)

        if show_tokens:
            return {
                'auction_token': self.token,
                'owner_token': self.owner_token,
                #'start_time': self.start_time, UNUSED
                #'end_time': self.end_time, UNUSED
                'current_player': current_player,
                'current_bid': current_bid,
                'status': self.status,
                'selected_players': selected_players
            }
        
        bid = {"player_id": 0, "bidder_username": "","bidder_id": 0, "bid": 0}

        bid["player_id"] = current_bid["player_id"]
        bid["bid"] = current_bid["bid"]
        user = User.query.filter_by(token=current_bid.get('bidder_token')).first()
        if user:
            bid["bidder_id"] = user.id
            bid["bidder_username"] = user.username


        return {
                'auction_token': self.token,
                #'start_time': self.start_time, UNUSED
                #'end_time': self.end_time, UNUSED
                'current_player': current_player,
                'current_bid': bid,
                'status': self.status,
                'selected_players': selected_players
            }


    def start(self, player_id):
        #self.start_time = datetime.utcnow() UNUSED
        #self.end_time = datetime.utcnow() + timedelta(seconds=10) UNUSED
        selected_players = json.loads(self.selected_players)

        if player_id not in selected_players:
            self.current_player_id = player_id

            current_bid = json.loads(self.current_bid)
            current_bid["player_id"] = player_id

            self.current_bid = json.dumps(current_bid)

            self.status = AuctionStatus.IN_PROGRESS
            db.session.commit()

            return True
        
        return False

    def end(self):
        self.status = AuctionStatus.CLOSED
        
        current_bid = json.loads(self.current_bid)
        print(current_bid)
        if current_bid["bidder_token"] != "":
            results = json.loads(self.results)
            selected_players = json.loads(self.selected_players)

            current_bid["player_id"] = self.current_player_id

            results.append(current_bid)
            selected_players.append(self.current_player_id)

            self.results = json.dumps(results)
            self.selected_players = json.dumps(selected_players)

            self.current_player_id = 0
            self.current_bid = json.dumps({"player_id": 0, "bidder_username": "", "bidder_token": "", "bid": 0})

            self.status = AuctionStatus.WAITING

            db.session.commit()

            return True
        else:
            self.current_player_id = 0
            self.status = AuctionStatus.WAITING

            db.session.commit()
            
            return True


    def bid(self, user_token):
        #if self.end_time > datetime.now(): UNUSED
        current_bid = json.loads(self.current_bid)
        if user_token != current_bid["bidder_token"]:

            current_bid["bid"] += 5
            current_bid["bidder_token"] = user_token
            current_bid["bidder_username"] = User.query.filter_by(token=user_token).first().username
            current_bid["player_id"] = self.current_player_id
    
            print(current_bid["player_id"])

            self.current_bid = json.dumps(current_bid)
    
            db.session.commit()

            return True
        
        return False

        #self.end_time = self.end_time + timedelta(seconds=5) UNUSED
  
    def get_participants(self):
        participants = []

        results = json.loads(self.results)
        for result in results:
            if not result["bidder_token"] in participants:
                participants.append(result["bidder_token"])   

        return participants    
    

    # UNUSED
    # def start_auction_timer(self):
    #     current_time = datetime.utcnow()
    #     time_difference = self.end_time - current_time
        
    #     end_time = self.end_time

    #     time.sleep(time_difference.total_seconds())

    #     self.check_auction_end(end_time)

    # def check_auction_end(self, previous_end_time):
    #     if self.end_time == previous_end_time:
    #         self.close()
    #     else:
    #         self.start_auction_timer()


class AuctionStatus:
    WAITING = 0
    IN_PROGRESS = 1
    CLOSED = 2
