import os
import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify, current_app


def _secret():
    return os.getenv('SECRET_KEY', current_app.config.get('SECRET_KEY', 'dev-secret'))


def create_token(payload: dict, expires_in: timedelta) -> str:
    data = payload.copy()
    data['exp'] = datetime.now(tz=timezone.utc) + expires_in
    return jwt.encode(data, _secret(), algorithm='HS256')


def decode_token(token: str) -> dict:
    return jwt.decode(token, _secret(), algorithms=['HS256'])


def auth_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token is missing'}), 401
        token = auth_header.split(' ')[1]
        try:
            payload = decode_token(token)
            request.user = payload  # Attach to request context
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return wrapper
