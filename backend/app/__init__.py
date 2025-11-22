import os
from flask import Flask, jsonify
from flask_cors import CORS
from .extensions import mail, bcrypt, mongo


def create_app():
    app = Flask(__name__)

    # Core config
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

    # CORS (broaden for dev)
    frontend_origin = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    origins = {frontend_origin}
    # Add common localhost variants for Vite
    origins.update({'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'})
    CORS(app,
         supports_credentials=True,
         resources={r"/api/*": {"origins": list(origins), "allow_headers": ["Content-Type", "Authorization"]}})

    # Mail
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

    # MongoDB
    app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/esg_analytics')

    # Init extensions
    mail.init_app(app)
    bcrypt.init_app(app)
    mongo.init_app(app)

    # Blueprints
    from .auth.routes import auth_bp
    from .analytics.routes import analytics_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(analytics_bp, url_prefix='/api')

    # Health
    @app.get('/api/health')
    def health():
        return jsonify({'status': 'healthy'}), 200

    return app
