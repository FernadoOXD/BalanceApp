package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import config.Database;
import io.javalin.http.Context;
import models.Paciente;

public class PacienteController {

    // ==========================================
    // 1. CREAR PACIENTE (Registro)
    // Ruta: POST /api/paciente
    // ==========================================
    public static void crearPaciente(Context ctx) {
        try {
            // Javalin + Jackson convierten el JSON mágicamente a tu clase Paciente
            Paciente nuevoPaciente = ctx.bodyAsClass(Paciente.class);

            // Llamamos a la función de guardado
            int idGenerado = guardarEnBaseDeDatos(nuevoPaciente);

            if (idGenerado > 0) {
                // Éxito: 201 Created
                ctx.status(201).json("{\"success\": true, \"message\": \"Paciente registrado exitosamente.\", \"id\": " + idGenerado + "}");
            } else {
                // Error de validación o base de datos
                ctx.status(400).json("{\"success\": false, \"message\": \"No se pudo registrar el paciente.\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"Error interno: " + e.getMessage() + "\"}");
        }
    }

    // Función auxiliar para insertar en MySQL (Retorna un entero con el ID)
    private static int guardarEnBaseDeDatos(Paciente p) throws Exception {
        String sql = "INSERT INTO PACIENTE (nombres, apellidoPaterno, email, contrasena) VALUES (?, ?, ?, ?)";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setString(1, p.getNombres());
            pstmt.setString(2, p.getApellidoPaterno());
            pstmt.setString(3, p.getEmail());
            pstmt.setString(4, p.getContrasena());
            
            int filasAfectadas = pstmt.executeUpdate();
            
            if (filasAfectadas > 0) {
                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        return rs.getInt(1); // Retorna el nuevo ID asignado por MySQL
                    }
                }
            }
            return 0; // 0 significa que la inserción falló
        }
    }

    // ==========================================
    // 2. INICIAR SESIÓN (Login)
    // Ruta: POST /api/paciente/login
    // ==========================================
    public static void login(Context ctx) {
        try {
            // Extraer el correo y contraseña enviados desde el frontend en JavaScript
            Paciente credenciales = ctx.bodyAsClass(Paciente.class);
            String email = credenciales.getEmail();
            String contrasena = credenciales.getContrasena();

            // Buscar en MySQL si existe un paciente con ESA combinación exacta
            String sql = "SELECT idPaciente FROM PACIENTE WHERE email = ? AND contrasena = ?";

            try (Connection conn = Database.getConnection();
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {

                pstmt.setString(1, email);
                pstmt.setString(2, contrasena);

                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        // Si hay un resultado, las credenciales son correctas
                        int idEncontrado = rs.getInt("idPaciente");
                        
                        // Devolvemos status 200 y el ID para que el frontend lo guarde en localStorage
                        ctx.status(200).json("{\"success\": true, \"idPaciente\": " + idEncontrado + "}");
                    } else {
                        // Si no hay resultados, el correo o la contraseña están mal
                        ctx.status(401).json("{\"success\": false, \"message\": \"Correo o contraseña incorrectos\"}");
                    }
                }
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"Error interno en login: " + e.getMessage() + "\"}");
        }
    }

    // ==========================================
    // 3. OBTENER TODOS LOS PACIENTES
    // Ruta: GET /api/paciente
    // ==========================================
    public static void obtenerTodos(Context ctx) {
        ctx.json("{\"message\": \"Aquí iría la lista de pacientes\"}");
    }

    // ==========================================
    // 4. ACTUALIZAR PACIENTE
    // Ruta: PUT /api/paciente/{id}
    // ==========================================
    public static void actualizarPaciente(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Paciente p = ctx.bodyAsClass(Paciente.class);
        
        String sql = "UPDATE PACIENTE SET nombres=?, apellidoPaterno=?, apellidoMaterno=?, fechaNacimiento=?, genero=?, telefono=?, email=? WHERE idPaciente=?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, p.getNombres());
            pstmt.setString(2, p.getApellidoPaterno());
            pstmt.setString(3, p.getApellidoMaterno());
            pstmt.setDate(4, p.getFechaNacimiento());
            pstmt.setString(5, p.getGenero());
            pstmt.setString(6, p.getTelefono());
            pstmt.setString(7, p.getEmail());
            pstmt.setInt(8, id);
            
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Paciente actualizado\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"Paciente no encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ==========================================
    // 5. ELIMINAR PACIENTE
    // Ruta: DELETE /api/paciente/settings/{id}
    // ==========================================
    public static void eliminarPaciente(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement("DELETE FROM PACIENTE WHERE idPaciente = ?")) {
            
            pstmt.setInt(1, id);
            int filas = pstmt.executeUpdate();
            
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Paciente eliminado\"}");
            } else {
                ctx.status(404).json("{\"message\": \"No encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}