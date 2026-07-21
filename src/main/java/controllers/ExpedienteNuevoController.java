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
        String sql = "INSERT INTO EXPEDIENTE_NUEVO (idPaciente, nombrePaciente, apellidoPaterno, apellidoMaterno, sexo, edad, ocupacion, procedencia, escolaridad, ejercicio, objetivo, altura, peso, talla, imc, cintura, antecedenteFamiliares, patologiaPrevia, alergiaIntolerancia, medicamentoActual, habitoToxico, fechaInicializacion, notasInternas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setInt(1, exp.getIdPaciente());
            pstmt.setString(2, exp.getNombrePaciente());
            pstmt.setString(3, exp.getApellidoPaterno());
            pstmt.setString(4, exp.getApellidoMaterno());
            pstmt.setString(5, exp.getSexo());
            pstmt.setString(6, exp.getEdad());
            pstmt.setString(7, exp.getOcupacion());
            pstmt.setString(8, exp.getProcedencia());
            pstmt.setString(9, exp.getEscolaridad());
            pstmt.setString(10, exp.getEjercicio());
            pstmt.setString(11, exp.getObjetivo());
            pstmt.setString(12, exp.getAltura());
            pstmt.setString(13, exp.getPeso());
            pstmt.setString(14, exp.getTalla());
            pstmt.setString(15, exp.getImc());
            pstmt.setString(16, exp.getCintura());
            pstmt.setString(17, exp.getAntecedenteFamiliares());
            pstmt.setString(18, exp.getPatologiaPrevia());
            pstmt.setString(19, exp.getAlergiaIntolerancia());
            pstmt.setString(20, exp.getMedicamentoActual());
            pstmt.setString(21, exp.getHabitoToxico());

            // Conversión segura de String a java.sql.Date
            java.sql.Date fechaFinal;
            if (exp.getFechaInicializacion() != null && !exp.getFechaInicializacion().isEmpty()) {
                fechaFinal = java.sql.Date.valueOf(exp.getFechaInicializacion());
            } else {
                fechaFinal = new java.sql.Date(System.currentTimeMillis());
            }
            pstmt.setDate(22, fechaFinal);

            pstmt.setString(23, exp.getNotasInternas());

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
                exp.setNombrePaciente(rs.getString("nombrePaciente"));
                exp.setApellidoPaterno(rs.getString("apellidoPaterno"));
                exp.setApellidoMaterno(rs.getString("apellidoMaterno"));
                exp.setSexo(rs.getString("sexo"));
                exp.setEdad(rs.getString("edad"));
                exp.setOcupacion(rs.getString("ocupacion"));
                exp.setProcedencia(rs.getString("procedencia"));
                exp.setEscolaridad(rs.getString("escolaridad"));
                exp.setEjercicio(rs.getString("ejercicio"));
                exp.setObjetivo(rs.getString("objetivo"));
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

                // Extraer fecha de BD y convertir a String
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
        String sql = "SELECT * FROM EXPEDIENTE_NUEVO WHERE idPaciente = ?";

        try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, pacienteId);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    java.util.Map<String, Object> responseJS = new java.util.HashMap<>();
                    responseJS.put("idExpediente", rs.getInt("idExpediente"));
                    responseJS.put("idPaciente", rs.getInt("idPaciente"));
                    responseJS.put("nombrePaciente", rs.getString("nombrePaciente"));
                    responseJS.put("apellidoPaterno", rs.getString("apellidoPaterno"));
                    responseJS.put("apellidoMaterno", rs.getString("apellidoMaterno"));
                    responseJS.put("sexo", rs.getString("sexo"));
                    responseJS.put("edad", rs.getString("edad"));
                    responseJS.put("ocupacion", rs.getString("ocupacion"));
                    responseJS.put("procedencia", rs.getString("procedencia"));
                    responseJS.put("escolaridad", rs.getString("escolaridad"));
                    responseJS.put("ejercicio", rs.getString("ejercicio"));
                    responseJS.put("objetivo", rs.getString("objetivo"));
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

        String sql = "UPDATE EXPEDIENTE_NUEVO SET idPaciente=?, nombrePaciente=?, apellidoPaterno=?, apellidoMaterno=?, sexo=?, edad=?, ocupacion=?, procedencia=?, escolaridad=?, ejercicio=?, objetivo=?, altura=?, peso=?, talla=?, imc=?, cintura=?, antecedenteFamiliares=?, patologiaPrevia=?, alergiaIntolerancia=?, medicamentoActual=?, habitoToxico=?, fechaInicializacion=?, notasInternas=? WHERE idExpediente=?";

        try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, exp.getIdPaciente());
            pstmt.setString(2, exp.getNombrePaciente());
            pstmt.setString(3, exp.getApellidoPaterno());
            pstmt.setString(4, exp.getApellidoMaterno());
            pstmt.setString(5, exp.getSexo());
            pstmt.setString(6, exp.getEdad());
            pstmt.setString(7, exp.getOcupacion());
            pstmt.setString(8, exp.getProcedencia());
            pstmt.setString(9, exp.getEscolaridad());
            pstmt.setString(10, exp.getEjercicio());
            pstmt.setString(11, exp.getObjetivo());
            pstmt.setString(12, exp.getAltura());
            pstmt.setString(13, exp.getPeso());
            pstmt.setString(14, exp.getTalla());
            pstmt.setString(15, exp.getImc());
            pstmt.setString(16, exp.getCintura());
            pstmt.setString(17, exp.getAntecedenteFamiliares());
            pstmt.setString(18, exp.getPatologiaPrevia());
            pstmt.setString(19, exp.getAlergiaIntolerancia());
            pstmt.setString(20, exp.getMedicamentoActual());
            pstmt.setString(21, exp.getHabitoToxico());

            java.sql.Date fechaFinal;
            if (exp.getFechaInicializacion() != null && !exp.getFechaInicializacion().isEmpty()) {
                fechaFinal = java.sql.Date.valueOf(exp.getFechaInicializacion());
            } else {
                fechaFinal = new java.sql.Date(System.currentTimeMillis());
            }
            pstmt.setDate(22, fechaFinal);

            pstmt.setString(23, exp.getNotasInternas());
            pstmt.setInt(24, id);

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
