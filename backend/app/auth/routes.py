import os
import secrets
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from bson import ObjectId
from ..extensions import mongo, bcrypt
from pymongo.errors import DuplicateKeyError
from ..services.tokens import create_token, auth_required
from ..services.email_service import (
    send_verification_email,
    send_reset_otp_email,
    send_welcome_email,
    send_verify_otp_email,
)


auth_bp = Blueprint('auth', __name__)


def serialize_user(doc):
    return {
        'id': str(doc.get('_id')),
        'email': doc.get('email'),
        'full_name': doc.get('full_name'),
        'phone': doc.get('phone'),
        'company_name': doc.get('company_name'),
        'is_verified': doc.get('is_verified', False),
        'prefs': doc.get('prefs', {}),
        'avatar': doc.get('avatar'),
        'created_at': doc.get('created_at'),
        'last_login': doc.get('last_login'),
    }


@auth_bp.record_once
def setup_indexes(state):
    # Ensure indexes on first registration
    mongo.db.users.create_index('email', unique=True)
    mongo.db.predictions.create_index([('user_id', 1), ('created_at', -1)])
    mongo.db.uploads.create_index([('user_id', 1), ('created_at', -1)])


@auth_bp.post('/register')
def register():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    full_name = (data.get('full_name') or '').strip() or None
    phone = (data.get('phone') or '').strip() or None
    company_name = (data.get('company_name') or '').strip() or None

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400

    if mongo.db.users.find_one({'email': email}):
        return jsonify({'error': 'Email already registered'}), 409

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    # Email verification via OTP (6 digits, 15 minutes)
    verify_otp = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
    verify_otp_expires = datetime.utcnow() + timedelta(minutes=15)

    user_doc = {
        'email': email,
        'password_hash': password_hash,
        'full_name': full_name,
        'phone': phone,
        'company_name': company_name,
        'is_verified': False,
        'verification_token': None,
        'verification_token_expires': None,
        'verify_otp': verify_otp,
        'verify_otp_expires': verify_otp_expires,
        'created_at': datetime.utcnow(),
        'last_login': None,
        'reset_otp': None,
        'reset_otp_expires': None,
        'prefs': {'email_updates': True},
    }

    try:
        mongo.db.users.insert_one(user_doc)
    except DuplicateKeyError:
        return jsonify({'error': 'Email already registered'}), 409
    except Exception as e:
        return jsonify({'error': 'Failed to create user', 'message': str(e)}), 500

    # Send OTP instead of link
    email_sent = send_verify_otp_email(email, verify_otp)
    dev_expose_otp = os.getenv('SEND_MAIL', 'true').lower() != 'true'
    payload = {
        'message': 'Registration successful. Enter the OTP sent to your email to verify your account.',
        'email_sent': email_sent,
        'user': serialize_user(user_doc)
    }
    if dev_expose_otp:
        payload['otp'] = verify_otp
    return jsonify(payload), 201


@auth_bp.post('/verify-email')
def verify_email():
    data = request.get_json() or {}
    token = data.get('token')
    if not token:
        return jsonify({'error': 'Verification token is required'}), 400

    user = mongo.db.users.find_one({'verification_token': token})
    if not user:
        return jsonify({'error': 'Invalid or expired verification token'}), 400

    if not user.get('verification_token_expires') or user['verification_token_expires'] < datetime.utcnow():
        return jsonify({'error': 'Verification token expired'}), 400

    mongo.db.users.update_one({'_id': user['_id']}, {
        '$set': {
            'is_verified': True,
            'verification_token': None,
            'verification_token_expires': None
        }
    })

    send_welcome_email(user['email'], user.get('company_name'))
    user = mongo.db.users.find_one({'_id': user['_id']})
    return jsonify({'message': 'Email verified successfully! You can now log in.', 'user': serialize_user(user)})


@auth_bp.post('/resend-verification')
def resend_verification():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = mongo.db.users.find_one({'email': email})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if user.get('is_verified'):
        return jsonify({'error': 'Email already verified'}), 400

    # Generate fresh OTP
    otp = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
    expires = datetime.utcnow() + timedelta(minutes=15)
    mongo.db.users.update_one({'_id': user['_id']}, {
        '$set': {'verify_otp': otp, 'verify_otp_expires': expires}
    })
    email_sent = send_verify_otp_email(email, otp)
    dev_expose_otp = os.getenv('SEND_MAIL', 'true').lower() != 'true'
    payload = {'message': 'Verification OTP sent. Please check your inbox.', 'email_sent': email_sent}
    if dev_expose_otp:
        payload['otp'] = otp
    return jsonify(payload)


@auth_bp.post('/verify-email-otp')
def verify_email_otp():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    otp = (data.get('otp') or '').strip()
    if not email or not otp:
        return jsonify({'error': 'Email and OTP are required'}), 400

    user = mongo.db.users.find_one({'email': email})
    if not user:
        return jsonify({'error': 'Invalid email'}), 400

    if not user.get('verify_otp') or not user.get('verify_otp_expires') or user['verify_otp_expires'] < datetime.utcnow() or user['verify_otp'] != otp:
        return jsonify({'error': 'Invalid or expired OTP'}), 400

    mongo.db.users.update_one({'_id': user['_id']}, {
        '$set': {'is_verified': True},
        '$unset': {'verify_otp': '', 'verify_otp_expires': ''}
    })

    send_welcome_email(user['email'], user.get('company_name'))
    user = mongo.db.users.find_one({'_id': user['_id']})
    return jsonify({'message': 'Email verified successfully! You can now log in.', 'user': serialize_user(user)})


@auth_bp.post('/login')
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    user = mongo.db.users.find_one({'email': email})
    if not user or not bcrypt.check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Invalid email or password'}), 401
    if not user.get('is_verified'):
        return jsonify({'error': 'Please verify your email before logging in'}), 403

    mongo.db.users.update_one({'_id': user['_id']}, {'$set': {'last_login': datetime.utcnow()}})

    token = create_token({'user_id': str(user['_id']), 'email': user['email']}, timedelta(days=7))
    return jsonify({'message': 'Login successful', 'token': token, 'user': serialize_user(user)})


@auth_bp.post('/forgot-password')
def forgot_password():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = mongo.db.users.find_one({'email': email})
    if not user:
        # Do not reveal user existence
        return jsonify({'message': 'If the email exists, an OTP has been sent'}), 200

    if not user.get('is_verified'):
        return jsonify({'error': 'Please verify your email first'}), 403

    otp = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
    expires = datetime.utcnow() + timedelta(minutes=15)
    mongo.db.users.update_one({'_id': user['_id']}, {'$set': {'reset_otp': otp, 'reset_otp_expires': expires}})

    email_sent = send_reset_otp_email(email, otp)
    return jsonify({'message': 'OTP sent to your email. Please check your inbox.', 'email_sent': email_sent})


@auth_bp.post('/verify-otp')
def verify_otp():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    otp = (data.get('otp') or '').strip()

    user = mongo.db.users.find_one({'email': email})
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 400

    if not user.get('reset_otp') or not user.get('reset_otp_expires') or user['reset_otp_expires'] < datetime.utcnow() or user['reset_otp'] != otp:
        return jsonify({'error': 'Invalid or expired OTP'}), 400

    reset_token = create_token({'user_id': str(user['_id']), 'purpose': 'password_reset'}, timedelta(minutes=15))
    return jsonify({'message': 'OTP verified successfully', 'reset_token': reset_token})


@auth_bp.post('/reset-password')
def reset_password():
    data = request.get_json() or {}
    reset_token = data.get('reset_token')
    new_password = data.get('new_password') or ''

    if not reset_token or not new_password:
        return jsonify({'error': 'Reset token and new password are required'}), 400
    if len(new_password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400

    from ..services.tokens import decode_token
    try:
        payload = decode_token(reset_token)
        if payload.get('purpose') != 'password_reset':
            return jsonify({'error': 'Invalid reset token'}), 400
        user_id = payload['user_id']
    except Exception as e:
        return jsonify({'error': 'Invalid or expired reset token'}), 401

    password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    mongo.db.users.update_one({'_id': ObjectId(user_id)}, {
        '$set': {'password_hash': password_hash},
        '$unset': {'reset_otp': '', 'reset_otp_expires': ''}
    })
    return jsonify({'message': 'Password reset successfully. You can now log in.'})


@auth_bp.get('/me')
@auth_required
def me():
    user_id = request.user['user_id']
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': serialize_user(user)})


@auth_bp.put('/me')
@auth_required
def update_me():
    user_id = request.user['user_id']
    data = request.get_json() or {}
    update = {}
    for f in ['full_name', 'phone', 'company_name']:
        if f in data:
            update[f] = (data.get(f) or None)
    if 'prefs' in data and isinstance(data['prefs'], dict):
        update['prefs'] = data['prefs']
    if not update:
        return jsonify({'error': 'No updatable fields provided'}), 400
    mongo.db.users.update_one({'_id': ObjectId(user_id)}, {'$set': update})
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    return jsonify({'message': 'Profile updated', 'user': serialize_user(user)})


@auth_bp.post('/change-password')
@auth_required
def change_password():
    user_id = request.user['user_id']
    data = request.get_json() or {}
    current_password = data.get('current_password') or ''
    new_password = data.get('new_password') or ''
    if len(new_password) < 8:
        return jsonify({'error': 'New password must be at least 8 characters'}), 400
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    if not user or not bcrypt.check_password_hash(user['password_hash'], current_password):
        return jsonify({'error': 'Current password is incorrect'}), 400
    new_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    mongo.db.users.update_one({'_id': ObjectId(user_id)}, {'$set': {'password_hash': new_hash}})
    return jsonify({'message': 'Password changed successfully'})


@auth_bp.post('/avatar')
@auth_required
def upload_avatar():
    user_id = request.user['user_id']
    data = request.get_json() or {}
    avatar_data = data.get('data') or ''
    if not avatar_data.startswith('data:image/'):
        return jsonify({'error': 'Invalid image data'}), 400
    if len(avatar_data) > 1024 * 1024 * 2:  # ~2MB data URL
        return jsonify({'error': 'Image too large'}), 400
    mongo.db.users.update_one({'_id': ObjectId(user_id)}, {'$set': {'avatar': avatar_data}})
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    return jsonify({'message': 'Avatar updated', 'user': serialize_user(user)})


@auth_bp.delete('/avatar')
@auth_required
def delete_avatar():
    user_id = request.user['user_id']
    mongo.db.users.update_one({'_id': ObjectId(user_id)}, {'$unset': {'avatar': ''}})
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    return jsonify({'message': 'Avatar removed', 'user': serialize_user(user)})


@auth_bp.post('/logout')
@auth_required
def logout():
    return jsonify({'message': 'Logged out successfully'})


@auth_bp.delete('/account')
@auth_required
def delete_account():
    user_id = request.user['user_id']
    data = request.get_json() or {}
    password = data.get('password') or ''
    
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    if not user or not bcrypt.check_password_hash(user['password_hash'], password):
        return jsonify({'error': 'Incorrect password'}), 400
    
    # Delete user data
    mongo.db.users.delete_one({'_id': ObjectId(user_id)})
    mongo.db.predictions.delete_many({'user_id': user_id})
    mongo.db.uploads.delete_many({'user_id': user_id})
    
    return jsonify({'message': 'Account deleted successfully'})


@auth_bp.post('/seed-test-user')
def seed_test_user():
    """Dev-only: create or reset a verified test user and attach demo active dataset.
    Guards with env ALLOW_SEED=true or FLASK_ENV=development.
    """
    allow = os.getenv('ALLOW_SEED', 'false').lower() == 'true' or os.getenv('FLASK_ENV') == 'development'
    if not allow:
        return jsonify({'error': 'Seeding is disabled'}), 403

    email = (os.getenv('SEED_TEST_EMAIL', 'test@esg.local')).lower()
    password = 'password123'
    company_name = 'Test User'

    # Upsert user
    existing = mongo.db.users.find_one({'email': email})
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user_doc = {
        'email': email,
        'password_hash': password_hash,
        'full_name': company_name,
        'company_name': company_name,
        'is_verified': True,
        'created_at': datetime.utcnow(),
        'prefs': {'email_updates': False},
    }
    if existing:
        mongo.db.users.update_one({'_id': existing['_id']}, {'$set': user_doc})
        user_id = str(existing['_id'])
    else:
        res = mongo.db.users.insert_one(user_doc)
        user_id = str(res.inserted_id)

    # Attach demo dataset as active
    try:
        # Lazy import to avoid circular dependency
        from ..analytics.routes import load_data
        df = load_data()
        data = df.to_dict(orient='records')
        columns = list(df.columns)
        mongo.db.active_datasets.update_one(
            {'user_id': user_id},
            {'$set': {'data': data, 'columns': columns, 'filename': 'demo_esg_dataset.csv', 'updated_at': datetime.utcnow()}},
            upsert=True,
        )
    except Exception as e:
        return jsonify({'error': 'Failed to set demo dataset', 'details': str(e)}), 500

    return jsonify({'message': 'Seeded test user', 'credentials': {'email': email, 'password': password}, 'user_id': user_id})
