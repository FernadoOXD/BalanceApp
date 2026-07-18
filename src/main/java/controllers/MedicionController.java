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
import models.Medicion;

public class MedicionController {

    // CREATE
    public static void crearMedicion(Context ctx) {
        try {
            Medicion nueva = ctx.bodyAsClass(Medicion.class);
            int idGenerado = guardarEnBaseDeDatos(nueva);

            if (idGenerado > 0) {
                ctx.status(201).json("{\"success\": true, \"message\": \"Medición registrada exitosamente.\", \"id\": " + idGenerado + "}");
            } else {
                ctx.status(400).json("{\"success\": false, \"message\": \"No se pudo registrar la medición. Verifica que el idCita sea correcto.\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"Error interno: " + e.getMessage() + "\"}");
        }
    }

    private static int guardarEnBaseDeDatos(Medicion m) throws Exception {
        String sql = "INSERT INTO MEDICION (idCita, fechaMedicion, pesoKg, estaturaCm, porcentajeGrasa, porcentajeMusculo, circunferenciaCintura) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setInt(1, m.getIdCita());
            
            Date fecha = m.getFechaMedicion() != null ? m.getFechaMedicion() : new Date(System.currentTimeMillis());
            pstmt.setDate(2, fecha);
            
            pstmt.setFloat(3, m.getPesoKg());
            pstmt.setFloat(4, m.getEstaturaCm());
            pstmt.setFloat(5, m.getPorcentajeGrasa());
            pstmt.setFloat(6, m.getPorcentajeMusculo());
            pstmt.setFloat(7, m.getCircunferenciaCintura());
            
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
        String sql = "SELECT * FROM MEDICION";
        List<Medicion> lista = new ArrayList<>();
        
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Medicion m = new Medicion();
                m.setIdMedicion(rs.getInt("idMedicion"));
                m.setIdCita(rs.getInt("idCita"));
                m.setFechaMedicion(rs.getDate("fechaMedicion"));
                m.setPesoKg(rs.getFloat("pesoKg"));
                m.setEstaturaCm(rs.getFloat("estaturaCm"));
                m.setPorcentajeGrasa(rs.getFloat("porcentajeGrasa"));
                m.setPorcentajeMusculo(rs.getFloat("porcentajeMusculo"));
                m.setCircunferenciaCintura(rs.getFloat("circunferenciaCintura"));
                lista.add(m);
            }
            ctx.status(200).json(lista);
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // UPDATE
    public static void actualizarMedicion(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Medicion m = ctx.bodyAsClass(Medicion.class);
        
        String sql = "UPDATE MEDICION SET idCita=?, fechaMedicion=?, pesoKg=?, estaturaCm=?, porcentajeGrasa=?, porcentajeMusculo=?, circunferenciaCintura=? WHERE idMedicion=?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, m.getIdCita());
            pstmt.setDate(2, m.getFechaMedicion());
            pstmt.setFloat(3, m.getPesoKg());
            pstmt.setFloat(4, m.getEstaturaCm());
            pstmt.setFloat(5, m.getPorcentajeGrasa());
            pstmt.setFloat(6, m.getPorcentajeMusculo());
            pstmt.setFloat(7, m.getCircunferenciaCintura());
            pstmt.setInt(8, id);
            
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Medición actualizada\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"Medición no encontrada\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // DELETE
    public static void eliminarMedicion(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement("DELETE FROM MEDICION WHERE idMedicion = ?")) {
            pstmt.setInt(1, id);
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Medición eliminada\"}");
            } else {
                ctx.status(404).json("{\"message\": \"No encontrada\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}