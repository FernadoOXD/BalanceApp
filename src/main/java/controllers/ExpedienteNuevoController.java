package controllers;

import java.sql.Connection;
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
                ctx.status(400).json("{\"success\": false, \"message\": \"No se pudo crear el expediente. Verifica que el idPaciente exista.\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(500).json("{\"error\": \"Error interno: " + e.getMessage() + "\"}");
        }
    }

    private static int guardarEnBaseDeDatos(ExpedienteNuevo exp) throws Exception {
        // SQL limpio, 13 columnas y 13 signos de interrogación
        String sql = "INSERT INTO EXPEDIENTE_NUEVO (idPaciente, altura, peso, talla, imc, cintura, antecedenteFamiliares, patologiaPrevia, alergiaIntolerancia, medicamentoActual, habitoToxico, fechaInicializacion, notasInternas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setInt(1, exp.getIdPaciente());
            pstmt.setString(2, exp.getAltura());
            pstmt.setString(3, exp.getPeso());
            pstmt.setString(4, exp.getTalla());
            pstmt.setString(5, exp.getImc());
            pstmt.setString(6, exp.getCintura());
            pstmt.setString(7, exp.getAntecedenteFamiliares());
            pstmt.setString(8, exp.getPatologiaPrevia());
            pstmt.setString(9, exp.getAlergiaIntolerancia());
            pstmt.setString(10, exp.getMedicamentoActual());
            pstmt.setString(11, exp.getHabitoToxico());

            java.sql.Date fechaFinal;
            if (exp.getFechaInicializacion() != null && !exp.getFechaInicializacion().isEmpty()) {
                fechaFinal = java.sql.Date.valueOf(exp.getFechaInicializacion());
            } else {
                fechaFinal = new java.sql.Date(System.currentTimeMillis());
            }
            pstmt.setDate(12, fechaFinal);

            pstmt.setString(13, exp.getNotasInternas());

            int filasAfectadas = pstmt.executeUpdate();
            if (filasAfectadas > 0) {
                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        return rs.getInt(1);
                    }
                }
            }
            return 0;
        }
    }

    // READ (LISTAR TODOS)
    public static void obtenerTodos(Context ctx) {
        String sql = "SELECT * FROM EXPEDIENTE_NUEVO";
        List<ExpedienteNuevo> lista = new ArrayList<>();

        try (Connection conn = Database.getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                ExpedienteNuevo exp = new ExpedienteNuevo();
                exp.setIdExpediente(rs.getInt("idExpediente"));
                exp.setIdPaciente(rs.getInt("idPaciente"));
                
                // Ya no intentamos leer 'objetivo'
                exp.setAltura(rs.getString("altura"));
                exp.setPeso(rs.getString("peso"));
                exp.setTalla(rs.getString("talla"));
                exp.setImc(rs.getString("imc"));
                exp.setCintura(rs.getString("cintura"));
                exp.setAntecedenteFamiliares(rs.getString("antecedenteFamiliares"));
                exp.setPatologiaPrevia(rs.getString("patologiaPrevia"));
                exp.setAlergiaIntolerancia(rs.getString("alergiaIntolerancia"));
                exp.setMedicamentoActual(rs.getString("medicamentoActual"));
                exp.setHabitoToxico(rs.getString("habitoToxico"));

                java.sql.Date fechaDB = rs.getDate("fechaInicializacion");
                exp.setFechaInicializacion(fechaDB != null ? fechaDB.toString() : "");

                exp.setNotasInternas(rs.getString("notasInternas"));
                lista.add(exp);
            }
            ctx.status(200).json(lista);
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // READ (OBTENER UNO POR PACIENTE)
    public static void obtenerPorPaciente(Context ctx) {
        int pacienteId = Integer.parseInt(ctx.pathParam("pacienteId"));
        // Aquí estaba el error. Restaurado el SELECT correcto:
        String sql = "SELECT * FROM EXPEDIENTE_NUEVO WHERE idPaciente = ?";

        try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, pacienteId);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    java.util.Map<String, Object> responseJS = new java.util.HashMap<>();
                    responseJS.put("idExpediente", rs.getInt("idExpediente"));
                    responseJS.put("idPaciente", rs.getInt("idPaciente"));
                    
                    // Ya no intentamos leer 'objetivo'
                    responseJS.put("altura", rs.getString("altura"));
                    responseJS.put("peso", rs.getString("peso"));
                    responseJS.put("talla", rs.getString("talla"));
                    responseJS.put("imc", rs.getString("imc"));
                    responseJS.put("cintura", rs.getString("cintura"));

                    java.sql.Date fechaDB = rs.getDate("fechaInicializacion");
                    responseJS.put("fecha", fechaDB != null ? fechaDB.toString() : "");

                    responseJS.put("observaciones", rs.getString("notasInternas"));
                    responseJS.put("patologiaPrevia", rs.getString("patologiaPrevia"));
                    responseJS.put("antecedenteFamiliares", rs.getString("antecedenteFamiliares"));
                    responseJS.put("alergiaIntolerancia", rs.getString("alergiaIntolerancia"));
                    responseJS.put("medicamentoActual", rs.getString("medicamentoActual"));
                    responseJS.put("habitoToxico", rs.getString("habitoToxico"));

                    ctx.status(200).json(responseJS);
                } else {
                    ctx.status(404).json("{\"message\": \"No se encontró expediente para este paciente\"}");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // UPDATE
    public static void actualizarExpediente(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        ExpedienteNuevo exp = ctx.bodyAsClass(ExpedienteNuevo.class);

        // Eliminamos 'objetivo=?' de la consulta SQL
        String sql = "UPDATE EXPEDIENTE_NUEVO SET idPaciente=?, altura=?, peso=?, talla=?, imc=?, cintura=?, antecedenteFamiliares=?, patologiaPrevia=?, alergiaIntolerancia=?, medicamentoActual=?, habitoToxico=?, fechaInicializacion=?, notasInternas=? WHERE idExpediente=?";

        try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, exp.getIdPaciente());
            pstmt.setString(2, exp.getAltura());
            pstmt.setString(3, exp.getPeso());
            pstmt.setString(4, exp.getTalla());
            pstmt.setString(5, exp.getImc());
            pstmt.setString(6, exp.getCintura());
            pstmt.setString(7, exp.getAntecedenteFamiliares());
            pstmt.setString(8, exp.getPatologiaPrevia());
            pstmt.setString(9, exp.getAlergiaIntolerancia());
            pstmt.setString(10, exp.getMedicamentoActual());
            pstmt.setString(11, exp.getHabitoToxico());

            java.sql.Date fechaFinal;
            if (exp.getFechaInicializacion() != null && !exp.getFechaInicializacion().isEmpty()) {
                fechaFinal = java.sql.Date.valueOf(exp.getFechaInicializacion());
            } else {
                fechaFinal = new java.sql.Date(System.currentTimeMillis());
            }
            pstmt.setDate(12, fechaFinal);

            pstmt.setString(13, exp.getNotasInternas());
            
            // El ID es el parámetro 14
            pstmt.setInt(14, id); 

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
        try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement("DELETE FROM EXPEDIENTE_NUEVO WHERE idExpediente = ?")) {
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