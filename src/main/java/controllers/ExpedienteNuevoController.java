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
import models.ExpedienteNuevo;

public class ExpedienteNuevoController {

    // CREATE
    public static void crearExpediente(Context ctx) {
        try {
            ExpedienteNuevo nuevo = ctx.bodyAsClass(ExpedienteNuevo.class);
            int idGenerado = guardarEnBaseDeDatos(nuevo);

            if (idGenerado > 0) {
                ctx.status(201).json("{\"success\": true, \"message\": \"Expediente creado exitosamente.\", \"id\": " + idGenerado + "}");
            } else {
                ctx.status(400).json("{\"success\": false, \"message\": \"No se pudo crear el expediente. Verifica que el idPaciente exista y no tenga ya un expediente.\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"Error interno: " + e.getMessage() + "\"}");
        }
    }

    private static int guardarEnBaseDeDatos(ExpedienteNuevo exp) throws Exception {
        // ACTUALIZACIÓN: Nombre de la tabla cambiado a EXPEDIENTE_NUEVO
        String sql = "INSERT INTO EXPEDIENTE_NUEVO (idPaciente, antecedenteFamiliares, patologiaPrevia, alergiaIntolerancia, medicamentoActual, habitoToxico, fechaInicializacion, notasInternas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setInt(1, exp.getIdPaciente());
            pstmt.setString(2, exp.getAntecedenteFamiliares());
            pstmt.setString(3, exp.getPatologiaPrevia());
            pstmt.setString(4, exp.getAlergiaIntolerancia());
            pstmt.setString(5, exp.getMedicamentoActual());
            pstmt.setString(6, exp.getHabitoToxico());
            
            // Asignar fecha actual si no viene en el JSON
            Date fecha = exp.getFechaInicializacion() != null ? exp.getFechaInicializacion() : new Date(System.currentTimeMillis());
            pstmt.setDate(7, fecha);
            
            pstmt.setString(8, exp.getNotasInternas());
            
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
        // ACTUALIZACIÓN: Nombre de la tabla cambiado a EXPEDIENTE_NUEVO
        String sql = "SELECT * FROM EXPEDIENTE_NUEVO";
        List<ExpedienteNuevo> lista = new ArrayList<>();
        
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                ExpedienteNuevo exp = new ExpedienteNuevo();
                exp.setIdExpediente(rs.getInt("idExpediente"));
                exp.setIdPaciente(rs.getInt("idPaciente"));
                exp.setAntecedenteFamiliares(rs.getString("antecedenteFamiliares"));
                exp.setPatologiaPrevia(rs.getString("patologiaPrevia"));
                exp.setAlergiaIntolerancia(rs.getString("alergiaIntolerancia"));
                exp.setMedicamentoActual(rs.getString("medicamentoActual"));
                exp.setHabitoToxico(rs.getString("habitoToxico"));
                exp.setFechaInicializacion(rs.getDate("fechaInicializacion"));
                exp.setNotasInternas(rs.getString("notasInternas"));
                lista.add(exp);
            }
            ctx.status(200).json(lista);
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // UPDATE
    public static void actualizarExpediente(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        ExpedienteNuevo exp = ctx.bodyAsClass(ExpedienteNuevo.class);
        
        // ACTUALIZACIÓN: Nombre de la tabla cambiado a EXPEDIENTE_NUEVO
        String sql = "UPDATE EXPEDIENTE_NUEVO SET idPaciente=?, antecedenteFamiliares=?, patologiaPrevia=?, alergiaIntolerancia=?, medicamentoActual=?, habitoToxico=?, notasInternas=? WHERE idExpediente=?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, exp.getIdPaciente());
            pstmt.setString(2, exp.getAntecedenteFamiliares());
            pstmt.setString(3, exp.getPatologiaPrevia());
            pstmt.setString(4, exp.getAlergiaIntolerancia());
            pstmt.setString(5, exp.getMedicamentoActual());
            pstmt.setString(6, exp.getHabitoToxico());
            pstmt.setString(7, exp.getNotasInternas());
            pstmt.setInt(8, id);
            
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Expediente actualizado\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"Expediente no encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // DELETE
    public static void eliminarExpediente(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        // ACTUALIZACIÓN: Nombre de la tabla cambiado a EXPEDIENTE_NUEVO
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement("DELETE FROM EXPEDIENTE_NUEVO WHERE idExpediente = ?")) {
            pstmt.setInt(1, id);
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Expediente eliminado\"}");
            } else {
                ctx.status(404).json("{\"message\": \"No encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}