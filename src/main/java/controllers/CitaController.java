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
            // Parsear manualmente para manejar el campo 'hora' como String
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> body = ctx.bodyAsClass(java.util.Map.class);
            
            System.out.println("Body recibido: " + body);
            System.out.println("idPaciente raw: " + body.get("idPaciente"));
            
            // Validar que idPaciente esté presente y no sea null
            Object idPacienteObj = body.get("idPaciente");
            if (idPacienteObj == null) {
                ctx.status(400).json("{\"success\": false, \"message\": \"El campo idPaciente es requerido\"}");
                return;
            }
            
            Cita nuevaCita = new Cita();
            int idPacienteValue = Integer.parseInt(idPacienteObj.toString());
            System.out.println("idPaciente parsed: " + idPacienteValue);
            nuevaCita.setIdPaciente(idPacienteValue);
            nuevaCita.setFecha(java.sql.Date.valueOf(body.get("fecha").toString())); // "2026-07-20"
            
            // Convertir hora de formato "10:00 AM" o "14:00" a java.sql.Time
            String horaStr = body.get("hora").toString().trim();
            nuevaCita.setHora(parsearHora(horaStr));
            
            nuevaCita.setMotivoConsulta(body.get("motivoConsulta") != null ? body.get("motivoConsulta").toString() : "Consulta general");
            nuevaCita.setEstado(body.get("estado") != null ? body.get("estado").toString() : "Pendiente");
            
            int idGenerado = guardarEnBaseDeDatos(nuevaCita);

            if (idGenerado > 0) {
                ctx.status(201).json("{\"success\": true, \"message\": \"Cita registrada exitosamente.\", \"id\": " + idGenerado + "}");
            } else {
                ctx.status(400).json("{\"success\": false, \"message\": \"No se pudo registrar la cita.\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(500).json("{\"error\": \"Error interno: " + e.getMessage() + "\"}");
        }
    }

    /**
     * Convierte una hora en formato "10:00 AM", "2:30 PM" o "14:00" a java.sql.Time.
     */
    private static java.sql.Time parsearHora(String horaStr) {
        horaStr = horaStr.trim().toUpperCase();
        
        // Si ya viene en formato 24h (ej. "14:00" o "08:00")
        if (!horaStr.contains("AM") && !horaStr.contains("PM")) {
            if (horaStr.length() == 5) horaStr += ":00"; // "14:00" -> "14:00:00"
            return java.sql.Time.valueOf(horaStr);
        }
        
        // Formato 12h con AM/PM
        boolean isPM = horaStr.contains("PM");
        horaStr = horaStr.replace("AM", "").replace("PM", "").trim();
        String[] parts = horaStr.split(":");
        int hour = Integer.parseInt(parts[0]);
        int minute = parts.length > 1 ? Integer.parseInt(parts[1]) : 0;
        
        if (isPM && hour != 12) hour += 12;
        if (!isPM && hour == 12) hour = 0;
        
        return java.sql.Time.valueOf(String.format("%02d:%02d:00", hour, minute));
    }

    private static int guardarEnBaseDeDatos(Cita c) throws Exception {
        // Validar que idPaciente no sea 0 o negativo antes de insertar
        if (c.getIdPaciente() <= 0) {
            throw new Exception("idPaciente debe ser un valor positivo: " + c.getIdPaciente());
        }
        
        System.out.println("Insertando cita - idPaciente: " + c.getIdPaciente() + ", fecha: " + c.getFecha() + ", hora: " + c.getHora());
        
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
        String pacienteIdStr = ctx.queryParam("paciente_id");
        String sql = "SELECT * FROM CITA";
        if (pacienteIdStr != null && !pacienteIdStr.isEmpty()) {
            sql += " WHERE idPaciente = ?";
        }
        
        List<java.util.Map<String, Object>> proximas = new ArrayList<>();
        List<java.util.Map<String, Object>> historial = new ArrayList<>();
        java.sql.Date hoy = new java.sql.Date(System.currentTimeMillis());
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            if (pacienteIdStr != null && !pacienteIdStr.isEmpty()) {
                pstmt.setInt(1, Integer.parseInt(pacienteIdStr));
            }
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    java.util.Map<String, Object> citaMap = new java.util.HashMap<>();
                    citaMap.put("idCita", rs.getInt("idCita"));
                    citaMap.put("idPaciente", rs.getInt("idPaciente"));
                    
                    // Convertir fecha a string YYYY-MM-DD
                    java.sql.Date fecha = rs.getDate("fecha");
                    citaMap.put("fecha", fecha != null ? fecha.toString() : null);
                    
                    // Convertir hora a string
                    java.sql.Time hora = rs.getTime("hora");
                    citaMap.put("hora", hora != null ? hora.toString() : null);
                    
                    citaMap.put("motivoConsulta", rs.getString("motivoConsulta"));
                    String estado = rs.getString("estado");
                    citaMap.put("estado", estado);
                    
                    // Clasificar: historial si la fecha pasó O si está cancelada/completada
                    boolean esHistorial = (fecha != null && fecha.before(hoy)) || 
                                        "Cancelada".equalsIgnoreCase(estado) || 
                                        "Completada".equalsIgnoreCase(estado);
                    
                    if (esHistorial) {
                        historial.add(citaMap);
                    } else {
                        proximas.add(citaMap);
                    }
                }
            }
            
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("success", true);
            response.put("proximas", proximas);
            response.put("historial", historial);
            ctx.status(200).json(response);
            
        } catch (Exception e) {
            ctx.status(500).json("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
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

    // CANCELAR (PATCH)
    public static void cancelarCita(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        String pacienteIdStr = ctx.queryParam("paciente_id");
        
        String sql = "UPDATE CITA SET estado = 'Cancelada' WHERE idCita = ?";
        if (pacienteIdStr != null && !pacienteIdStr.isEmpty()) {
            sql += " AND idPaciente = ?";
        }
        
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            if (pacienteIdStr != null && !pacienteIdStr.isEmpty()) {
                pstmt.setInt(2, Integer.parseInt(pacienteIdStr));
            }
            
            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Cita cancelada exitosamente\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"Cita no encontrada\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}