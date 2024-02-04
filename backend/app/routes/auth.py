from flask import Blueprint, request, jsonify
from app.models.user import User
from app.models.league import League
from app.models.expired_token import ExpiredToken
import validators

from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, decode_token
from jwt import encode, decode

auth = Blueprint('auth', __name__)

@auth.post('/register')
def register():
    try: 
        data = request.get_json()
    except:
        return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
    
    username = data['username']
    email = data['email']
    password = data['password']

    if len(password) < 6:
        return jsonify({"error": {'code': 400, 'message': 'Invalid Password (too short)'}}), 400

    if len(username) < 3:
        return jsonify({"error": {'code': 400, 'message': 'Invalid Username (too short)'}}), 400


    if not username.isalnum() or " " in username:
        return jsonify({"error": {'code': 400, 'message': 'Invalid Username (invalid character)'}}), 400
    
    if not validators.email(email):
        return jsonify({"error": {'code': 400, 'message': 'Invalid Email'}}), 400


    if 'username' not in data or 'password' not in data or 'email' not in data:
        return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
    

    if User.query.filter_by(username=username).first() is not None:
        return jsonify({'error': {'code': 400, 'message': 'Invalid Username (already taken)'}}), 400
    
    if User.query.filter_by(email=email).first() is not None:
        return jsonify({'error': {'code': 400, 'message': 'Invalid Email (already used)'}}), 400
        
    pass_hash = generate_password_hash(password)


    new_user = User(username, email, pass_hash, "user")
    new_user.token = create_access_token(identity=username) 
    new_user.save_to_db()
    
    return jsonify({
        'message': 'User created', 
        'user': new_user.to_json()
    }), 201


@auth.post('/login')
def login():
    try: 
        data = request.get_json()
    except:
        return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400

    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()
    if user:
        if check_password_hash(user.password, password):
            return jsonify({
                "login": True,
                "user": user.to_json()
            }), 200

    return jsonify({
        "login": False,
        "error": 
        {
            "code": 404,
            "message": "User not found"
        }
    }), 404
    

@auth.route("/read/user", methods=["GET", "POST"])
def user():
    try: 
        data = request.get_json()
    except:
        return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
 
    if 'token' in data:
        try:
            user_identity = decode_token(data["token"])
            print(user_identity)

            user = User.query.filter_by(username=user_identity['sub']).first()
            
            if user:
                return jsonify({
                    "user": user.to_json()
                }), 200
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


@auth.route('/delete/user', methods=["DELETE", "POST"])
def delete():
    try: 
        data = request.get_json()
    except:
        return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400
 
    if 'token' in data:
        try:
            user_identity = decode_token(data["token"])
            user = User.query.filter_by(username=user_identity['sub']).first()
            
            is_token_expired = ExpiredToken.query.filter_by(token=data["token"]).first()
            if is_token_expired:
                return jsonify({"error": {'code': 401, "message": "Invalid token or Password"}}), 401

            if user:
                try:
                    password = data['password']
                except:
                    return jsonify({"error": {'code': 400, 'message': 'Invalid or Missing Parameters'}}), 400

                if check_password_hash(user.password, password):                    
                    try:
                        expired_token = ExpiredToken(data['token'])
                        expired_token.save_to_db()

                        leagues = League.query.filter_by(owner_token=user.token).all()
                        for league in leagues:
                            league.remove_from_db()
                            

                        user.remove_from_db()

                        return jsonify({
                            "message": 
                            {
                                "message": "User deleted successfully"
                            }
                        }), 410 
                    except:
                        return jsonify({
                            "message": 
                            {
                                "code": 500,
                                "message": "Error during deleting user"
                            }
                        }), 500 
                else:
                    return jsonify({"error": {'code': 401, "message": "Invalid token or Password"}}), 401


        except:
            return jsonify({
                "error": 
                {
                    "code": 401,
                    "message": "Invalid token or Password"
                }
            }), 401           

    
    return jsonify({
        "error": 
        {
            "code": 401,
            "message": "Invalid token"
        }
    }), 401