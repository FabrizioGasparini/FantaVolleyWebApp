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
    data = request.get_json()
    
    username = data['username']
    email = data['email']
    password = data['password']

    # Length Filters
    if len(password) < 6:
        return jsonify({"error": {'code': 400, 'message': 'Invalid Password (too short)'}}), 400

    if len(username) < 3:
        return jsonify({"error": {'code': 400, 'message': 'Invalid Username (too short)'}}), 400


    # Validation Filters
    if not username.isalnum() or " " in username:
        return jsonify({"error": {'code': 400, 'message': 'Invalid Username (invalid character)'}}), 400
    
    if not validators.email(email):
        return jsonify({"error": {'code': 400, 'message': 'Invalid Email'}}), 400

    # Uniqueness Filters
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
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    if user:
        if check_password_hash(user.password, data['password']):
            return jsonify({
                "login": True,
                "user": user.to_json()
            }), 200
        else:
            return jsonify({"error": {'code': 404, 'message': 'User not found (password)'}}), 404        
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid username or password)'}}), 404        

    

@auth.route("/user/read", methods=["GET", "POST"])
def user():
    data = request.get_json()
    user_identity = decode_token(data["token"])
    
    user = User.query.filter_by(username=user_identity['sub']).first()
    if user:
        return jsonify({
            "user": user.to_json()
        }), 200
    else:
        return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404        



@auth.route('/user/delete', methods=["DELETE", "POST"])
def delete():
    data = request.get_json()
    user_identity = decode_token(data["token"])
    
    user = User.query.filter_by(username=user_identity['sub']).first()
    if user:
        
        is_token_expired = ExpiredToken.query.filter_by(token=data["token"]).first()
        if not is_token_expired:
            if user:
                if check_password_hash(user.password, data['password']):                    
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
                else:
                    return jsonify({"error": {'code': 404, 'message': 'User not found (invalid password)'}}), 404  
            else:
                return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404  
        else:
            return jsonify({"error": {'code': 404, 'message': 'User not found (invalid token)'}}), 404  