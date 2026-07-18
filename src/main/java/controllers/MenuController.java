package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import config.Database;
import io.javalin.http.Context;
import models.Menu;

public class MenuController {

    // CREATE
    public static void crearMenu(Context ctx) {
        try {
            Menu nuevo = ctx.bodyAsClass(Menu.class);
            String sql = "INSERT INTO MENU (idTratamiento, tipoComida, diaSemana, descripcionAlimento, macronutrientes) VALUES (?, ?, ?, ?, ?)";
            
            try (Connection conn = Database.getConnection();
                 PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                
                pstmt.setInt(1, nuevo.getIdTratamiento());
                pstmt.setString(2, nuevo.getTipoComida());
                pstmt.setString(3, nuevo.getDiaSemana());
                pstmt.setString(4, nuevo.getDescripcionAlimento());
                pstmt.setString(5, nuevo.getMacronutrientes()); 
                
                int filas = pstmt.executeUpdate();
                if (filas > 0) {
                    try (ResultSet rs = pstmt.getGeneratedKeys()) {
                        if (rs.next()) {
                            ctx.status(201).json("{\"success\": true, \"message\": \"Menú creado exitosamente.\", \"id\": " + rs.getInt(1) + "}");
                        }
                    }
                } else {
                    ctx.status(400).json("{\"success\": false, \"message\": \"No se pudo crear el menú.\"}");
                }
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"Error interno: " + e.getMessage() + "\"}");
        }
    }

    // READ (LISTAR)
    public static void obtenerTodos(Context ctx) {
        String sql = "SELECT * FROM MENU";
        List<Menu> lista = new ArrayList<>();
        
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Menu m = new Menu();
                m.setIdMenu(rs.getInt("idMenu"));
                m.setIdTratamiento(rs.getInt("idTratamiento"));
                m.setTipoComida(rs.getString("tipoComida"));
                m.setDiaSemana(rs.getString("diaSemana"));
                m.setDescripcionAlimento(rs.getString("descripcionAlimento"));
                m.setMacronutrientes(rs.getString("macronutrientes"));
                lista.add(m);
            }
            ctx.status(200).json(lista);
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // UPDATE
    public static void actualizarMenu(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Menu m = ctx.bodyAsClass(Menu.class);
        
        String sql = "UPDATE MENU SET idTratamiento=?, tipoComida=?, diaSemana=?, descripcionAlimento=?, macronutrientes=? WHERE idMenu=?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, m.getIdTratamiento());
            pstmt.setString(2, m.getTipoComida());
            pstmt.setString(3, m.getDiaSemana());
            pstmt.setString(4, m.getDescripcionAlimento());
            pstmt.setString(5, m.getMacronutrientes());
            pstmt.setInt(6, id);
            
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Menú actualizado\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"Menú no encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // DELETE
    public static void eliminarMenu(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement("DELETE FROM MENU WHERE idMenu = ?")) {
            pstmt.setInt(1, id);
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Menú eliminado\"}");
            } else {
                ctx.status(404).json("{\"message\": \"No encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}