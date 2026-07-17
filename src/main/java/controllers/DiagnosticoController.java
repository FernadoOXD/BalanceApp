package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import config.Database;
import io.javalin.http.Context;
import models.Diagnostico;

public class DiagnosticoController {

    // CREATE
    public static void crearDiagnostico(Context ctx) {
        try {
            Diagnostico nuevoDiagnostico = ctx.bodyAsClass(Diagnostico.class);
            int idGenerado = guardarEnBaseDeDatos(nuevoDiagnostico);

            if (idGenerado > 0) {
                ctx.status(201).json("{\"success\": true, \"message\": \"Diagnóstico registrado exitosamente.\", \"id\": " + idGenerado + "}");
            } else {
                ctx.status(400).json("{\"success\": false, \"message\": \"No se pudo registrar el diagnóstico.\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"Error interno: " + e.getMessage() + "\"}");
        }
    }

    private static int guardarEnBaseDeDatos(Diagnostico d) throws Exception {
        String sql = "INSERT INTO DIAGNOSTICO (descripcionPrincipal, observacion) VALUES (?, ?)";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setString(1, d.getDescripcionPrincipal());
            pstmt.setString(2, d.getObservacion());
            
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
        String sql = "SELECT * FROM DIAGNOSTICO";
        List<Diagnostico> lista = new ArrayList<>();
        
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Diagnostico d = new Diagnostico();
                d.setIdDiagnostico(rs.getInt("idDiagnostico"));
                d.setDescripcionPrincipal(rs.getString("descripcionPrincipal"));
                d.setObservacion(rs.getString("observacion"));
                lista.add(d);
            }
            ctx.status(200).json(lista);
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // UPDATE
    public static void actualizarDiagnostico(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Diagnostico d = ctx.bodyAsClass(Diagnostico.class);
        
        String sql = "UPDATE DIAGNOSTICO SET descripcionPrincipal=?, observacion=? WHERE idDiagnostico=?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, d.getDescripcionPrincipal());
            pstmt.setString(2, d.getObservacion());
            pstmt.setInt(3, id);
            
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Diagnóstico actualizado\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"Diagnóstico no encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // DELETE
    public static void eliminarDiagnostico(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement("DELETE FROM DIAGNOSTICO WHERE idDiagnostico = ?")) {
            pstmt.setInt(1, id);
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Diagnóstico eliminado\"}");
            } else {
                ctx.status(404).json("{\"message\": \"No encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}