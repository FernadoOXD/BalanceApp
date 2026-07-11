from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys

# Ensure the src directory is in the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.routes.auth import auth_bp

# Load environment variables
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
load_dotenv(env_path)

app = Flask(__name__)
# Enable CORS for frontend integration
CORS(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running!"})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
