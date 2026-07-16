from flask import Blueprint, request, jsonify, session
from backend.models.paciente import PacienteModel

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Basic validation
    required_fields = ['nombres', 'apellidoPaterno', 'email', 'contrasena']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"success": False, "message": f"El campo {field} es requerido."}), 400
            
    nombres = data['nombres']
    apellidoPaterno = data['apellidoPaterno']
    apellidoMaterno = data.get('apellidoMaterno', None) # Optional
    email = data['email']
    contrasena = data['contrasena']
    
    result = PacienteModel.create_paciente(nombres, apellidoPaterno, apellidoMaterno, email, contrasena)
    
    if result['success']:
        return jsonify(result), 201
    else:
        return jsonify(result), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if 'email' not in data or 'contrasena' not in data:
        return jsonify({"success": False, "message": "Email y contraseña requeridos."}), 400
        
    email = data['email']
    contrasena = data['contrasena']
    
    result = PacienteModel.login(email, contrasena)
    
    if result['success']:
        # Store user session
        session['idPaciente'] = result['data']['idPaciente']
        session['email'] = result['data']['email']
        return jsonify(result), 200
    else:
        return jsonify(result), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"success": True, "message": "Sesión cerrada exitosamente."}), 200

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    if 'idPaciente' not in session:
        return jsonify({"success": False, "message": "No autenticado."}), 401
    return jsonify({
        "success": True,
        "data": {
            "idPaciente": session['idPaciente'],
            "email": session['email']
        }
    }), 200
