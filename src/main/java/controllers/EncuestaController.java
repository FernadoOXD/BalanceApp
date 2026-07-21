package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import config.Database;
import io.javalin.http.Context;
import models.Encuesta;

public class EncuestaController {

    // CREATE
    public static void crearEncuesta(Context ctx) {
        try {
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> body = ctx.bodyAsClass(java.util.Map.class);
            
            System.out.println("Encuesta body recibido: " + body);
            
            // Validar que idCita esté presente
            Object idCitaObj = body.get("idCita");
            if (idCitaObj == null) {
                ctx.status(400).json("{\"success\": false, \"message\": \"El campo idCita es requerido\"}");
                return;
            }
            
            // Validar que idPaciente esté presente
            Object idPacienteObj = body.get("idPaciente");
            if (idPacienteObj == null) {
                ctx.status(400).json("{\"success\": false, \"message\": \"El campo idPaciente es requerido\"}");
                return;
            }
            
            Encuesta nuevaEncuesta = new Encuesta();
            nuevaEncuesta.setIdCita(Integer.parseInt(idCitaObj.toString()));
            nuevaEncuesta.setIdPaciente(Integer.parseInt(idPacienteObj.toString()));
            nuevaEncuesta.setDatosEncuesta(body.get("datosEncuesta") != null ? body.get("datosEncuesta").toString() : "{}");
            nuevaEncuesta.setFechaCreacion(new Timestamp(System.currentTimeMillis()));
            
            int idGenerado = guardarEnBaseDeDatos(nuevaEncuesta);

            if (idGenerado > 0) {
                java.util.Map<String, Object> response = new java.util.HashMap<>();
                response.put("success", true);
                response.put("message", "Encuesta registrada exitosamente.");
                response.put("id", idGenerado);
                ctx.status(201).json(response);
            } else {
                ctx.status(400).json(java.util.Map.of("success", false, "message", "No se pudo registrar la encuesta."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            java.util.Map<String, Object> error = new java.util.HashMap<>();
            error.put("success", false);
            error.put("error", "Error interno: " + e.getMessage());
            ctx.status(500).json(error);
        }
    }

    private static int guardarEnBaseDeDatos(Encuesta e) throws Exception {
        String sql = "INSERT INTO ENCUESTA (idCita, idPaciente, datosEncuesta, fechaCreacion) VALUES (?, ?, ?, ?)";
        
        System.out.println("SQL: " + sql);
        System.out.println("idCita: " + e.getIdCita());
        System.out.println("idPaciente: " + e.getIdPaciente());
        System.out.println("datosEncuesta: " + e.getDatosEncuesta());
        System.out.println("fechaCreacion: " + e.getFechaCreacion());
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setInt(1, e.getIdCita());
            pstmt.setInt(2, e.getIdPaciente());
            pstmt.setString(3, e.getDatosEncuesta());
            
            // Si la fecha viene nula desde el cliente, asignamos el momento exacto actual
            Timestamp fecha = e.getFechaCreacion() != null ? e.getFechaCreacion() : new Timestamp(System.currentTimeMillis());
            pstmt.setTimestamp(4, fecha);
            
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
    public static void obtenerTodas(Context ctx) {
        String sql = "SELECT * FROM ENCUESTA";
        List<Encuesta> lista = new ArrayList<>();
        
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Encuesta e = new Encuesta();
                e.setIdEncuesta(rs.getInt("idEncuesta"));
                e.setIdCita(rs.getInt("idCita"));
                e.setDatosEncuesta(rs.getString("datosEncuesta"));
                e.setFechaCreacion(rs.getTimestamp("fechaCreacion"));
                lista.add(e);
            }
            ctx.status(200).json(lista);
        } catch (Exception ex) {
            ctx.status(500).json("{\"error\": \"" + ex.getMessage() + "\"}");
        }
    }

    // UPDATE
    public static void actualizarEncuesta(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Encuesta e = ctx.bodyAsClass(Encuesta.class);
        
        // Normalmente la fechaCreacion no se actualiza, por eso no está en el UPDATE
        String sql = "UPDATE ENCUESTA SET idCita=?, datosEncuesta=? WHERE idEncuesta=?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, e.getIdCita());
            pstmt.setString(2, e.getDatosEncuesta());
            pstmt.setInt(3, id);
            
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Encuesta actualizada\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"Encuesta no encontrada\"}");
            }
        } catch (Exception ex) {
            ctx.status(500).json("{\"error\": \"" + ex.getMessage() + "\"}");
        }
    }

    // DELETE
    public static void eliminarEncuesta(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement("DELETE FROM ENCUESTA WHERE idEncuesta = ?")) {
            pstmt.setInt(1, id);
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Encuesta eliminada\"}");
            } else {
                ctx.status(404).json("{\"message\": \"No encontrada\"}");
            }
        } catch (Exception ex) {
            ctx.status(500).json("{\"error\": \"" + ex.getMessage() + "\"}");
        }
    }
}