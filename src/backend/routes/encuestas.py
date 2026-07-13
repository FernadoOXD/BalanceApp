from flask import Blueprint, request, jsonify, session
from backend.models.encuesta import EncuestaModel

encuestas_bp = Blueprint("encuestas", __name__)

def get_paciente_id():
    """
    Obtiene el id del paciente autenticado desde la sesión.
    Retorna None si no hay sesión activa.
    """
    return session.get("idPaciente") or session.get("paciente_id")

@encuestas_bp.route("/agendar-con-encuesta", methods=["POST"])
def agendar_cita_con_encuesta():
    """
    Crea una cita y guarda la encuesta asociada.
    Body JSON esperado:
    {
        "appointment": {
            "day": "YYYY-MM-DD",
            "time": "HH:MM AM/PM"
        },
        "survey": {
            // campos de la encuesta
        }
    }
    """
    id_paciente = get_paciente_id()
    if not id_paciente:
        id_paciente = request.args.get("paciente_id", type=int)
    if not id_paciente:
        return jsonify({"success": False, "message": "No autorizado."}), 401

    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Cuerpo de la petición vacío."}), 400

    # Validar campos requeridos
    if "appointment" not in data or "survey" not in data:
        return jsonify({"success": False, "message": "Faltan campos requeridos (appointment, survey)."}), 400

    appointment = data["appointment"]
    survey = data["survey"]

    if "day" not in appointment or "time" not in appointment:
        return jsonify({"success": False, "message": "Faltan campos en appointment (day, time)."}), 400

    # Convertir formato de hora (ej: "10:00 AM" a "10:00")
    time_str = appointment["time"]
    try:
        time_parts = time_str.split(" ")
        if len(time_parts) == 2:
            base_time = time_parts[0]  # "10:00"
            # Ya está en formato correcto para MySQL TIME
            hora = base_time
        else:
            hora = time_str
    except:
        return jsonify({"success": False, "message": "Formato de hora inválido."}), 400

    resultado = EncuestaModel.crear_encuesta_con_cita(
        id_paciente=id_paciente,
        fecha=appointment["day"],
        hora=hora,
        datos_encuesta=survey,
    )

    if resultado["success"]:
        return jsonify(resultado), 201
    else:
        return jsonify(resultado), 400
