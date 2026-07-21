package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import config.Database;
import io.javalin.http.Context;
import models.ExpedienteSeguimiento;

public class ExpedienteSeguimientoController {

    // CREAR SEGUIMIENTO
    public static void crearSeguimiento(Context ctx) {
        try {
            ExpedienteSeguimiento seg = ctx.bodyAsClass(ExpedienteSeguimiento.class);
            
            String sql = "INSERT INTO EXPEDIENTE_SEGUIMIENTO (idExpediente, fechaActualizacion, peso, altura, imc, cintura, objetivoSeguimiento, notasInternasActualizada) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                
                pstmt.setInt(1, seg.getIdExpediente());
                
                java.sql.Date fechaFinal;
                if (seg.getFechaActualizacion() != null && !seg.getFechaActualizacion().isEmpty()) {
                    fechaFinal = java.sql.Date.valueOf(seg.getFechaActualizacion());
                } else {
                    fechaFinal = new java.sql.Date(System.currentTimeMillis());
                }
                pstmt.setDate(2, fechaFinal);
                
                pstmt.setString(3, seg.getPeso());
                pstmt.setString(4, seg.getAltura());
                pstmt.setString(5, seg.getImc());
                pstmt.setString(6, seg.getCintura());
                pstmt.setString(7, seg.getObjetivoSeguimiento());
                pstmt.setString(8, seg.getNotasInternasActualizada());

                int filas = pstmt.executeUpdate();
                if (filas > 0) {
                    try (ResultSet rs = pstmt.getGeneratedKeys()) {
                        if (rs.next()) {
                            int idGen = rs.getInt(1);
                            ctx.status(201).json("{\"success\": true, \"message\": \"Seguimiento guardado exitosamente.\", \"id\": " + idGen + "}");
                            return;
                        }
                    }
                }
                ctx.status(400).json("{\"success\": false, \"message\": \"No se pudo guardar el seguimiento.\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(500).json("{\"error\": \"Error interno: " + e.getMessage() + "\"}");
        }
    }

    // OBTENER SEGUIMIENTOS POR EXPEDIENTE
    public static void obtenerPorExpediente(Context ctx) {
        int idExpediente = Integer.parseInt(ctx.pathParam("idExpediente"));
        String sql = "SELECT * FROM EXPEDIENTE_SEGUIMIENTO WHERE idExpediente = ? ORDER BY fechaActualizacion DESC";
        List<ExpedienteSeguimiento> lista = new ArrayList<>();

        try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, idExpediente);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    ExpedienteSeguimiento seg = new ExpedienteSeguimiento();
                    seg.setIdSeguimiento(rs.getInt("idSeguimiento"));
                    seg.setIdExpediente(rs.getInt("idExpediente"));
                    
                    java.sql.Date fechaDB = rs.getDate("fechaActualizacion");
                    seg.setFechaActualizacion(fechaDB != null ? fechaDB.toString() : "");
                    
                    seg.setPeso(rs.getString("peso"));
                    seg.setAltura(rs.getString("altura"));
                    seg.setImc(rs.getString("imc"));
                    seg.setCintura(rs.getString("cintura"));
                    seg.setObjetivoSeguimiento(rs.getString("objetivoSeguimiento"));
                    seg.setNotasInternasActualizada(rs.getString("notasInternasActualizada"));
                    
                    lista.add(seg);
                }
            }
            ctx.status(200).json(lista);
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}