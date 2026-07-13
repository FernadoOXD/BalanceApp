from flask import Flask, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys

# Ensure the src directory is in the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.routes.auth import auth_bp
from backend.routes.citas import citas_bp
from backend.routes.encuestas import encuestas_bp

# Load environment variables
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
load_dotenv(env_path)

app = Flask(__name__)
# Enable CORS for frontend integration
CORS(app, supports_credentials=True)
# Configure session
app.secret_key = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(citas_bp, url_prefix='/api/citas')
app.register_blueprint(encuestas_bp, url_prefix='/api/encuestas')

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running!"})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
