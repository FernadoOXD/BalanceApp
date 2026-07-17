package controllers;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

import config.Database;
import io.javalin.http.Context;
import models.Tratamiento;

public class TratamientoController {

    // CREATE
    public static void crearTratamiento(Context ctx) {
        try {
            Tratamiento nuevoTratamiento = ctx.bodyAsClass(Tratamiento.class);
            int idGenerado = guardarEnBaseDeDatos(nuevoTratamiento);

            if (idGenerado > 0) {
                ctx.status(201).json("{\"success\": true, \"message\": \"Tratamiento registrado exitosamente.\", \"id\": " + idGenerado + "}");
            } else {
                ctx.status(400).json("{\"success\": false, \"message\": \"No se pudo registrar el tratamiento.\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"Error interno: " + e.getMessage() + "\"}");
        }
    }

    private static int guardarEnBaseDeDatos(Tratamiento t) throws Exception {
        String sql = "INSERT INTO TRATAMIENTO (idPaciente, fechaInicio, fechaFin, objetivo, caloriaDiaria, estado) VALUES (?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setInt(1, t.getIdPaciente());
            
            // Si no se envía fecha de inicio, asignamos la actual por defecto
            Date inicio = t.getFechaInicio() != null ? t.getFechaInicio() : new Date(System.currentTimeMillis());
            pstmt.setDate(2, inicio);
            
            // La fecha final puede ser nula si el tratamiento es indefinido
            if (t.getFechaFin() != null) {
                pstmt.setDate(3, t.getFechaFin());
            } else {
                pstmt.setNull(3, Types.DATE);
            }
            
            pstmt.setString(4, t.getObjetivo());
            pstmt.setFloat(5, t.getCaloriaDiaria());
            pstmt.setString(6, t.getEstado());
            
            int filasAfectadas = pstmt.executeUpdate();
            if (filasAfectadas > 0) {
                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) return rs.getInt(1);
                }
            }
            return 0;
        }
    }

    // READ (LISTAR)
    public static void obtenerTodos(Context ctx) {
        String sql = "SELECT * FROM TRATAMIENTO";
        List<Tratamiento> lista = new ArrayList<>();
        
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Tratamiento t = new Tratamiento();
                t.setIdTratamiento(rs.getInt("idTratamiento"));
                t.setIdPaciente(rs.getInt("idPaciente"));
                t.setFechaInicio(rs.getDate("fechaInicio"));
                t.setFechaFin(rs.getDate("fechaFin"));
                t.setObjetivo(rs.getString("objetivo"));
                t.setCaloriaDiaria(rs.getFloat("caloriaDiaria"));
                t.setEstado(rs.getString("estado"));
                lista.add(t);
            }
            ctx.status(200).json(lista);
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // UPDATE
    public static void actualizarTratamiento(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Tratamiento t = ctx.bodyAsClass(Tratamiento.class);
        
        String sql = "UPDATE TRATAMIENTO SET idPaciente=?, fechaInicio=?, fechaFin=?, objetivo=?, caloriaDiaria=?, estado=? WHERE idTratamiento=?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, t.getIdPaciente());
            pstmt.setDate(2, t.getFechaInicio());
            
            if (t.getFechaFin() != null) {
                pstmt.setDate(3, t.getFechaFin());
            } else {
                pstmt.setNull(3, Types.DATE);
            }
            
            pstmt.setString(4, t.getObjetivo());
            pstmt.setFloat(5, t.getCaloriaDiaria());
            pstmt.setString(6, t.getEstado());
            pstmt.setInt(7, id);
            
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Tratamiento actualizado\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"Tratamiento no encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // DELETE
    public static void eliminarTratamiento(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement("DELETE FROM TRATAMIENTO WHERE idTratamiento = ?")) {
            pstmt.setInt(1, id);
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Tratamiento eliminado\"}");
            } else {
                ctx.status(404).json("{\"message\": \"No encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}