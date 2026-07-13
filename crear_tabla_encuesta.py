import sys
import os

# Agregar el directorio src al path)
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from backend.db import get_db_connection

def crear_tabla_encuesta():
    conn = get_db_connection()
    if not conn:
        print("Error al conectar con la base de datos")
        return False

    try:
        cursor = conn.cursor()
        
        # Crear tabla encuesta
        create_table_query = """
        CREATE TABLE IF NOT EXISTS `encuesta` (
          `idEncuesta` int AUTO_INCREMENT PRIMARY KEY,
          `idCita` int NOT NULL,
          `idPaciente` int NOT NULL,
          `datosEncuesta` json NOT NULL,
          `fechaCreacion` timestamp DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (`idCita`) REFERENCES `cita` (`idCita`) ON DELETE CASCADE,
          FOREIGN KEY (`idPaciente`) REFERENCES `PACIENTE` (`idPaciente`) ON DELETE CASCADE
        )
        """
        
        cursor.execute(create_table_query)
        conn.commit()
        print("Tabla 'encuesta' creada exitosamente")
        return True
        
    except Exception as e:
        print(f"Error al crear la tabla: {e}")
        conn.rollback()
        return False
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    crear_tabla_encuesta()
