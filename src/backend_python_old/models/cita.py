from backend.db import get_db_connection
import mysql.connector
from datetime import date


class CitaModel:

    @staticmethod
    def get_citas_por_paciente(id_paciente: int):
        """
        Obtiene todas las citas de un paciente y las separa en:
        - proximas: citas con fecha >= hoy y estado 'Pendiente' o 'Confirmada'
        - historial: citas con fecha < hoy o estado 'Completada' / 'No asistió'
        """
        conn = get_db_connection()
        if not conn:
            return {"success": False, "message": "Error al conectar con la base de datos."}

        try:
            cursor = conn.cursor(dictionary=True)
            hoy = date.today()

            # ── Próximas citas ──────────────────────────────────────────────
            cursor.execute(
                """
                SELECT
                    idCita,
                    fecha,
                    hora,
                    motivoConsulta,
                    estado
                FROM cita
                WHERE idPaciente = %s
                  AND fecha >= %s
                  AND (estado = 'Pendiente' OR estado = 'Confirmada' OR estado IS NULL)
                ORDER BY fecha ASC, hora ASC
                """,
                (id_paciente, hoy),
            )
            proximas = cursor.fetchall()

            # Convertir tipos no serializables (date, timedelta → str)
            for c in proximas:
                c["fecha"] = c["fecha"].strftime("%Y-%m-%d") if c["fecha"] else None
                # MySQL devuelve TIME como timedelta
                if hasattr(c["hora"], "seconds"):
                    total = c["hora"].seconds
                    h, rem = divmod(total, 3600)
                    m = rem // 60
                    c["hora"] = f"{h:02d}:{m:02d}"

            # ── Historial de citas ──────────────────────────────────────────
            # Solo citas pasadas o con estado que indique cierre (excluye Pendiente/Confirmada futuras)
            cursor.execute(
                """
                SELECT
                    idCita,
                    fecha,
                    hora,
                    motivoConsulta,
                    estado
                FROM cita
                WHERE idPaciente = %s
                  AND (
                        estado IN ('Completada', 'No asistio', 'Cancelada')
                        OR fecha < %s
                  )
                  AND NOT (
                        fecha >= %s
                        AND (estado = 'Pendiente' OR estado = 'Confirmada' OR estado IS NULL)
                  )
                ORDER BY fecha DESC, hora DESC
                """,
                (id_paciente, hoy, hoy),
            )
            historial = cursor.fetchall()

            for c in historial:
                c["fecha"] = c["fecha"].strftime("%Y-%m-%d") if c["fecha"] else None
                if hasattr(c["hora"], "seconds"):
                    total = c["hora"].seconds
                    h, rem = divmod(total, 3600)
                    m = rem // 60
                    c["hora"] = f"{h:02d}:{m:02d}"

            return {
                "success": True,
                "proximas": proximas,
                "historial": historial,
            }

        except mysql.connector.Error as e:
            return {"success": False, "message": f"Error de base de datos: {e}"}
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()

    # ────────────────────────────────────────────────────────────────────────
    @staticmethod
    def crear_cita(id_paciente: int, fecha: str, hora: str, motivo: str):
        """
        Inserta una nueva cita para el paciente.
        Validaciones:
          - La fecha no puede ser en el pasado.
          - No puede haber otra cita del mismo paciente en la misma fecha/hora.
        """
        conn = get_db_connection()
        if not conn:
            return {"success": False, "message": "Error al conectar con la base de datos."}

        try:
            from datetime import datetime

            # Validar que la fecha no sea pasada
            fecha_cita = datetime.strptime(fecha, "%Y-%m-%d").date()
            if fecha_cita < date.today():
                return {"success": False, "message": "No puedes agendar una cita en una fecha pasada."}

            cursor = conn.cursor(dictionary=True)

            # Verificar duplicado
            cursor.execute(
                """
                SELECT idCita FROM cita
                WHERE idPaciente = %s AND fecha = %s AND hora = %s
                """,
                (id_paciente, fecha, hora),
            )
            if cursor.fetchone():
                return {
                    "success": False,
                    "message": "Ya tienes una cita agendada para esa fecha y hora.",
                }

            cursor.execute(
                """
                INSERT INTO cita (idPaciente, fecha, hora, motivoConsulta, estado)
                VALUES (%s, %s, %s, %s, 'Pendiente')
                """,
                (id_paciente, fecha, hora, motivo),
            )
            conn.commit()
            nueva_id = cursor.lastrowid

            return {
                "success": True,
                "message": "Cita agendada exitosamente.",
                "idCita": nueva_id,
            }

        except mysql.connector.Error as e:
            return {"success": False, "message": f"Error de base de datos: {e}"}
        except ValueError:
            return {"success": False, "message": "Formato de fecha u hora inválido."}
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()

    # ────────────────────────────────────────────────────────────────────────
    @staticmethod
    def cancelar_cita(id_cita: int, id_paciente: int):
        """
        Cambia el estado de la cita a 'Cancelada'.
        Solo permite cancelar si la cita pertenece al paciente y no está ya completada.
        """
        conn = get_db_connection()
        if not conn:
            return {"success": False, "message": "Error al conectar con la base de datos."}

        try:
            cursor = conn.cursor(dictionary=True)

            cursor.execute(
                "SELECT estado, fecha FROM cita WHERE idCita = %s AND idPaciente = %s",
                (id_cita, id_paciente),
            )
            cita = cursor.fetchone()

            if not cita:
                return {"success": False, "message": "Cita no encontrada."}

            if cita["estado"] in ("Completada", "No asistió"):
                return {
                    "success": False,
                    "message": "No puedes cancelar una cita ya completada o no asistida.",
                }

            cursor.execute(
                "UPDATE cita SET estado = 'Cancelada' WHERE idCita = %s",
                (id_cita,),
            )
            conn.commit()
            return {"success": True, "message": "Cita cancelada exitosamente."}

        except mysql.connector.Error as e:
            return {"success": False, "message": f"Error de base de datos: {e}"}
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()
