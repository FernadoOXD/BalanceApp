package controllers;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

import config.Database;
import io.javalin.http.Context;
import models.Tratamiento;

public class TratamientoController {

    // CREATE
    public static void crearTratamiento(Context ctx) {
        try {
            Tratamiento nuevoTratamiento = ctx.bodyAsClass(Tratamiento.class);
            int idGenerado = guardarEnBaseDeDatos(nuevoTratamiento);

            if (idGenerado > 0) {
                ctx.status(201).json("{\"success\": true, \"message\": \"Tratamiento registrado exitosamente.\", \"id\": " + idGenerado + "}");
            } else {
                ctx.status(400).json("{\"success\": false, \"message\": \"No se pudo registrar el tratamiento.\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"Error interno: " + e.getMessage() + "\"}");
        }
    }

    private static int guardarEnBaseDeDatos(Tratamiento t) throws Exception {
        String sql = "INSERT INTO TRATAMIENTO (idPaciente, fechaInicio, fechaFin, objetivo, caloriaDiaria, estado, alimentacion, ejercicioDescripcion, ejercicio, menuExcel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setInt(1, t.getIdPaciente());
            
            Date inicio = t.getFechaInicio() != null ? t.getFechaInicio() : new Date(System.currentTimeMillis());
            pstmt.setDate(2, inicio);
            
            if (t.getFechaFin() != null) {
                pstmt.setDate(3, t.getFechaFin());
            } else {
                pstmt.setNull(3, Types.DATE);
            }
            
            pstmt.setString(4, t.getObjetivo());
            pstmt.setFloat(5, t.getCaloriaDiaria());
            pstmt.setString(6, t.getEstado() != null ? t.getEstado() : "Activo");
            pstmt.setString(7, t.getAlimentacion());
            pstmt.setString(8, t.getEjercicioDescripcion());
            pstmt.setString(9, t.getEjercicio());
            pstmt.setString(10, t.getMenuExcel());
            
            int filasAfectadas = pstmt.executeUpdate();
            if (filasAfectadas > 0) {
                try (ResultSet rs = pstmt.getGeneratedKeys()) {
                    if (rs.next()) return rs.getInt(1);
                }
            }
            return 0;
        }
    }

    // READ (GET ALL)
    public static void obtenerTodos(Context ctx) {
        String sql = "SELECT t.*, p.nombres AS nombrePaciente FROM TRATAMIENTO t JOIN PACIENTE p ON t.idPaciente = p.idPaciente";
        List<Tratamiento> lista = new ArrayList<>();
        
        try (Connection conn = Database.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Tratamiento t = new Tratamiento();
                t.setIdTratamiento(rs.getInt("idTratamiento"));
                t.setIdPaciente(rs.getInt("idPaciente"));
                t.setFechaInicio(rs.getDate("fechaInicio"));
                t.setFechaFin(rs.getDate("fechaFin"));
                t.setObjetivo(rs.getString("objetivo"));
                t.setCaloriaDiaria(rs.getFloat("caloriaDiaria"));
                t.setEstado(rs.getString("estado"));
                t.setAlimentacion(rs.getString("alimentacion"));
                t.setEjercicioDescripcion(rs.getString("ejercicioDescripcion"));
                
                // Mapeo de los dos campos faltantes
                t.setEjercicio(rs.getString("ejercicio"));
                t.setMenuExcel(rs.getString("menuExcel"));
                
                // Asignamos el nombre del paciente obtenido del JOIN
                t.setNombrePaciente(rs.getString("nombrePaciente"));
                
                lista.add(t);
            }
            ctx.status(200).json(lista);
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // UPDATE BASE
    public static void actualizarTratamiento(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Tratamiento t = ctx.bodyAsClass(Tratamiento.class);
        
        String sql = "UPDATE TRATAMIENTO SET objetivo = ?, alimentacion = ?, ejercicioDescripcion = ? WHERE idTratamiento = ? OR idPaciente = ?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, t.getObjetivo());
            pstmt.setString(2, t.getAlimentacion());
            pstmt.setString(3, t.getEjercicioDescripcion());
            pstmt.setInt(4, id);
            pstmt.setInt(5, id);
            
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Tratamiento actualizado exitosamente\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"Tratamiento no encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // UPDATE MENÚ (Modal Menú / Matriz Excel)
    public static void actualizarMenu(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Tratamiento t = ctx.bodyAsClass(Tratamiento.class);
        
        String sql = "UPDATE TRATAMIENTO SET menuExcel = ? WHERE idTratamiento = ? OR idPaciente = ?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, t.getMenuExcel());
            pstmt.setInt(2, id);
            pstmt.setInt(3, id);
            
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Menú guardado correctamente en la base de datos\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"No se encontró el registro de tratamiento para actualizar el menú\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // UPDATE EJERCICIOS (Modal Rutina Detallada)
    public static void actualizarEjercicio(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Tratamiento t = ctx.bodyAsClass(Tratamiento.class);
        
        String sql = "UPDATE TRATAMIENTO SET ejercicio = ? WHERE idTratamiento = ? OR idPaciente = ?";
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, t.getEjercicio());
            pstmt.setInt(2, id);
            pstmt.setInt(3, id);
            
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Ejercicios guardados correctamente en la base de datos\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"No se encontró el registro de tratamiento para actualizar ejercicios\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // DELETE
    public static void eliminarTratamiento(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement("DELETE FROM TRATAMIENTO WHERE idTratamiento = ? OR idPaciente = ?")) {
            pstmt.setInt(1, id);
            pstmt.setInt(2, id);
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Tratamiento eliminado\"}");
            } else {
                ctx.status(404).json("{\"message\": \"No encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}