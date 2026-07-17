package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import config.Database;
import io.javalin.http.Context;
import models.Cita;

public class CitaController {

    // CREATE
    public static void agendarCita (Context ctx) {
        try {
            Cita nuevaCita = ctx.bodyAsClass(Cita.class);
            int idGenerado = guardarEnBaseDeDatos(nuevaCita);

            if (idGenerado > 0) {
                ctx.status(201).json("{\"success\": true, \"message\": \"Cita registrada exitosamente.\", \"id\": " + idGenerado + "}");
            } else {
                ctx.status(400).json("{\"success\": false, \"message\": \"No se pudo registrar la cita.\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"Error interno: " + e.getMessage() + "\"}");
        }
    }

    private static int guardarEnBaseDeDatos(Cita c) throws Exception {
        String sql = "INSERT INTO CITA (idPaciente, fecha, hora, motivoConsulta, estado) VALUES (?, ?, ?, ?, ?)";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setInt(1, c.getIdPaciente());
            pstmt.setDate(2, c.getFecha());
            pstmt.setTime(3, c.getHora());
            pstmt.setString(4, c.getMotivoConsulta());
            pstmt.setString(5, c.getEstado());
            
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
        String sql = "SELECT * FROM CITA";
        List<Cita> lista = new ArrayList<>();
        
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Cita c = new Cita();
                c.setIdCita(rs.getInt("idCita"));
                c.setIdPaciente(rs.getInt("idPaciente"));
                c.setFecha(rs.getDate("fecha"));
                c.setHora(rs.getTime("hora"));
                c.setMotivoConsulta(rs.getString("motivoConsulta"));
                c.setEstado(rs.getString("estado"));
                lista.add(c);
            }
            ctx.status(200).json(lista);
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // UPDATE
    public static void actualizarCita(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Cita c = ctx.bodyAsClass(Cita.class);
        
        String sql = "UPDATE CITA SET idPaciente=?, fecha=?, hora=?, motivoConsulta=?, estado=? WHERE idCita=?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, c.getIdPaciente());
            pstmt.setDate(2, c.getFecha());
            pstmt.setTime(3, c.getHora());
            pstmt.setString(4, c.getMotivoConsulta());
            pstmt.setString(5, c.getEstado());
            pstmt.setInt(6, id);
            
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Cita actualizada\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"Cita no encontrada\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // DELETE
    public static void eliminarCita(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement("DELETE FROM CITA WHERE idCita = ?")) {
            pstmt.setInt(1, id);
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Cita eliminada\"}");
            } else {
                ctx.status(404).json("{\"message\": \"No encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}