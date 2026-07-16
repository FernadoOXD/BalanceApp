from flask import Blueprint, request, jsonify, session
from backend.models.cita import CitaModel

citas_bp = Blueprint("citas", __name__)


def get_paciente_id():
    """
    Obtiene el id del paciente autenticado desde la sesión.
    Retorna None si no hay sesión activa.
    """
    return session.get("idPaciente") or session.get("paciente_id")


# ── GET /api/citas  ──────────────────────────────────────────────────────────
@citas_bp.route("", methods=["GET"])
def obtener_citas():
    """
    Devuelve las citas del paciente autenticado separadas en
    { proximas: [...], historial: [...] }

    Temporal: si no hay sesión, acepta ?paciente_id=<id> como fallback
    para facilitar el desarrollo/testing sin login implementado.
    """
    id_paciente = get_paciente_id()

    # Fallback de desarrollo (quitar cuando el login esté completo)
    if not id_paciente:
        id_paciente = request.args.get("paciente_id", type=int)

    if not id_paciente:
        return jsonify({"success": False, "message": "No autorizado. Inicia sesión primero."}), 401

    resultado = CitaModel.get_citas_por_paciente(id_paciente)

    if resultado["success"]:
        return jsonify(resultado), 200
    else:
        return jsonify(resultado), 500


# ── POST /api/citas  ─────────────────────────────────────────────────────────
@citas_bp.route("", methods=["POST"])
def crear_cita():
    """
    Crea una nueva cita.
    Body JSON esperado:
    {
        "fecha": "YYYY-MM-DD",
        "hora":  "HH:MM",
        "motivo": "texto"
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

    # Validaciones de campos requeridos
    campos_requeridos = ["fecha", "hora"]
    for campo in campos_requeridos:
        if campo not in data or not data[campo]:
            return jsonify({"success": False, "message": f"El campo '{campo}' es requerido."}), 400

    resultado = CitaModel.crear_cita(
        id_paciente=id_paciente,
        fecha=data["fecha"],
        hora=data["hora"],
        motivo=data.get("motivo", ""),
    )

    if resultado["success"]:
        return jsonify(resultado), 201
    else:
        return jsonify(resultado), 400


# ── PATCH /api/citas/<id>/cancelar  ─────────────────────────────────────────
@citas_bp.route("/<int:id_cita>/cancelar", methods=["PATCH"])
def cancelar_cita(id_cita):
    """Cambia el estado de la cita a 'Cancelada'."""
    id_paciente = get_paciente_id()
    if not id_paciente:
        id_paciente = request.args.get("paciente_id", type=int)
    if not id_paciente:
        return jsonify({"success": False, "message": "No autorizado."}), 401

    if not id_cita or id_cita <= 0:
        return jsonify({"success": False, "message": "ID de cita inválido."}), 400

    resultado = CitaModel.cancelar_cita(id_cita=id_cita, id_paciente=id_paciente)

    if resultado["success"]:
        return jsonify(resultado), 200
    else:
        return jsonify(resultado), 400
