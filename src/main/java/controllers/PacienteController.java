package controllers;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import config.Database;
import io.javalin.http.Context;
import models.Paciente;

public class PacienteController {

    // ==========================================
    // 1. CREAR PACIENTE (Registro)
    // Ruta: POST /api/paciente
    // ==========================================
    public static void crearPaciente(Context ctx) { 
        try {
            Paciente nuevoPaciente = ctx.bodyAsClass(Paciente.class);
            int idGenerado = guardarEnBaseDeDatos(nuevoPaciente);

            if (idGenerado > 0) {
                crearTratamientoVacio(idGenerado);
                
                // Aseguramos que el objeto devuelto al registrarse incluya los datos personales
                String nombresStr = nuevoPaciente.getNombres() != null ? nuevoPaciente.getNombres() : "";
                String apellidoPatStr = nuevoPaciente.getApellidoPaterno() != null ? nuevoPaciente.getApellidoPaterno() : "";
                String apellidoMatStr = nuevoPaciente.getApellidoMaterno() != null ? nuevoPaciente.getApellidoMaterno() : "";
                String emailStr = nuevoPaciente.getEmail() != null ? nuevoPaciente.getEmail() : "";

                String jsonResponse = String.format(
                    "{\"success\": true, \"message\": \"Paciente registrado exitosamente.\", \"idPaciente\": %d, \"nombres\": \"%s\", \"apellidoPaterno\": \"%s\", \"apellidoMaterno\": \"%s\", \"email\": \"%s\"}",
                    idGenerado,
                    nombresStr,
                    apellidoPatStr,
                    apellidoMatStr,
                    emailStr
                );

                ctx.status(201).json(jsonResponse);
            } else {
                ctx.status(400).json("{\"success\": false, \"message\": \"No se pudo registrar el paciente.\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"Error interno: " + e.getMessage() + "\"}");
        }
    }
    
    private static int guardarEnBaseDeDatos(Paciente p) throws Exception {
        String sql = "INSERT INTO PACIENTE (nombres, apellidoPaterno, apellidoMaterno, email, contrasena) VALUES (?, ?, ?, ?, ?)";
        
        // Protegemos la inserción por si el frontend manda todo en 'nombres'
        String nombresOriginales = p.getNombres() != null ? p.getNombres().trim() : "";
        String nombreFinal = nombresOriginales;
        String apellidoPaternoFinal = p.getApellidoPaterno();
        String apellidoMaternoFinal = p.getApellidoMaterno();

        if ((apellidoPaternoFinal == null || apellidoPaternoFinal.isEmpty()) && nombresOriginales.contains(" ")) {
            String[] palabras = nombresOriginales.split("\\s+");
            int total = palabras.length;

            if (total >= 4) {
                apellidoMaternoFinal = palabras[total - 1];
                apellidoPaternoFinal = palabras[total - 2];
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < total - 2; i++) {
                    if (i > 0) sb.append(" ");
                    sb.append(palabras[i]);
                }
                nombreFinal = sb.toString();
            } else if (total == 3) {
                nombreFinal = palabras[0];
                apellidoPaternoFinal = palabras[1];
                apellidoMaternoFinal = palabras[2];
            } else if (total == 2) {
                nombreFinal = palabras[0];
                apellidoPaternoFinal = palabras[1];
            }
        }
        
        if (apellidoPaternoFinal == null || apellidoPaternoFinal.isEmpty()) {
            apellidoPaternoFinal = "Sin apellido";
        }

        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setString(1, nombreFinal);
            pstmt.setString(2, apellidoPaternoFinal);
            pstmt.setString(3, apellidoMaternoFinal);
            pstmt.setString(4, p.getEmail());
            pstmt.setString(5, p.getContrasena());

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

    private static void crearTratamientoVacio(int idPaciente) throws Exception {
        String sql = "INSERT INTO TRATAMIENTO (idPaciente, fechaInicio) VALUES (?, CURDATE())";
        try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, idPaciente);
            pstmt.executeUpdate();
        }
    }

    // ==========================================
    // 2. INICIAR SESIÓN (Login)
    // Ruta: POST /api/paciente/login   
    // ==========================================
    public static void login(Context ctx) {
        try {
            Paciente credenciales = ctx.bodyAsClass(Paciente.class);
            String email = credenciales.getEmail();
            String contrasena = credenciales.getContrasena();

            String sql = "SELECT idPaciente, nombres, apellidoPaterno, apellidoMaterno, email FROM PACIENTE WHERE email = ? AND contrasena = ?";

            try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

                pstmt.setString(1, email);
                pstmt.setString(2, contrasena);

                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        int idEncontrado = rs.getInt("idPaciente");
                        String nombres = rs.getString("nombres");
                        String apellidoPaterno = rs.getString("apellidoPaterno");
                        String apellidoMaterno = rs.getString("apellidoMaterno");
                        String emailDB = rs.getString("email");

                        String jsonResponse = String.format(
                            "{\"success\": true, \"idPaciente\": %d, \"nombres\": \"%s\", \"apellidoPaterno\": \"%s\", \"apellidoMaterno\": \"%s\", \"email\": \"%s\"}",
                            idEncontrado,
                            nombres != null ? nombres : "",
                            apellidoPaterno != null ? apellidoPaterno : "",
                            apellidoMaterno != null ? apellidoMaterno : "",
                            emailDB != null ? emailDB : ""
                        );

                        ctx.status(200).json(jsonResponse);
                    } else {
                        ctx.status(401).json("{\"success\": false, \"message\": \"Correo o contraseña incorrectos\"}");
                    }
                }
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"Error interno en login: " + e.getMessage() + "\"}");
        }
    }

    // ==========================================
    // 3. OBTENER TODOS LOS PACIENTES
    // Ruta: GET /api/paciente
    // ==========================================
    public static void obtenerTodos(Context ctx) {
        String sql = "SELECT * FROM PACIENTE";
        List<Paciente> lista = new ArrayList<>();

        try (Connection conn = Database.getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Paciente p = new Paciente();
                p.setIdPaciente(rs.getInt("idPaciente"));
                p.setNombres(rs.getString("nombres"));
                p.setApellidoPaterno(rs.getString("apellidoPaterno"));
                p.setApellidoMaterno(rs.getString("apellidoMaterno"));
                p.setFechaNacimiento(rs.getDate("fechaNacimiento"));
                p.setGenero(rs.getString("genero"));
                p.setTelefono(rs.getString("telefono"));
                p.setEmail(rs.getString("email"));
                lista.add(p);
            }
            ctx.status(200).json(lista);
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ==========================================
    // 4. ACTUALIZAR PACIENTE
    // Ruta: PUT /api/paciente/{id}
    // ==========================================
    public static void actualizarPaciente(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        Paciente p = ctx.bodyAsClass(Paciente.class);

        String sql = "UPDATE PACIENTE SET nombres=?, apellidoPaterno=?, apellidoMaterno=?, fechaNacimiento=?, genero=?, telefono=?, email=? WHERE idPaciente=?";

        try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, p.getNombres());
            pstmt.setString(2, p.getApellidoPaterno());
            pstmt.setString(3, p.getApellidoMaterno());
            pstmt.setDate(4, p.getFechaNacimiento());
            pstmt.setString(5, p.getGenero());
            pstmt.setString(6, p.getTelefono());
            pstmt.setString(7, p.getEmail());
            pstmt.setInt(8, id);

            int filas = pstmt.executeUpdate();
            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Paciente actualizado\"}");
            } else {
                ctx.status(404).json("{\"success\": false, \"message\": \"Paciente no encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ==========================================
    // 5. ELIMINAR PACIENTE
    // Ruta: DELETE /api/paciente/{id}
    // ==========================================
    public static void eliminarPaciente(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement("DELETE FROM PACIENTE WHERE idPaciente = ?")) {

            pstmt.setInt(1, id);
            int filas = pstmt.executeUpdate();

            if (filas > 0) {
                ctx.status(200).json("{\"success\": true, \"message\": \"Paciente eliminado\"}");
            } else {
                ctx.status(404).json("{\"message\": \"No encontrado\"}");
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ==========================================
    // 6. OBTENER TRATAMIENTO DEL PACIENTE
    // ==========================================
    public static void obtenerTratamientoPorPaciente(Context ctx) {
        int idPaciente = Integer.parseInt(ctx.pathParam("id"));
        String sql = "SELECT * FROM TRATAMIENTO WHERE idPaciente = ? LIMIT 1";

        try (Connection conn = Database.getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, idPaciente);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    models.Tratamiento t = new models.Tratamiento();
                    t.setIdTratamiento(rs.getInt("idTratamiento"));
                    t.setIdPaciente(rs.getInt("idPaciente"));
                    t.setObjetivo(rs.getString("objetivo"));
                    t.setAlimentacion(rs.getString("alimentacion"));
                    t.setEjercicioDescripcion(rs.getString("ejercicioDescripcion"));
                    t.setEjercicio(rs.getString("ejercicio"));
                    t.setMenuExcel(rs.getString("menuExcel"));

                    ctx.status(200).json(t);
                } else {
                    ctx.status(404).json("{\"message\": \"No hay tratamiento activo\"}");
                }
            }
        } catch (Exception e) {
            ctx.status(500).json("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}