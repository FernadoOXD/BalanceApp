package controllers;

import config.Database;
import io.javalin.http.Context;
import models.ConfiguracionEspecialista;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

public class ConfiguracionController {

    // GET /api/configuracion
    public static void obtenerConfiguracion(Context ctx) {
        String sql = "SELECT * FROM CONFIGURACION_ESPECIALISTA LIMIT 1";

        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            if (rs.next()) {
                ConfiguracionEspecialista config = new ConfiguracionEspecialista();
                config.setIdConfiguracion(rs.getInt("idConfiguracion"));
                config.setDatosConfiguracion(rs.getString("datosConfiguracion"));
                
                // Retornar directamente el JSON almacenado para que sea procesado por el frontend
                ctx.contentType("application/json");
                ctx.status(200).result(config.getDatosConfiguracion());
            } else {
                ctx.status(404).json("{\"error\": \"Configuración no encontrada.\"}");
            }

        } catch (Exception ex) {
            ctx.status(500).json("{\"error\": \"" + ex.getMessage() + "\"}");
        }
    }

    // POST /api/configuracion
    public static void guardarConfiguracion(Context ctx) {
        try {
            // El frontend manda todo el payload JSON (que incluye el arreglo schedule, duration, etc.)
            String datosJson = ctx.body();

            // Verificar si ya existe una configuración para actualizarla, sino, crearla
            String selectSql = "SELECT idConfiguracion FROM CONFIGURACION_ESPECIALISTA LIMIT 1";
            Integer idExistente = null;

            try (Connection conn = Database.getConnection();
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(selectSql)) {
                if (rs.next()) {
                    idExistente = rs.getInt("idConfiguracion");
                }
            }

            if (idExistente != null) {
                // UPDATE
                String updateSql = "UPDATE CONFIGURACION_ESPECIALISTA SET datosConfiguracion = ? WHERE idConfiguracion = ?";
                try (Connection conn = Database.getConnection();
                     PreparedStatement pstmt = conn.prepareStatement(updateSql)) {
                    pstmt.setString(1, datosJson);
                    pstmt.setInt(2, idExistente);
                    pstmt.executeUpdate();
                    ctx.status(200).json("{\"success\": true, \"message\": \"Configuración actualizada exitosamente.\"}");
                }
            } else {
                // INSERT
                String insertSql = "INSERT INTO CONFIGURACION_ESPECIALISTA (datosConfiguracion) VALUES (?)";
                try (Connection conn = Database.getConnection();
                     PreparedStatement pstmt = conn.prepareStatement(insertSql)) {
                    pstmt.setString(1, datosJson);
                    pstmt.executeUpdate();
                    ctx.status(201).json("{\"success\": true, \"message\": \"Configuración creada exitosamente.\"}");
                }
            }

        } catch (Exception ex) {
            ctx.status(500).json("{\"error\": \"Error interno: " + ex.getMessage() + "\"}");
        }
    }
}
