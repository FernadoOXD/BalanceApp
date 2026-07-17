package controllers;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import config.Database;
import io.javalin.http.Context;
import models.ExpedienteSeguimiento;

public class ExpedienteSeguimientoController {

    // CREATE
    public static void crearSeguimiento(Context ctx) {
        try {
            ExpedienteSeguimiento nuevo = ctx.bodyAsClass(ExpedienteSeguimiento.class);
            int idGenerado = guardarEnBaseDeDatos(nuevo);

            if (idGenerado > 0) {
                ctx.status(201).json("{\"success\": true, \"message\": \"Seguimiento registrado exitosamente.\", \"id\": " + idGenerado + "}");
            } else {
                ctx.status(400).json("{\"success\": false, \"message\": \"No se pudo registrar el seguimiento.\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"Error interno: " + e.getMessage() + "\"}");
        }
    }

    private static int guardarEnBaseDeDatos(ExpedienteSeguimiento es) throws Exception {
        // Usamos el nombre exacto de tu script y quitamos idPaciente
        String sql = "INSERT INTO EXPEDIENTE_SEGUIMIENTO (idExpediente, fechaActualizacion, notasInternasActualizada) VALUES (?, ?, ?)";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setInt(1, es.getIdExpediente());
            
            Date fecha = es.getFechaActualizacion() != null ? es.getFechaActualizacion() : new Date(System.currentTimeMillis());
            pstmt.setDate(2, fecha);
            
            pstmt.setString(3, es.getNotasInternasActualizada());
            
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
        String sql = "SELECT * FROM EXPEDIENTE_SEGUIMIENTO";
        List<ExpedienteSeguimiento> lista = new ArrayList<>();
        
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                ExpedienteSeguimiento es = new ExpedienteSeguimiento();
                es.setIdSeguimiento(rs.getInt("idSeguimiento"));
                es.setIdExpediente(rs.getInt("idExpediente"));
                es.setFechaActualizacion(rs.getDate("fechaActualizacion"));
                es.setNotasInternasActualizada(rs.getString("notasInternasActualizada"));
                lista.add(es);
            }
            ctx.status(200).json(lista);
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // UPDATE
    public static void actualizarSeguimiento(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        ExpedienteSeguimiento es = ctx.bodyAsClass(ExpedienteSeguimiento.class);
        
        String sql = "UPDATE EXPEDIENTE_SEGUIMIENTO SET idExpediente=?, fechaActualizacion=?, notasInternasActualizada=? WHERE idSeguimiento=?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, es.getIdExpediente());
            pstmt.setDate(2, es.getFechaActualizacion());
            pstmt.setString(3, es.getNotasInternasActualizada());
            pstmt.setInt(4, id);
            
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Seguimiento actualizado\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"Seguimiento no encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // DELETE
    public static void eliminarSeguimiento(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement("DELETE FROM EXPEDIENTE_SEGUIMIENTO WHERE idSeguimiento = ?")) {
            pstmt.setInt(1, id);
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Seguimiento eliminado\"}");
            } else {
                ctx.status(404).json("{\"message\": \"No encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}