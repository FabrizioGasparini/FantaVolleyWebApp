from flask import jsonify, Blueprint
import flask_jwt_extended.exceptions as JWTExceptions

error_handlers_bp = Blueprint('error_handlers', __name__)

@error_handlers_bp.app_errorhandler(Exception)
def handle_global_exception(error):
    return jsonify({
        "error": {
            "code": 500,
            "message": "Internal Server Error",
            "text": str(error)
        }
    }), 500

@error_handlers_bp.app_errorhandler(KeyError)
def handle_keyerror_exception(error):
    return jsonify({
        "error": {
            "code": 400,
            "message": "Invalid or missing parameter(s)",
            "text": str(error)
        }
    }), 400
