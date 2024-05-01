from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO, emit, send
from app.error_handler import error_handlers_bp

from app.models.database import db
from app.routes.websocket import socketio

app = Flask(__name__)
CORS(app, supports_credentials=True, origins="*")

app.config['SECRET_KEY'] = "hello"

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config['JWT_SECRET_KEY'] = 'pVFb6dPjIAUk2CqFu3y9WAdCplU4uONq' # Stringa Generata Casualmente
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = False

app.register_blueprint(error_handlers_bp)

db.app = app
db.init_app(app)

jwt = JWTManager(app)

from app.routes.auth import auth
app.register_blueprint(auth, url_prefix='/api/v1/auth')

from app.routes.players import players
app.register_blueprint(players, url_prefix='/api/v1/players')

from app.routes.leagues import leagues
app.register_blueprint(leagues, url_prefix='/api/v1/leagues')

from app.routes.auctions import auctions
app.register_blueprint(auctions, url_prefix='/api/v1/auctions')

socketio.app = app
socketio.init_app(app)

from app.routes.rosters import rosters
app.register_blueprint(rosters, url_prefix='/api/v1/rosters')

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    #app.run(debug=True)
    socketio.run(app, debug=True)
