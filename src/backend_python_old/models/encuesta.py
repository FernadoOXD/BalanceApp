from backend.db import get_db_connection
import mysql.connector
import json

class EncuestaModel:
    @staticmethod
    def crear_encuesta_con_cita(id_paciente, fecha, hora, datos_encuesta):
        """
        Crea una cita y guarda la encuesta asociada.
        Retorna el id de la cita creada y el id de la encuesta.
        """
        conn = get_db_connection()
        if not conn:
            return {"success": False, "message": "Error al conectar con la base de datos."}

        try:
            cursor = conn.cursor(dictionary=True)
            
            # Primero crear la cita
            cursor.execute(
                """
                INSERT INTO cita (idPaciente, fecha, hora, motivoConsulta, estado)
                VALUES (%s, %s, %s, %s, 'Pendiente')
                """,
                (id_paciente, fecha, hora, "Cita con encuesta previa"),
            )
            conn.commit()
            id_cita = cursor.lastrowid
            
            # Luego crear la encuesta asociada
            cursor.execute(
                """
                INSERT INTO encuesta (idCita, idPaciente, datosEncuesta)
                VALUES (%s, %s, %s)
                """,
                (id_cita, id_paciente, json.dumps(datos_encuesta)),
            )
            conn.commit()
            id_encuesta = cursor.lastrowid
            
            return {
                "success": True,
                "message": "Cita y encuesta creadas exitosamente.",
                "idCita": id_cita,
                "idEncuesta": id_encuesta,
            }

        except mysql.connector.Error as e:
            conn.rollback()
            return {"success": False, "message": f"Error de base de datos: {e}"}
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()

    @staticmethod
    def obtener_encuesta_por_cita(id_cita):
        """
        Obtiene los datos de la encuesta asociada a una cita.
        """
        conn = get_db_connection()
        if not conn:
            return {"success": False, "message": "Error al conectar con la base de datos."}

        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                """
                SELECT idEncuesta, idCita, idPaciente, datosEncuesta, fechaCreacion
                FROM encuesta
                WHERE idCita = %s
                """,
                (id_cita,),
            )
            encuesta = cursor.fetchone()
            
            if not encuesta:
                return {"success": False, "message": "Encuesta no encontrada."}
            
            # Parsear el JSON de datosEncuesta
            encuesta['datosEncuesta'] = json.loads(encuesta['datosEncuesta'])
            
            return {"success": True, "data": encuesta}

        except mysql.connector.Error as e:
            return {"success": False, "message": f"Error de base de datos: {e}"}
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()
