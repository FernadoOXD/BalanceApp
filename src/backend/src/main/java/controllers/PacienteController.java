package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import config.Database;
import io.javalin.http.Context;
import models.Paciente;

public class PacienteController {

    // 1. El Endpoint de Javalin (La ruta)
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

    // 2. La función SQL (Retorna un entero con el ID, no un booleano)
    private static int guardarEnBaseDeDatos(Paciente p) throws Exception {
        // Adaptado a las columnas obligatorias (NOT NULL) de tu schema.sql
        String sql = "INSERT INTO PACIENTE (nombres, apellidoPaterno, email, contrasena) VALUES (?, ?, ?, ?)";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            // Usamos los Getters que generaste en VS Code
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

    // Método para obtener todos los pacientes
    public static void obtenerTodos(Context ctx) {
    ctx.json("{\"message\": \"Aquí iría la lista de pacientes\"}");
    }
     //UPDATE: Editar un paciente ---
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

    //DELETE: Borrar un paciente ---
    public static void eliminarPaciente(Context ctx) {
    int id = Integer.parseInt(ctx.pathParam("id"));
    try (Connection conn = Database.getConnection();
         PreparedStatement pstmt = conn.prepareStatement("DELETE FROM PACIENTE WHERE idPaciente = ?")) {
        pstmt.setInt(1, id);
        int filas = pstmt.executeUpdate();
        if (filas > 0) ctx.status(200).json("{\"success\": true, \"message\": \"Paciente eliminado\"}");
        else ctx.status(404).json("{\"message\": \"No encontrado\"}");
    } catch (Exception e) {
        ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
    }
    }
}