from backend.db import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector

class PacienteModel:
    @staticmethod
    def create_paciente(nombres, apellidoPaterno, apellidoMaterno, email, contrasena_plana):
        """Creates a new patient in the database."""
        conn = get_db_connection()
        if not conn:
            return {"success": False, "message": "Error connecting to the database"}
        
        try:
            cursor = conn.cursor(dictionary=True)
            # Check if email already exists
            cursor.execute("SELECT idPaciente FROM PACIENTE WHERE email = %s", (email,))
            if cursor.fetchone():
                return {"success": False, "message": "El correo electrónico ya está registrado."}
            
            # Hash the password
            contrasena_hash = generate_password_hash(contrasena_plana)
            
            query = """
                INSERT INTO PACIENTE (nombres, apellidoPaterno, apellidoMaterno, email, contrasena)
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (nombres, apellidoPaterno, apellidoMaterno, email, contrasena_hash))
            conn.commit()
            
            paciente_id = cursor.lastrowid
            return {"success": True, "message": "Paciente registrado exitosamente.", "id": paciente_id}
            
        except mysql.connector.Error as e:
            return {"success": False, "message": f"Database error: {e}"}
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()

    @staticmethod
    def login(email, contrasena_plana):
        """Verifies credentials for login."""
        conn = get_db_connection()
        if not conn:
            return {"success": False, "message": "Error connecting to the database"}
            
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM PACIENTE WHERE email = %s", (email,))
            paciente = cursor.fetchone()
            
            if not paciente:
                return {"success": False, "message": "Correo o contraseña incorrectos."}
                
            # Verify password
            if check_password_hash(paciente['contrasena'], contrasena_plana):
                # Don't return the hash
                del paciente['contrasena']
                return {"success": True, "message": "Inicio de sesión exitoso.", "data": paciente}
            else:
                return {"success": False, "message": "Correo o contraseña incorrectos."}
                
        except mysql.connector.Error as e:
            return {"success": False, "message": f"Database error: {e}"}
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()
